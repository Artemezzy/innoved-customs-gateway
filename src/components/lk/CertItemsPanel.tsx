import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Loader2,
  Paperclip,
  Plus,
  Save,
  SquareCheckBig,
  Trash2,
} from 'lucide-react';
import { CertFilesPanel } from '@/components/lk/CertFilesPanel';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { CertRequest, CertRequestItem } from '@/types/lk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
  request: CertRequest;
  items: CertRequestItem[];
  canEditHeader?: boolean;
}

type RequestInfoKey =
  | 'applicant_org'
  | 'applicant_address'
  | 'applicant_head'
  | 'applicant_position'
  | 'applicant_email'
  | 'manufacturer_org'
  | 'manufacturer_address'
  | 'manufacturer_country';

const PRODUCT_FIELDS: Array<{
  key: keyof Omit<CertRequestItem, 'id' | 'position_no' | 'is_checked'>;
  label: string;
  textarea?: boolean;
  rows?: number;
  tone: 'green' | 'yellow';
}> = [
  { key: 'product', label: 'Наименование продукции', tone: 'green' },
  { key: 'tech_description', label: 'Техническое описание', textarea: true, rows: 4, tone: 'green' },
  { key: 'model_article', label: 'Модель / артикул', tone: 'green' },
  { key: 'trademark', label: 'Торговая марка', tone: 'green' },
  { key: 'tn_ved', label: 'ТН ВЭД', tone: 'green' },
  { key: 'contract_invoice', label: 'Контракт / Договор / Инвойс', tone: 'green' },
  { key: 'quantity', label: 'Количество', tone: 'green' },
  { key: 'tr_ts', label: 'ТР ТС', textarea: true, rows: 4, tone: 'yellow' },
  { key: 'cert_form', label: 'Форма сертификации', tone: 'yellow' },
  { key: 'cert_scheme', label: 'Схема сертификации', tone: 'yellow' },
  { key: 'cost', label: 'Стоимость', tone: 'yellow' },
  { key: 'production_deadline', label: 'Срок изготовления', tone: 'yellow' },
  { key: 'samples_required', label: 'Необходимость образцов', tone: 'yellow' },
  { key: 'samples_city', label: 'В какой город доставлять образцы', tone: 'yellow' },
  { key: 'comment', label: 'Комментарий / Дополнительно', textarea: true, rows: 3, tone: 'yellow' },
];

const toneClass = (tone: 'green' | 'yellow') =>
  tone === 'green'
    ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900'
    : 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900';

