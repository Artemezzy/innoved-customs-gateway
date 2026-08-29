import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { useLKLanguage } from '@/contexts/LKLanguageContext';
import { lkT } from '@/lib/lkTranslations';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Props {
  shipmentId: number;
  itemIds: number[];
  onClose: () => void;
  onSuccess: () => void;
}

function formatDocNumber(n: number) {
  return 'ИН-' + String(n).padStart(6, '0');
}

export function GenerateCertRequestModal({ shipmentId, itemIds, onClose, onSuccess }: Props) {
  const { language } = useLKLanguage();
  const [certCenterId, setCertCenterId] = useState<string>('');
  const [confirmedDespiteUsage, setConfirmedDespiteUsage] = useState(false);

  const centers = useQuery({
    queryKey: ['lk', 'cert-centers-all'],
    queryFn: () => lkApi.certCenters(),
  });

  const usage = useQuery({
    queryKey: ['lk', 'shipment-items-usage', shipmentId, itemIds],
    queryFn: () => lkApi.checkShipmentItemsUsage(shipmentId, itemIds),
    enabled: itemIds.length > 0,
  });

  const usedItems = usage.data?.used ?? [];
  const hasUsageWarning = usedItems.length > 0;

  const generate = useMutation({
    mutationFn: () => lkApi.generateCertRequestFromShipment(shipmentId, Number(certCenterId), itemIds),
    onSuccess: () => {
      toast.success('Заявка на сертификацию сформирована');
      onSuccess();
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось сформировать заявку'),
  });

  useEffect(() => {
    setConfirmedDespiteUsage(false);
  }, [itemIds.join(',')]);

  const canSubmit = !!certCenterId && (!hasUsageWarning || confirmedDespiteUsage);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{lkT('modal_generate_cert_request_title', language)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label>{lkT('label_cert_center', language)}</Label>
            <Select value={certCenterId} onValueChange={setCertCenterId}>
              <SelectTrigger>
                <SelectValue placeholder={lkT('placeholder_select_center', language)} />
              </SelectTrigger>
              <SelectContent>
                {centers.data?.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm text-muted-foreground">{lkT('label_selected_count', language)} {itemIds.length}</p>

          {usage.isLoading && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {lkT('checking_usage', language)}
            </p>
          )}

          {hasUsageWarning && (
            <div className="rounded-md border border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30 p-3 space-y-2">
              <div className="flex items-start gap-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  {usedItems.length === 1
                    ? lkT('usage_warning_single', language)
                    : `${usedItems.length} ${lkT('usage_warning_multi', language)}`}
                </span>
              </div>
              <ul className="text-sm space-y-1 pl-6 list-disc">
                {usedItems.map((u, idx) => (
                  <li key={idx}>
                    {u.cert_center_name} (№{formatDocNumber(u.document_number)})
                  </li>
                ))}
              </ul>
              <label className="flex items-center gap-2 text-sm pt-1">
                <input
                  type="checkbox"
                  checked={confirmedDespiteUsage}
                  onChange={(e) => setConfirmedDespiteUsage(e.target.checked)}
                />
                {lkT('checkbox_confirm_anyway', language)}
              </label>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {lkT('btn_cancel', language)}
          </Button>
          <Button onClick={() => generate.mutate()} disabled={!canSubmit || generate.isPending}>
            {generate.isPending ? 'Формирование…' : lkT('btn_generate_request', language)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
