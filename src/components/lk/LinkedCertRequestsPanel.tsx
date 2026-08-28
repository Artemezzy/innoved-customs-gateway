import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { LinkedCertRequest, CERT_STATUS_LABELS } from '@/types/lk';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Props {
  shipmentId: number;
  linkedRequests: LinkedCertRequest[];
  isManager: boolean;
}

export function LinkedCertRequestsPanel({ shipmentId, linkedRequests, isManager }: Props) {
  const qc = useQueryClient();
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

  const sync = useMutation({
    mutationFn: (certRequestId: number) => lkApi.syncShipmentFromCertRequest(shipmentId, certRequestId),
    onSuccess: (res) => {
      toast.success(`Синхронизировано позиций: ${res.synced}`);
      qc.invalidateQueries({ queryKey: ['lk', 'shipment', shipmentId] });
      qc.invalidateQueries({ queryKey: ['lk', 'shipment-items', shipmentId] });
      setSyncModalOpen(false);
      setSelectedRequestId(null);
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось синхронизировать'),
  });

  if (linkedRequests.length === 0 && !isManager) return null;

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Связанные заявки на сертификацию</h3>
        {isManager && linkedRequests.length > 0 && (
          <Button size="sm" variant="outline" onClick={() => setSyncModalOpen(true)}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Синхронизировать
          </Button>
        )}
      </div>

      {linkedRequests.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          По этой поставке пока не сформировано ни одной заявки на сертификацию.
        </p>
      ) : (
        <div className="space-y-2">
          {linkedRequests.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
              <div>
                <span className="font-medium">{r.number}</span>
                <span className="text-muted-foreground"> · {r.cert_center_name}</span>
                <span className="text-muted-foreground"> · {CERT_STATUS_LABELS[r.status]}</span>
                <span className="text-muted-foreground"> · обновлено {new Date(r.updated_at).toLocaleString('ru-RU')}</span>
              </div>
              {isManager && (
                <Link to={`/lk/cert-requests/${r.id}`} className="text-primary hover:underline flex items-center gap-1">
                  Открыть <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {syncModalOpen && (
        <Dialog open onOpenChange={(o) => !o && setSyncModalOpen(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Выберите заявку для синхронизации</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              {linkedRequests.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRequestId(r.id)}
                  className={`w-full text-left rounded-md border p-3 text-sm transition-colors ${
                    selectedRequestId === r.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                  }`}
                >
                  <div className="font-medium">{r.number} · {r.cert_center_name}</div>
                  <div className="text-muted-foreground text-xs">
                    Статус: {CERT_STATUS_LABELS[r.status]} · обновлено {new Date(r.updated_at).toLocaleString('ru-RU')}
                  </div>
                </button>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSyncModalOpen(false)}>
                Отмена
              </Button>
              <Button
                onClick={() => selectedRequestId && sync.mutate(selectedRequestId)}
                disabled={!selectedRequestId || sync.isPending}
              >
                {sync.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
                {sync.isPending ? 'Синхронизация…' : 'Синхронизировать'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
