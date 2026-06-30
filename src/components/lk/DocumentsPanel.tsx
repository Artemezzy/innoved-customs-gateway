import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, FileText, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DOC_TYPES = [
  'Инвойс',
  'Упаковочный лист',
  'Контракт',
  'Декларация',
  'Сертификат',
  'Коносамент / CMR',
  'Прочее',
];

interface Props {
  shipmentId: number;
}

export function DocumentsPanel({ shipmentId }: Props) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState(DOC_TYPES[0]);
  const [visible, setVisible] = useState(true);
  const [editable, setEditable] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['lk', 'documents', shipmentId],
    queryFn: () => lkApi.documents(shipmentId),
  });

  const upload = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error('Выберите файл');
      const fd = new FormData();
      fd.append('file', file);
      fd.append('doc_type', docType);
      fd.append('uploader_role', user?.role || 'client');
      fd.append('visible_to_client', visible ? '1' : '0');
      fd.append('editable_by_client', editable ? '1' : '0');
      return lkApi.uploadDocument(shipmentId, fd);
    },
    onSuccess: () => {
      toast.success('Документ загружен');
      qc.invalidateQueries({ queryKey: ['lk', 'documents', shipmentId] });
      setOpen(false);
      setFile(null);
      setDocType(DOC_TYPES[0]);
      setVisible(true);
      setEditable(false);
    },
    onError: (e: any) => toast.error(e.message || 'Ошибка загрузки'),
  });

  const remove = useMutation({
    mutationFn: (docId: number) => lkApi.deleteDocument(shipmentId, docId),
    onSuccess: () => {
      toast.success('Документ удалён');
      qc.invalidateQueries({ queryKey: ['lk', 'documents', shipmentId] });
    },
    onError: (e: any) => toast.error(e.message || 'Ошибка'),
  });

  const visibleDocs =
    user?.role === 'manager' ? data || [] : (data || []).filter((d) => d.visible_to_client);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Документы</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Upload className="h-4 w-4 mr-1.5" />
              Загрузить
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Загрузить документ</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="file">Файл</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
              <div>
                <Label>Тип документа</Label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOC_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {user?.role === 'manager' && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="vis">Виден клиенту</Label>
                    <Switch id="vis" checked={visible} onCheckedChange={setVisible} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit">Клиент может редактировать</Label>
                    <Switch id="edit" checked={editable} onCheckedChange={setEditable} />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Отмена
              </Button>
              <Button onClick={() => upload.mutate()} disabled={upload.isPending || !file}>
                {upload.isPending ? 'Загрузка…' : 'Загрузить'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}
      {error && <div className="text-sm text-destructive">Ошибка загрузки документов</div>}
      {!isLoading && visibleDocs.length === 0 && (
        <Card className="p-6 text-center text-sm text-muted-foreground">
          Документов пока нет
        </Card>
      )}

      <div className="space-y-2">
        {visibleDocs.map((d) => (
          <Card key={d.id} className="p-3 flex items-center gap-3">
            <div className="rounded-md bg-muted p-2">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{d.filename_original}</div>
              <div className="text-xs text-muted-foreground">
                {d.doc_type} · {new Date(d.created_at).toLocaleString('ru-RU')}
                {user?.role === 'manager' && (
                  <> · {d.visible_to_client ? 'виден клиенту' : 'скрыт'}</>
                )}
              </div>
            </div>
            <Button variant="ghost" size="icon" title="Скачать">
              <Download className="h-4 w-4" />
            </Button>
            {user?.role === 'manager' && (
              <Button
                variant="ghost"
                size="icon"
                title="Удалить"
                onClick={() => remove.mutate(d.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
