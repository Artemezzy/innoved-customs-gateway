import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { CertRequestStatus, CERT_STATUS_LABELS } from '@/types/lk';
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

export function CertRequestStatusSelect({ requestId, value, disabled }: Props) {
  const qc = useQueryClient();
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
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(CERT_STATUS_LABELS) as CertRequestStatus[]).map((s) => (
          <SelectItem key={s} value={s}>
            {CERT_STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
