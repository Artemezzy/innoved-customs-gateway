import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Send, Paperclip, X, FileText, Reply } from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface Props {
  shipmentId: number;
}

const ALLOWED_EXT = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'txt', 'zip'];
const MAX_SIZE = 20 * 1024 * 1024;

function validateFile(file: File): string | null {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!ALLOWED_EXT.includes(ext)) return 'Недопустимый тип файла';
  if (file.size > MAX_SIZE) return 'Файл слишком большой (макс. 20 МБ)';
  return null;
}

export function ChatPanel({ shipmentId }: Props) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [text, setText] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [replyTo, setReplyTo] = useState<any | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['lk', 'messages', shipmentId],
    queryFn: () => lkApi.messages(shipmentId),
    refetchInterval: 8000,
  });

  const send = useMutation({
    mutationFn: (payload: { text: string; file?: File | null; replyToId?: number | null }) =>
      lkApi.sendMessage(shipmentId, payload.text, payload.file, payload.replyToId),
    onSuccess: () => {
      setText('');
      setPendingFile(null);
      setReplyTo(null);
      qc.invalidateQueries({ queryKey: ['lk', 'messages', shipmentId] });
    },
    onError: (e: any) => toast.error(e.message || 'Не удалось отправить сообщение'),
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data?.length]);

  const pickFile = (file: File | undefined | null) => {
    if (!file) return;
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }
    setPendingFile(file);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t && !pendingFile) return;
    send.mutate({ text: t, file: pendingFile, replyToId: replyTo?.id ?? null });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const scrollToMessage = (id: number) => {
    const el = messageRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-primary/60');
      setTimeout(() => el.classList.remove('ring-2', 'ring-primary/60'), 1500);
    }
  };

  return (
    <div
      className="flex flex-col h-[500px]"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
    >
      <div
        className={cn(
          'flex-1 overflow-y-auto p-4 space-y-3 rounded-md transition-colors',
          isDragging && 'bg-primary/5 ring-2 ring-primary/40 ring-inset'
        )}
      >
        {isLoading && (
          <>
            <Skeleton className="h-14 w-2/3" />
            <Skeleton className="h-14 w-1/2 ml-auto" />
          </>
        )}
        {!isLoading && data && data.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">Сообщений пока нет</p>
        )}
        {data?.map((m: any) => {
          const mine = m.role === user?.role;
          return (
            <div
              key={m.id}
              ref={(el) => { messageRefs.current[m.id] = el; }}
              className={cn('flex flex-col max-w-[80%] rounded-lg transition-shadow', mine ? 'ml-auto items-end' : 'items-start')}
            >
              <span className="text-xs text-muted-foreground mb-1">
                {m.sender_name} · {new Date(m.created_at).toLocaleString('ru-RU')}
              </span>
              <div
                className={cn(
                  'rounded-lg px-3 py-2 text-sm group relative',
                  mine ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                {m.reply_to_id && (
                  <button
                    type="button"
                    onClick={() => scrollToMessage(m.reply_to_id)}
                    className={cn(
                      'block w-full text-left mb-1.5 pl-2 border-l-2 text-xs opacity-80 hover:opacity-100',
                      mine ? 'border-primary-foreground/50' : 'border-foreground/30'
                    )}
                  >
                    <span className="font-medium">{m.reply_sender_name || 'Сообщение'}</span>
                    <br />
                    <span className="line-clamp-1">
                      {m.reply_text || m.reply_attachment_original || 'вложение'}
                    </span>
                  </button>
                )}
                {m.text && <p className="whitespace-pre-wrap break-words">{m.text}</p>}
                {m.attachment_original && (
                  <button
                    type="button"
                    onClick={() => lkApi.downloadMessageFile(shipmentId, m.id, m.attachment_original)}
                    className={cn(
                      'flex items-center gap-2 mt-1 text-xs underline underline-offset-2',
                      mine ? 'text-primary-foreground' : 'text-foreground'
                    )}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    {m.attachment_original}
                  </button>
                )}
                <button
                  type="button"
                  title="Ответить"
                  onClick={() => setReplyTo(m)}
                  className={cn(
                    'absolute -top-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-background border p-1 shadow-sm',
                    mine ? '-left-2' : '-right-2'
                  )}
                >
                  <Reply className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {replyTo && (
        <div className="flex items-start gap-2 px-3 py-2 border-t bg-muted/50 text-sm">
          <Reply className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground">{replyTo.sender_name}</p>
            <p className="truncate">{replyTo.text || replyTo.attachment_original || 'вложение'}</p>
          </div>
          <button type="button" onClick={() => setReplyTo(null)} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {pendingFile && (
        <div className="flex items-center gap-2 px-3 py-2 border-t bg-muted/50 text-sm">
          <FileText className="h-4 w-4 shrink-0" />
          <span className="truncate flex-1">{pendingFile.name}</span>
          <button type="button" onClick={() => setPendingFile(null)} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <form onSubmit={onSubmit} className="flex items-center gap-2 p-3 border-t">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={ALLOWED_EXT.map((e) => `.${e}`).join(',')}
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={send.isPending}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введите сообщение…"
          disabled={send.isPending}
        />
        <Button type="submit" size="icon" disabled={send.isPending || (!text.trim() && !pendingFile)}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
