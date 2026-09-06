import { useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { useAuth } from '@/contexts/AuthContext';
import {
  ConfirmedItem,
  ConfirmedItemFileSlot,
  ConfirmedItemStatus,
  CONFIRMED_ITEM_SLOT_LABELS,
  CONFIRMED_ITEM_SLOT_ORDER,
  CONFIRMED_ITEM_STATUS_LABELS,
  CONFIRMED_ITEM_STATUS_ORDER,
} from '@/types/lk';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

function rowToneClass(status: ConfirmedItemStatus): string {
  if (status === 'rejected') return 'bg-gray-100 dark:bg-gray-900/40 text-muted-foreground';
  if (status === 'final_doc_received') return 'bg-green-50 dark:bg-green-950/30';
  return '';
}

function sortRows(rows: ConfirmedItem[]): ConfirmedItem[] {
  const weight = (r: ConfirmedItem) => {
    if (r.status === 'rejected') return 2;
    if (r.status === 'final_doc_received') return 1;
    return 0;
  };
  return [...rows].sort((a, b) => weight(a) - weight(b) || b.id - a.id);
}

export default function LKConfirmedItemsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const isManager = user?.role === 'manager';
  const isCertCenter = user?.role === 'cert_center';

  const { data, isLoading } = useQuery({
    queryKey: ['lk', 'confirmed-items'],
    queryFn: () => lkApi.confirmedItems(),
  });

  const rows = useMemo(() => sortRows(data ?? []), [data]);

  const invalidate = () => qc.invalidateQueries({ queryKey: ['lk', 'confirmed-items'] });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Подтверждённые заявки</h1>

      <Card className="p-0 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 z-10 bg-background shadow-sm">
            <tr>
              <th className="p-2 border-b text-left min-w-[220px]">Статус</th>
              <th className="p-2 border-b text-left">№</th>
              <th className="p-2 border-b text-left">Источник</th>
              <th className="p-2 border-b text-left">Дата изменения</th>
              <th className="p-2 border-b text-left min-w-[200px]">Заявитель</th>
              <th className="p-2 border-b text-left min-w-[200px]">Наименование товара</th>
              <th className="p-2 border-b text-left min-w-[140px]">ТН ВЭД</th>
              <th className="p-2 border-b text-left min-w-[160px]">Модель</th>
              <th className="p-2 border-b text-left min-w-[160px]">Торговая марка</th>
              {CONFIRMED_ITEM_SLOT_ORDER.map((slot) => (
                <th key={slot} className="p-2 border-b text-left min-w-[200px]">
                  {CONFIRMED_ITEM_SLOT_LABELS[slot]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <ConfirmedItemRow
                key={row.id}
                row={row}
                isManager={isManager}
                isCertCenter={isCertCenter}
                onInvalidate={invalidate}
              />
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={9 + CONFIRMED_ITEM_SLOT_ORDER.length} className="p-6 text-center text-muted-foreground">
                  Нет подтверждённых позиций
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

interface RowProps {
  row: ConfirmedItem;
  isManager: boolean;
  isCertCenter: boolean;
  onInvalidate: () => void;
}

function ConfirmedItemRow({ row, isManager, isCertCenter, onInvalidate }: RowProps) {
  const [values, setValues] = useState({
    product: row.product,
    tn_ved: row.tn_ved,
    model_article: row.model_article,
    trademark: row.trademark,
  });

  const applicantProfiles = useQuery({
    queryKey: ['lk', 'organization-profiles', row.client_id, 'applicant'],
    queryFn: () => (row.client_id ? lkApi.organizationProfiles(row.client_id, 'applicant') : Promise.resolve([])),
    enabled: isManager && !!row.client_id,
  });

  const clients = useQuery({
    queryKey: ['lk', 'clients'],
    queryFn: () => lkApi.clients(),
    enabled: isManager && !row.client_id,
  });

  const updateField = useMutation({
    mutationFn: (data: Partial<typeof values>) => lkApi.updateConfirmedItem(row.id, data),
    onSuccess: onInvalidate,
    onError: (e: any) => toast.error(e?.message || 'Не удалось сохранить'),
  });

  const updateClient = useMutation({
    mutationFn: (clientId: number) => lkApi.updateConfirmedItem(row.id, { client_id: clientId, applicant_profile_id: null }),
    onSuccess: onInvalidate,
    onError: (e: any) => toast.error(e?.message || 'Не удалось сохранить'),
  });

  const updateApplicant = useMutation({
    mutationFn: (profileId: number) => lkApi.updateConfirmedItem(row.id, { applicant_profile_id: profileId }),
    onSuccess: onInvalidate,
    onError: (e: any) => toast.error(e?.message || 'Не удалось сохранить'),
  });

  const updateStatus = useMutation({
    mutationFn: (status: ConfirmedItemStatus) => lkApi.updateConfirmedItemStatus(row.id, status),
    onSuccess: onInvalidate,
    onError: (e: any) => toast.error(e?.message || 'Не удалось изменить статус'),
  });

  const setField = (key: keyof typeof values, v: string) => setValues((prev) => ({ ...prev, [key]: v }));
  const saveIfChanged = (key: keyof typeof values) => {
    if (values[key] !== (row as any)[key]) updateField.mutate({ [key]: values[key] });
  };

  return (
    <tr className={cn('border-b align-top', rowToneClass(row.status))}>
      <td className="p-2">
        <Select
          value={row.status}
          onValueChange={(v) => updateStatus.mutate(v as ConfirmedItemStatus)}
          disabled={updateStatus.isPending}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CONFIRMED_ITEM_STATUS_ORDER.map((s) => (
              <SelectItem key={s} value={s} disabled={s === 'rejected' && !isManager}>
                {CONFIRMED_ITEM_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="p-2 whitespace-nowrap">{row.number}</td>
      <td className="p-2 whitespace-nowrap">{row.source_number}</td>
      <td className="p-2 whitespace-nowrap">{new Date(row.updated_at).toLocaleString('ru-RU')}</td>
      <td className="p-2">
        {isManager ? (
          row.client_id ? (
            <Select
              value={row.applicant_profile_id ? String(row.applicant_profile_id) : ''}
              onValueChange={(v) => updateApplicant.mutate(Number(v))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите заявителя" />
              </SelectTrigger>
              <SelectContent>
                {(applicantProfiles.data ?? []).map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Select onValueChange={(v) => updateClient.mutate(Number(v))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Сначала выберите клиента" />
              </SelectTrigger>
              <SelectContent>
                {(clients.data ?? []).map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        ) : (
          <span>{row.applicant_name || '—'}</span>
        )}
      </td>
      <td className="p-2">
        <Input
          value={values.product}
          onChange={(e) => setField('product', e.target.value)}
          onBlur={() => saveIfChanged('product')}
          disabled={!isManager}
        />
      </td>
      <td className="p-2">
        <Input
          value={values.tn_ved}
          onChange={(e) => setField('tn_ved', e.target.value)}
          onBlur={() => saveIfChanged('tn_ved')}
          disabled={!isManager}
        />
      </td>
      <td className="p-2">
        <Input
          value={values.model_article}
          onChange={(e) => setField('model_article', e.target.value)}
          onBlur={() => saveIfChanged('model_article')}
          disabled={!isManager}
        />
      </td>
      <td className="p-2">
        <Input
          value={values.trademark}
          onChange={(e) => setField('trademark', e.target.value)}
          onBlur={() => saveIfChanged('trademark')}
          disabled={!isManager}
        />
      </td>
      {CONFIRMED_ITEM_SLOT_ORDER.map((slot) => (
        <FileSlotCell
          key={slot}
          confirmedItemId={row.id}
          slot={slot}
          file={row.files.find((f) => f.slot === slot)}
          isManager={isManager}
          isCertCenter={isCertCenter}
          onInvalidate={onInvalidate}
        />
      ))}
    </tr>
  );
}

interface FileSlotCellProps {
  confirmedItemId: number;
  slot: ConfirmedItemFileSlot;
  file: { id: number; filename_original: string; allow_center_reupload: number } | undefined;
  isManager: boolean;
  isCertCenter: boolean;
  onInvalidate: () => void;
}

function FileSlotCell({ confirmedItemId, slot, file, isManager, isCertCenter, onInvalidate }: FileSlotCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useMutation({
    mutationFn: (f: File) => {
      const fd = new FormData();
      fd.append('file', f);
      return lkApi.uploadConfirmedItemFile(confirmedItemId, slot, fd);
    },
    onSuccess: () => {
      toast.success('Файл загружен');
      onInvalidate();
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось загрузить файл'),
  });

  const allowReupload = useMutation({
    mutationFn: () => lkApi.allowConfirmedItemReupload(confirmedItemId, slot),
    onSuccess: () => {
      toast.success('Разрешение выдано');
      onInvalidate();
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось выдать разрешение'),
  });

  const download = useMutation({
    mutationFn: () => lkApi.downloadConfirmedItemFile(confirmedItemId, slot, file?.filename_original),
    onError: (e: any) => toast.error(e?.message || 'Не удалось скачать файл'),
  });

  const canUpload = isManager || (isCertCenter && (!file || !!file.allow_center_reupload));

  return (
    <td className="p-2">
      <div className="flex items-center gap-1">
        {file ? (
          <Button size="sm" variant="ghost" className="justify-start truncate max-w-[140px]" onClick={() => download.mutate()} title={file.filename_original}>
            <Download className="h-3.5 w-3.5 mr-1 shrink-0" />
            <span className="truncate">{file.filename_original}</span>
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">Не загружен</span>
        )}

        {canUpload && (
          <>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload.mutate(f);
                e.target.value = '';
              }}
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => inputRef.current?.click()}
              disabled={upload.isPending}
              title={file ? 'Заменить файл' : 'Загрузить файл'}
            >
              {upload.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            </Button>
          </>
        )}

        {isManager && file && !file.allow_center_reupload && (
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={() => allowReupload.mutate()}
            disabled={allowReupload.isPending}
            title="Разрешить сертификационному центру заменить этот файл"
          >
            Разрешить замену СЦ
          </Button>
        )}
      </div>
    </td>
  );
}