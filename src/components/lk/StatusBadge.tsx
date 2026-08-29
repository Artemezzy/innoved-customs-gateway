import { ShipmentStatus, STATUS_COLORS } from '@/types/lk';
import { useLKLanguage } from '@/contexts/LKLanguageContext';
import { lkT } from '@/lib/lkTranslations';
import { cn } from '@/lib/utils';

interface Props {
  status: ShipmentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: Props) {
  const { language } = useLKLanguage();
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_COLORS[status],
        className
      )}
    >
      {lkT(`status_${status}` as any, language)}
    </span>
  );
}
