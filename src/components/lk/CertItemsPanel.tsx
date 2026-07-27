import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, Loader2, Paperclip, Plus, Save, Trash2 } from 'lucide-react';
import { CertFilesPanel } from '@/components/lk/CertFilesPanel';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { CertRequestItem } from '@/types/lk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Props {
  requestId: number;
  items: CertRequestItem[];
}

const FIELDS: Array<{ key: keyof Omit<CertRequestItem, 'id' | 'position_no'>; label: string; textarea?: boolean; tone: 'green' | 'yellow' }> = [
  { key: 'company', label: 'Компания', tone: 'green' },
  { key: 'product', label: 'Товар', tone: 'green' },
  { key: 'tn_ved', label: 'ТН ВЭД', tone: 'green' },
  { key: 'tech_description', label: 'Тех. описание', textarea: true, tone: 'green' },
  { key: 'tr_ts', label: 'ТР ТС', tone: 'yellow' },
  { key: 'cert_form', label: 'Форма сертификации', tone: 'yellow' },
  { key: 'cert_scheme', label: 'Схема сертификации', tone: 'yellow' },
  { key: 'cost', label: 'Стоимость', tone: 'yellow' },
  { key: 'comment', label: 'Комментарий', textarea: true, tone: 'yellow' },
];

const toneClass = (tone: 'green' | 'yellow') =>
  tone === 'green'
    ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900'
    : 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900';

export function CertItemsPanel({ requestId, items }: Props) {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['lk', 'cert-request', requestId] });
    qc.invalidateQueries({ queryKey: ['lk', 'cert-requests'] });
  };

  const addItem = useMutation({
    mutationFn: () => lkApi.addCertRequestItem(requestId),
    onSuccess: () => {
      toast.success('Позиция добавлена');
      invalidate();
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось добавить'),
  });

  return (
    <div className="space-y-4">
      {/* Desktop: table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="p-2 text-left w-10">№</th>
              {FIELDS.map((f) => (
                <th key={f.key} className="p-2 text-left font-medium">{f.label}</th>
              ))}
              <th className="p-2 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <CertItemRow
                key={item.id}
                requestId={requestId}
                item={item}
                variant="row"
                canDelete={items.length > 1}
                onInvalidate={invalidate}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/tablet: cards */}
      <div className="lg:hidden space-y-4">
        {items.map((item) => (
          <CertItemRow
            key={item.id}
            requestId={requestId}
            item={item}
            variant="card"
            canDelete={items.length > 1}
            onInvalidate={invalidate}
          />
        ))}
      </div>

      <div className="flex justify-start">
        <Button
          type="button"
          variant="outline"
          onClick={() => addItem.mutate()}
          disabled={addItem.isPending}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          {addItem.isPending ? 'Добавление…' : 'Добавить товар'}
        </Button>
      </div>
    </div>
  );
}

interface RowProps {
  requestId: number;
  item: CertRequestItem;
  variant: 'row' | 'card';
  canDelete: boolean;
  onInvalidate: () => void;
}

