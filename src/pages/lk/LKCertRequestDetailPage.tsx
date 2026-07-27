import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { CertRequestFields } from '@/types/lk';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { CertRequestStatusSelect } from '@/components/lk/CertRequestStatusSelect';
import { CertFilesPanel } from '@/components/lk/CertFilesPanel';
import { CertChatPanel } from '@/components/lk/CertChatPanel';

const FIELDS: Array<{ key: keyof CertRequestFields; label: string; textarea?: boolean }> = [
  { key: 'company', label: 'Компания' },
  { key: 'product', label: 'Товар' },
  { key: 'tn_ved', label: 'ТН ВЭД' },
  { key: 'tech_description', label: 'Техническое описание', textarea: true },
  { key: 'tr_ts', label: 'ТР ТС' },
  { key: 'cert_form', label: 'Форма сертификации' },
  { key: 'cert_scheme', label: 'Схема сертификации' },
  { key: 'cost', label: 'Стоимость' },
  { key: 'comment', label: 'Комментарий', textarea: true },
];

const EMPTY: CertRequestFields = {
  company: '',
  product: '',
  tn_ved: '',
  tech_description: '',
  tr_ts: '',
  cert_form: '',
  cert_scheme: '',
  cost: '',
  comment: '',
};

export default function LKCertRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const requestId = Number(id);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const detail = useQuery({
    queryKey: ['lk', 'cert-request', requestId],
    queryFn: () => lkApi.certRequest(requestId),
    enabled: !!requestId,
  });

  // При успешной загрузке backend снял флаги — инвалидируем список
  useEffect(() => {
    if (detail.isSuccess) {
      qc.invalidateQueries({ queryKey: ['lk', 'cert-requests'] });
    }
  }, [detail.isSuccess, qc]);

  const form = useForm<CertRequestFields>({ defaultValues: EMPTY });

  useEffect(() => {
    if (detail.data) {
      form.reset({
        company: detail.data.company || '',
        product: detail.data.product || '',
        tn_ved: detail.data.tn_ved || '',
        tech_description: detail.data.tech_description || '',
        tr_ts: detail.data.tr_ts || '',
        cert_form: detail.data.cert_form || '',
        cert_scheme: detail.data.cert_scheme || '',
        cost: detail.data.cost || '',
        comment: detail.data.comment || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail.data?.company, detail.data?.product, detail.data?.tn_ved]);

  const save = useMutation({
    mutationFn: (d: CertRequestFields) => lkApi.updateCertRequestFields(requestId, d),
    onSuccess: () => {
      toast.success('Изменения сохранены');
      qc.invalidateQueries({ queryKey: ['lk', 'cert-request', requestId] });
      qc.invalidateQueries({ queryKey: ['lk', 'cert-requests'] });
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось сохранить'),
  });

  if (detail.isLoading) return <Skeleton className="h-96 w-full" />;
  if (detail.isError || !detail.data) {
    return (
      <div className="space-y-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/lk/cert-requests')}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> К списку
        </Button>
        <p>Заявка не найдена.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/lk/cert-requests')}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> К списку
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Статус:</span>
          <CertRequestStatusSelect requestId={requestId} value={detail.data.status} />
        </div>
      </div>

      <Card className="p-5">
        <h2 className="font-semibold mb-4">Данные заявки</h2>
        <form
          onSubmit={form.handleSubmit((d) => save.mutate(d))}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {FIELDS.map((f) => (
            <div key={f.key} className={f.textarea ? 'md:col-span-2' : ''}>
              <Label htmlFor={f.key}>{f.label}</Label>
              {f.textarea ? (
                <Textarea id={f.key} rows={4} {...form.register(f.key)} />
              ) : (
                <Input id={f.key} {...form.register(f.key)} />
              )}
            </div>
          ))}
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={save.isPending}>
              <Save className="h-4 w-4 mr-1.5" />
              {save.isPending ? 'Сохранение…' : 'Сохранить изменения'}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold mb-4">Вложения</h2>
        <CertFilesPanel requestId={requestId} files={detail.data.files} />
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold mb-4">Чат</h2>
        <CertChatPanel requestId={requestId} />
      </Card>
    </div>
  );
}
