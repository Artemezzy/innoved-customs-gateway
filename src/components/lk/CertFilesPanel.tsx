import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, Link as LinkIcon, Download, Upload, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { CertFile } from '@/types/lk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  requestId: number;
  itemId: number;
}

export function CertFilesPanel({ requestId, itemId }: Props) {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('');

  const queryKey = ['lk', 'cert-item-files', requestId, itemId];

  const filesQ = useQuery({
    queryKey,
    queryFn: () => lkApi.certItemFiles(requestId, itemId),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey });

  const uploadFile = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      return lkApi.uploadCertFile(requestId, itemId, fd);
    },
    onSuccess: () => {
      toast.success('Файл загружен');
      invalidate();
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось загрузить'),
  });

  const addUrl = useMutation({
    mutationFn: (u: string) => lkApi.addCertFileUrl(requestId, itemId, u),
    onSuccess: () => {
      toast.success('Ссылка добавлена');
      setUrl('');
      invalidate();
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось добавить ссылку'),
  });

  const download = async (f: CertFile) => {
    try {
      await lkApi.downloadCertFile(requestId, itemId, f.id, f.filename);
    } catch (e: any) {
      toast.error(e?.message || 'Не удалось скачать');
    }
  };

  const files = filesQ.data ?? [];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {filesQ.isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Загрузка вложений…
          </div>
        )}
        {!filesQ.isLoading && files.length === 0 && (
          <div className="text-sm text-muted-foreground">Вложений пока нет</div>
        )}
        {files.map((f) => (
          <div
            key={f.id}
            className="flex items-center gap-3 rounded-md border p-2 bg-background"
          >
            {f.file_type === 'file' ? (
              <FileText className="h-4 w-4 text-primary shrink-0" />
            ) : (
              <LinkIcon className="h-4 w-4 text-primary shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              {f.file_type === 'file' ? (
                <div className="truncate text-sm font-medium">{f.filename || f.url}</div>
              ) : (
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-sm text-primary hover:underline block"
                >
                  {f.url}
                </a>
              )}
            </div>
            {f.file_type === 'file' && (
              <Button
                size="sm"
                variant="default"
                onClick={() => download(f)}
                title="Скачать"
                aria-label="Скачать файл"
              >
                <Download className="h-4 w-4 mr-1.5" />
                Скачать
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t">
        <div>
          <Label>Загрузить файл</Label>
          <div className="flex gap-2 mt-1">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile.mutate(f);
                e.target.value = '';
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadFile.isPending}
            >
              <Upload className="h-4 w-4 mr-1.5" />
              {uploadFile.isPending ? 'Загрузка…' : 'Выбрать файл'}
            </Button>
          </div>
        </div>
        <div>
          <Label htmlFor={`cert-url-${itemId}`}>Добавить ссылку</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id={`cert-url-${itemId}`}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
            />
            <Button
              type="button"
              onClick={() => url.trim() && addUrl.mutate(url.trim())}
              disabled={!url.trim() || addUrl.isPending}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