function CertItemRow({ requestId, item, variant, canDelete, onInvalidate }: RowProps) {
  const [values, setValues] = useState<CertRequestItem>(item);
  const [filesOpen, setFilesOpen] = useState(false);

  useEffect(() => {
    setValues(item);
  }, [item.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = useMutation({
    mutationFn: (data: Partial<CertRequestItem>) =>
      lkApi.updateCertRequestItem(requestId, item.id, data),
    onSuccess: () => onInvalidate(),
    onError: (e: any) => toast.error(e?.message || 'Не удалось сохранить'),
  });

  const remove = useMutation({
    mutationFn: () => lkApi.deleteCertRequestItem(requestId, item.id),
    onSuccess: () => {
      toast.success('Позиция удалена');
      onInvalidate();
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось удалить'),
  });

  const setField = (key: keyof CertRequestItem, v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const saveIfChanged = (key: keyof CertRequestItem) => {
    if ((values as any)[key] !== (item as any)[key]) {
      update.mutate({ [key]: (values as any)[key] } as Partial<CertRequestItem>);
    }
  };

  const saveAll = () => {
    const diff: Partial<CertRequestItem> = {};
    for (const f of FIELDS) {
      if ((values as any)[f.key] !== (item as any)[f.key]) {
        (diff as any)[f.key] = (values as any)[f.key];
      }
    }
    if (Object.keys(diff).length === 0) {
      toast.info('Нет изменений');
      return;
    }
    update.mutate(diff);
  };

  const deleteBtn = canDelete ? (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="ghost" disabled={remove.isPending} title="Удалить позицию">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить позицию №{item.position_no}?</AlertDialogTitle>
          <AlertDialogDescription>
            Данные позиции и её вложения будут удалены безвозвратно.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={() => remove.mutate()}>Удалить</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : null;

  const busy = update.isPending;

  const toggleFilesBtn = (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => setFilesOpen((v) => !v)}
      title={filesOpen ? 'Скрыть вложения' : 'Показать вложения'}
    >
      {filesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </Button>
  );

  if (variant === 'row') {
    const colCount = 1 + FIELDS.length + 1;
    return (
      <>
        <tr className="border-b align-top">
          <td className="p-2 text-muted-foreground">
            <div className="flex items-center gap-1">
              {item.position_no}
              {busy && <Loader2 className="h-3 w-3 animate-spin" />}
            </div>
          </td>
          {FIELDS.map((f) => (
            <td key={f.key} className="p-1.5 min-w-[140px]">
              {f.textarea ? (
                <Textarea
                  rows={2}
                  value={(values as any)[f.key] || ''}
                  onChange={(e) => setField(f.key, e.target.value)}
                  onBlur={() => saveIfChanged(f.key)}
                  className="min-w-[180px]"
                />
              ) : (
                <Input
                  value={(values as any)[f.key] || ''}
                  onChange={(e) => setField(f.key, e.target.value)}
                  onBlur={() => saveIfChanged(f.key)}
                />
              )}
            </td>
          ))}
          <td className="p-1.5">
            <div className="flex items-center gap-1">
              {toggleFilesBtn}
              <Button size="icon" variant="ghost" onClick={saveAll} disabled={busy} title="Сохранить строку">
                <Save className="h-4 w-4" />
              </Button>
              {deleteBtn}
            </div>
          </td>
        </tr>
        {filesOpen && (
          <tr className="border-b bg-muted/20">
            <td colSpan={colCount} className="p-4">
              <div className="flex items-center gap-2 mb-3 text-sm font-medium">
                <Paperclip className="h-4 w-4 text-primary" />
                Вложения к позиции №{item.position_no}
                {item.product ? <span className="text-muted-foreground font-normal">— {item.product}</span> : null}
              </div>
              <CertFilesPanel requestId={requestId} itemId={item.id} />
            </td>
          </tr>
        )}
      </>
    );
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium">
          Позиция №{item.position_no}
          {busy && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
        </div>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" onClick={saveAll} disabled={busy} title="Сохранить">
            <Save className="h-4 w-4" />
          </Button>
          {deleteBtn}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {FIELDS.map((f) => (
          <div key={f.key} className={f.textarea ? 'md:col-span-2' : ''}>
            <Label>{f.label}</Label>
            {f.textarea ? (
              <Textarea
                rows={3}
                value={(values as any)[f.key] || ''}
                onChange={(e) => setField(f.key, e.target.value)}
                onBlur={() => saveIfChanged(f.key)}
              />
            ) : (
              <Input
                value={(values as any)[f.key] || ''}
                onChange={(e) => setField(f.key, e.target.value)}
                onBlur={() => saveIfChanged(f.key)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="pt-2 border-t">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setFilesOpen((v) => !v)}
          className="w-full justify-start"
        >
          {filesOpen ? <ChevronDown className="h-4 w-4 mr-1.5" /> : <ChevronRight className="h-4 w-4 mr-1.5" />}
          <Paperclip className="h-4 w-4 mr-1.5" />
          Вложения к позиции №{item.position_no}
        </Button>
        {filesOpen && (
          <div className="mt-3">
            <CertFilesPanel requestId={requestId} itemId={item.id} />
          </div>
        )}
      </div>
    </Card>
  );
}

