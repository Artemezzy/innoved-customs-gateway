import { CertRequestStatus, CERT_STATUS_COLORS, CERT_STATUS_LABELS } from '@/types/lk';
import { cn } from '@/lib/utils';

interface Props {
  status: CertRequestStatus;
  className?: string;
}

export function CertStatusBadge({ status, className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        CERT_STATUS_COLORS[status],
        className
      )}
    >
      {CERT_STATUS_LABELS[status]}
    </span>
  );
}
