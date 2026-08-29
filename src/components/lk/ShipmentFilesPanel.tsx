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
      await lkApi.downloadShipmentItemFile(shipmentId, itemId, f.id, f.filename);
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
            ? f.filename || `Файл №${f.id}`
            : isExternalLink
              ? f.url!
              : f.filename || f.url || `Вложение №${f.id}`;

        return (
          <div key={f.id} className="flex items-center gap-2 rounded-md border p-2 text-sm">
            {isExternalLink ? <LinkIcon className="h-4 w-4 shrink-0" /> : <FileText className="h-4 w-4 shrink-0" />}
            {isExternalLink ? (
              <a href={f.url} target="_blank" rel="noopener noreferrer" className="flex-1 truncate underline">
                {displayName}
              </a>
            ) : (
              <span className="flex-1 truncate">{displayName}</span>
            )}
            {f.file_type === 'file' && (
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => download(e, f)}
                title={lkT('btn_download', language)}
                aria-label={lkT('btn_download', language)}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => handleDelete(e, f)}
              disabled={deleteFile.isPending}
              title={lkT('btn_delete', language)}
              aria-label={lkT('btn_delete', language)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      })}

      <div className="flex items-center gap-2">
        <Label className="sr-only">{lkT('btn_choose_file', language)}</Label>
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
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadFile.isPending}
        >
          {uploadFile.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
          {uploadFile.isPending ? lkT('label_uploading', language) : lkT('btn_choose_file', language)}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={lkT('placeholder_url', language)}
        />
        <Button
          size="sm"
          onClick={() => url.trim() && addUrl.mutate(url.trim())}
          disabled={!url.trim() || addUrl.isPending}
        >
          <Plus className="h-4 w-4 mr-1" />
          {lkT('btn_add_link', language)}
        </Button>
      </div>
    </div>
  );
}