export function CertItemsPanel({ requestId, request, items, canEditHeader = false }: Props) {
  const qc = useQueryClient();
  const [requestValues, setRequestValues] = useState({
    applicant_org: request.applicant_org || '',
    applicant_address: request.applicant_address || '',
    applicant_head: request.applicant_head || '',
    applicant_position: request.applicant_position || '',
    applicant_email: request.applicant_email || '',
    manufacturer_org: request.manufacturer_org || '',
    manufacturer_address: request.manufacturer_address || '',
    manufacturer_country: request.manufacturer_country || '',
  });

  useEffect(() => {
    setRequestValues({
      applicant_org: request.applicant_org || '',
      applicant_address: request.applicant_address || '',
      applicant_head: request.applicant_head || '',
      applicant_position: request.applicant_position || '',
      applicant_email: request.applicant_email || '',
      manufacturer_org: request.manufacturer_org || '',
      manufacturer_address: request.manufacturer_address || '',
      manufacturer_country: request.manufacturer_country || '',
    });
  }, [request]);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['lk', 'cert-request', requestId] });
    qc.invalidateQueries({ queryKey: ['lk', 'cert-requests'] });
  };

  const updateRequestInfo = useMutation({
    mutationFn: (data: Partial<CertRequest>) => lkApi.updateCertRequestInfo(requestId, data),
    onSuccess: () => {
      toast.success('Данные заявки сохранены');
      invalidate();
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось сохранить данные заявки'),
  });

  const addItem = useMutation({
    mutationFn: () => lkApi.addCertRequestItem(requestId),
    onSuccess: () => {
      toast.success('Позиция добавлена');
      invalidate();
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось добавить'),
  });

  const checkedItems = useMemo(() => items.filter((item) => item.is_checked), [items]);

  const generateDoc = useMutation({
    mutationFn: () => lkApi.generateCertRequestDoc(requestId, checkedItems.map((i) => i.id)),
    onError: (e: any) => toast.error(e?.message || 'Не удалось сформировать заявку'),
  });

  const setRequestField = (key: RequestInfoKey, value: string) => {
    setRequestValues((prev) => ({ ...prev, [key]: value }));
  };

  const saveRequestField = (key: RequestInfoKey) => {
    if (!canEditHeader) return;
    if (requestValues[key] !== (request[key] || '')) {
      updateRequestInfo.mutate({ [key]: requestValues[key] } as Partial<CertRequest>);
    }
  };

  const saveRequestBlock = (keys: RequestInfoKey[]) => {
    if (!canEditHeader) return;
    const diff: Partial<CertRequest> = {};
    keys.forEach((key) => {
      if (requestValues[key] !== (request[key] || '')) {
        (diff as any)[key] = requestValues[key];
      }
    });
    if (Object.keys(diff).length === 0) {
      toast.info('Нет изменений');
      return;
    }
    updateRequestInfo.mutate(diff);
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="text-lg font-semibold">Заявитель</h3>
          {canEditHeader && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => saveRequestBlock(['applicant_org','applicant_address','applicant_head','applicant_position','applicant_email'])}
              disabled={updateRequestInfo.isPending}
            >
              <Save className="h-4 w-4 mr-1.5" /> Сохранить блок
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label>Название организации</Label>
            <Input
              value={requestValues.applicant_org}
              onChange={(e) => setRequestField('applicant_org', e.target.value)}
              onBlur={() => saveRequestField('applicant_org')}
              disabled={!canEditHeader}
            />
          </div>
          <div>
            <Label>Юридический адрес</Label>
            <Input
              value={requestValues.applicant_address}
              onChange={(e) => setRequestField('applicant_address', e.target.value)}
              onBlur={() => saveRequestField('applicant_address')}
              disabled={!canEditHeader}
            />
          </div>
          <div>
            <Label>Руководитель</Label>
            <Input
              value={requestValues.applicant_head}
              onChange={(e) => setRequestField('applicant_head', e.target.value)}
              onBlur={() => saveRequestField('applicant_head')}
              disabled={!canEditHeader}
            />
          </div>
          <div>
            <Label>Должность</Label>
            <Input
              value={requestValues.applicant_position}
              onChange={(e) => setRequestField('applicant_position', e.target.value)}
              onBlur={() => saveRequestField('applicant_position')}
              disabled={!canEditHeader}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Электронная почта</Label>
            <Input
              type="email"
              value={requestValues.applicant_email}
              onChange={(e) => setRequestField('applicant_email', e.target.value)}
              onBlur={() => saveRequestField('applicant_email')}
              disabled={!canEditHeader}
            />
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="text-lg font-semibold">Изготовитель</h3>
          {canEditHeader && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => saveRequestBlock(['manufacturer_org','manufacturer_address','manufacturer_country'])}
              disabled={updateRequestInfo.isPending}
            >
              <Save className="h-4 w-4 mr-1.5" /> Сохранить блок
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label>Название организации</Label>
            <Input
              value={requestValues.manufacturer_org}
              onChange={(e) => setRequestField('manufacturer_org', e.target.value)}
              onBlur={() => saveRequestField('manufacturer_org')}
              disabled={!canEditHeader}
            />
          </div>
          <div>
            <Label>Адрес</Label>
            <Input
              value={requestValues.manufacturer_address}
              onChange={(e) => setRequestField('manufacturer_address', e.target.value)}
              onBlur={() => saveRequestField('manufacturer_address')}
              disabled={!canEditHeader}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Страна</Label>
            <Input
              value={requestValues.manufacturer_country}
              onChange={(e) => setRequestField('manufacturer_country', e.target.value)}
              onBlur={() => saveRequestField('manufacturer_country')}
              disabled={!canEditHeader}
            />
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="text-lg font-semibold">Продукция</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              onClick={() => generateDoc.mutate()}
              disabled={checkedItems.length === 0 || generateDoc.isPending}
            >
              <FileText className="h-4 w-4 mr-1.5" />
              {generateDoc.isPending ? 'Формирование…' : 'Сформировать заявку'}
            </Button>
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

        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="p-2 text-left w-12">✓</th>
                <th className="p-2 text-left w-10">№</th>
                {PRODUCT_FIELDS.map((f) => (
                  <th key={f.key} className="p-2 text-left font-medium whitespace-nowrap">{f.label}</th>
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

        <div className="xl:hidden space-y-4">
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
      </Card>
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
  }, [item]);

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

  const setField = (key: keyof CertRequestItem, v: string | boolean) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const saveIfChanged = (key: keyof CertRequestItem) => {
    if ((values as any)[key] !== (item as any)[key]) {
      update.mutate({ [key]: (values as any)[key] } as Partial<CertRequestItem>);
    }
  };

  const saveAll = () => {
    const diff: Partial<CertRequestItem> = {};
    const keys: (keyof CertRequestItem)[] = ['is_checked', ...PRODUCT_FIELDS.map((f) => f.key as keyof CertRequestItem)];
    for (const key of keys) {
      if ((values as any)[key] !== (item as any)[key]) {
        (diff as any)[key] = (values as any)[key];
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

  if (variant === 'row') {
    const colCount = 2 + PRODUCT_FIELDS.length + 1;
    return (
      <>
        <tr className="align-top border-b">
          <td className="p-2">
            <div className="flex items-center justify-center pt-2">
              <Checkbox
                checked={!!values.is_checked}
                onCheckedChange={(checked) => {
                  const next = !!checked;
                  setField('is_checked', next);
                  update.mutate({ is_checked: next });
                }}
              />
            </div>
          </td>
          <td className="p-2 text-muted-foreground">
            <div className="flex items-center gap-1">
              {item.position_no}
              {busy && <Loader2 className="h-3 w-3 animate-spin" />}
            </div>
          </td>
          {PRODUCT_FIELDS.map((f) => (
            <td key={f.key} className="p-1.5 min-w-[180px]">
              {f.textarea ? (
                <Textarea
                  rows={f.rows ?? 3}
                  value={(values as any)[f.key] || ''}
                  onChange={(e) => setField(f.key as keyof CertRequestItem, e.target.value)}
                  onBlur={() => saveIfChanged(f.key as keyof CertRequestItem)}
                  className={`min-w-[240px] ${toneClass(f.tone)}`}
                />
              ) : (
                <Input
                  value={(values as any)[f.key] || ''}
                  onChange={(e) => setField(f.key as keyof CertRequestItem, e.target.value)}
                  onBlur={() => saveIfChanged(f.key as keyof CertRequestItem)}
                  className={toneClass(f.tone)}
                />
              )}
            </td>
          ))}
          <td className="p-1.5">
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" onClick={saveAll} disabled={busy} title="Сохранить строку">
                <Save className="h-4 w-4" />
              </Button>
              {deleteBtn}
            </div>
          </td>
        </tr>
        <tr className="border-b">
          <td colSpan={colCount} className="px-1.5 pb-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFilesOpen((v) => !v)}
              className="w-full justify-center"
            >
              {filesOpen ? <ChevronDown className="h-4 w-4 mr-1.5" /> : <ChevronRight className="h-4 w-4 mr-1.5" />}
              <Paperclip className="h-4 w-4 mr-1.5" />
              {filesOpen ? 'Скрыть вложения' : 'Показать вложения'} к позиции №{item.position_no}
            </Button>
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
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 font-medium">
          <Checkbox
            checked={!!values.is_checked}
            onCheckedChange={(checked) => {
              const next = !!checked;
              setField('is_checked', next);
              update.mutate({ is_checked: next });
            }}
          />
          <span>Позиция №{item.position_no}</span>
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
        {PRODUCT_FIELDS.map((f) => (
          <div key={f.key} className={f.textarea ? 'md:col-span-2' : ''}>
            <Label>{f.label}</Label>
            {f.textarea ? (
              <Textarea
                rows={f.rows ?? 3}
                value={(values as any)[f.key] || ''}
                onChange={(e) => setField(f.key as keyof CertRequestItem, e.target.value)}
                onBlur={() => saveIfChanged(f.key as keyof CertRequestItem)}
                className={toneClass(f.tone)}
              />
            ) : (
              <Input
                value={(values as any)[f.key] || ''}
                onChange={(e) => setField(f.key as keyof CertRequestItem, e.target.value)}
                onBlur={() => saveIfChanged(f.key as keyof CertRequestItem)}
                className={toneClass(f.tone)}
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

      <div className="text-xs text-muted-foreground flex items-center gap-2">
        <SquareCheckBig className="h-4 w-4" />
        Для формирования заявки будут использованы только отмеченные чек-боксом товары.
      </div>
    </Card>
  );
}
