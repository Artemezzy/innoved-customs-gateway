import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { lkApi } from '@/api/lkClient';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface Props {
  shipmentId: number;
}

export function ChatPanel({ shipmentId }: Props) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['lk', 'messages', shipmentId],
    queryFn: () => lkApi.messages(shipmentId),
    refetchInterval: 8000,
  });

  const send = useMutation({
    mutationFn: (t: string) =>
      lkApi.sendMessage(shipmentId, t, user
        ? { role: user.role, name: user.name, user_id: user.id }
        : undefined),
    onSuccess: () => {
      setText('');
      qc.invalidateQueries({ queryKey: ['lk', 'messages', shipmentId] });
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data?.length]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    send.mutate(t);
  };

  return (
    <div className="flex flex-col h-[60vh] min-h-[400px]">
      <div className="flex-1 overflow-y-auto space-y-3 p-1">
        {isLoading && (
          <>
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-12 w-2/3 ml-auto" />
          </>
        )}
        {!isLoading && data && data.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">
            Сообщений пока нет
          </div>
        )}
        {data?.map((m) => {
          const mine = m.role === user?.role;
          const isManagerMsg = m.role === 'manager';
          return (
            <div
              key={m.id}
              className={cn('flex flex-col max-w-[80%]', mine ? 'ml-auto items-end' : 'items-start')}
            >
              <div className="text-xs text-muted-foreground mb-1 px-1">
                {m.sender_name} · {new Date(m.created_at).toLocaleString('ru-RU')}
              </div>
              <div
                className={cn(
                  'rounded-2xl px-4 py-2 text-sm',
                  isManagerMsg
                    ? 'bg-primary text-primary-foreground rounded-bl-sm'
                    : 'bg-muted text-foreground rounded-br-sm'
                )}
              >
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-2 border-t pt-3 mt-3">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введите сообщение…"
          disabled={send.isPending}
        />
        <Button type="submit" disabled={send.isPending || !text.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
