import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, Link as LinkIcon, Download, Upload, Plus, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { useLKLanguage } from '@/contexts/LKLanguageContext';
import { lkT } from '@/lib/lkTranslations';
import { ShipmentFile } from '@/types/lk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  shipmentId: number;
  itemId: number;
}

export function ShipmentFilesPanel({ shipmentId, itemId }: Props) {
  const qc = useQueryClient();
  const { language } = useLKLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('');

  const queryKey = ['lk', 'shipment-item-files', shipmentId, itemId];

  const filesQ = useQuery({
    queryKey,
    queryFn: () => lkApi.shipmentItemFiles(shipmentId, itemId),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey });

  const uploadFile = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      return lkApi.uploadShipmentItemFile(shipmentId, itemId, fd);
    },
    onSuccess: () => {
      toast.success('Файл загружен');
      invalidate();
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось загрузить'),
  });

  const addUrl = useMutation({
    mutationFn: (u: string) => lkApi.addShipmentItemFileUrl(shipmentId, itemId, u),
    onSuccess: () => {
      toast.success('Ссылка добавлена');
      setUrl('');
      invalidate();
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось добавить ссылку'),
  });

  const deleteFile = useMutation({
    mutationFn: (fileId: number) => lkApi.deleteShipmentItemFile(shipmentId, itemId, fileId),
    onSuccess: () => {
      toast.success('Вложение удалено');
      invalidate();
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось удалить вложение'),
  });

  const handleDelete = (e: React.MouseEvent, f: ShipmentFile) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Удалить вложение?')) {
      deleteFile.mutate(f.id);
    }
  };

  const download = async (e: React.MouseEvent, f: ShipmentFile) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await lkApi.downloadShipmentItemFile(shipmentId, itemId, f.id, f.filename_original || f.filename);
    } catch (err: any) {
      toast.error(err?.message || 'Не удалось скачать');
    }
  };

  const files = filesQ.data ?? [];

  return (
    <div className="space-y-3">
      {filesQ.isLoading && (
        <p className="text-sm text-muted-foreground">{lkT('label_loading', language)}</p>
      )}
      {!filesQ.isLoading && files.length === 0 && (
        <p className="text-sm text-muted-foreground">{lkT('empty_no_attachments', language)}</p>
      )}
      {files.map((f) => {
        const isExternalLink = f.file_type === 'link' && !!f.url && /^https?:\/\//i.test(f.url);
        const displayName =
          f.file_type === 'file'
            ? f.filename_original || f.filename || `Файл №${f.id}`
            : isExternalLink
              ? f.url!
              : f.filename_original || f.filename || f.url || `Вложение №${f.id}`;

        return (
          <div key={f.id} className="flex items-center gap-2 rounded-md border p-2 text-sm">
            {isExternalLink ? <LinkIcon className="h-4 w-4 shrink-0" /> : <FileText className="h-4 w-4 shrink-0" />}
            <div className="flex min-w-0 flex-1 items-center gap-1">
              {f.file_type === 'file' && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 shrink-0"
                  onClick={(e) => download(e, f)}
                  title={lkT('btn_download', language)}
                  aria-label={lkT('btn_download', language)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}

              {isExternalLink ? (
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 flex-1 truncate underline"
                >
                  {displayName}
                </a>
              ) : (
                <span className="min-w-0 flex-1 truncate">{displayName}</span>
              )}
            </div>

            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={(e) => handleDelete(e, f)}
              disabled={deleteFile.isPending}
              title={lkT('btn_delete', language)}
              aria-label={lkT('btn_delete', language)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-2">
        <Label className="sr-only">{lkT('btn_choose_file', language)}</Label>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              uploadFile.mutate(file);
            }

            e.target.value = '';
          }}
        />

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadFile.isPending}
        >
          {uploadFile.isPending ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-1 h-4 w-4" />
          )}

          {uploadFile.isPending
            ? lkT('label_uploading', language)
            : lkT('btn_choose_file', language)}
        </Button>

        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={lkT('placeholder_url', language)}
          className="w-full sm:w-[280px]"
        />

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            const value = url.trim();

            if (!value) {
              return;
            }

            addUrl.mutate(value);
          }}
          disabled={!url.trim() || addUrl.isPending}
        >
          {addUrl.isPending ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-1 h-4 w-4" />
          )}

          {lkT('btn_add_link', language)}
        </Button>
      </div>
    </div>
  );
}