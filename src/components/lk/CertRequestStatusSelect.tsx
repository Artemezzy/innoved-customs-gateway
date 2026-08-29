import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { useLKLanguage } from '@/contexts/LKLanguageContext';
import { lkT, LKDictKey } from '@/lib/lkTranslations';
import { CertRequestStatus, CERT_STATUS_ORDER } from '@/types/lk';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  requestId: number;
  value: CertRequestStatus;
  disabled?: boolean;
}

const CERT_STATUS_KEY_MAP: Record<CertRequestStatus, LKDictKey> = {
  open: 'cert_status_open',
  estimation: 'cert_status_estimation',
  documents_pending: 'cert_status_documents_pending',
  layout_approved: 'cert_status_layout_approved',
  payment: 'cert_status_payment',
  certificate_issued: 'cert_status_certificate_issued',
  rejected: 'cert_status_rejected',
  closed: 'cert_status_closed',
};

export function CertRequestStatusSelect({ requestId, value, disabled }: Props) {
  const qc = useQueryClient();
  const { language } = useLKLanguage();
  const mut = useMutation({
    mutationFn: (s: CertRequestStatus) => lkApi.updateCertRequestStatus(requestId, s),
    onSuccess: () => {
      toast.success('Статус обновлён');
      qc.invalidateQueries({ queryKey: ['lk', 'cert-requests'] });
      qc.invalidateQueries({ queryKey: ['lk', 'cert-request', requestId] });
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось обновить статус'),
  });

  return (
    <Select
      value={value}
      onValueChange={(v) => mut.mutate(v as CertRequestStatus)}
      disabled={disabled || mut.isPending}
    >
      <SelectTrigger className="w-[220px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {CERT_STATUS_ORDER.map((s) => (
          <SelectItem key={s} value={s}>
            {lkT(CERT_STATUS_KEY_MAP[s], language)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}