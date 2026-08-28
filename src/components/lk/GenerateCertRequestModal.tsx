import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
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
          <DialogTitle>Сформировать заявку на сертификацию</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Сертификационный центр</Label>
            <Select value={certCenterId} onValueChange={setCertCenterId}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите центр" />
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

          <p className="text-sm text-muted-foreground">Выбрано товаров: {itemIds.length}</p>

          {usage.isLoading && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Проверка использования позиций…
            </p>
          )}

          {hasUsageWarning && (
            <div className="rounded-md border border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30 p-3 space-y-2">
              <div className="flex items-start gap-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  {usedItems.length === 1
                    ? 'Одна из выбранных позиций уже участвует в другой активной заявке:'
                    : `${usedItems.length} из выбранных позиций уже участвуют в других активных заявках:`}
                </span>
              </div>
              <ul className="text-sm space-y-1 pl-6 list-disc">
                {usedItems.map((u, idx) => (
                  <li key={idx}>
                    {u.cert_center_name} (заявка №{formatDocNumber(u.document_number)})
                  </li>
                ))}
              </ul>
              <label className="flex items-center gap-2 text-sm pt-1">
                <input
                  type="checkbox"
                  checked={confirmedDespiteUsage}
                  onChange={(e) => setConfirmedDespiteUsage(e.target.checked)}
                />
                Всё равно отправить эти позиции в новую заявку
              </label>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={() => generate.mutate()} disabled={!canSubmit || generate.isPending}>
            {generate.isPending ? 'Формирование…' : 'Сформировать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}