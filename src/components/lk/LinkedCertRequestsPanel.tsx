import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { useLKLanguage } from '@/contexts/LKLanguageContext';
import { lkT, LKDictKey } from '@/lib/lkTranslations';
import { LinkedCertRequest, CertRequestStatus } from '@/types/lk';
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

export function LinkedCertRequestsPanel({ shipmentId, linkedRequests, isManager }: Props) {
  const qc = useQueryClient();
  const { language } = useLKLanguage();
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

  const statusLabel = (s: CertRequestStatus) => lkT(CERT_STATUS_KEY_MAP[s], language);

  if (linkedRequests.length === 0 && !isManager) return null;

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{lkT('section_linked_requests', language)}</h3>
        {isManager && linkedRequests.length > 0 && (
          <Button size="sm" variant="outline" onClick={() => setSyncModalOpen(true)}>
            <RefreshCw className="h-4 w-4 mr-1" />
            {lkT('btn_sync', language)}
          </Button>
        )}
      </div>

      {linkedRequests.length === 0 ? (
        <p className="text-sm text-muted-foreground">{lkT('empty_no_linked_requests', language)}</p>
      ) : (
        <div className="space-y-2">
          {linkedRequests.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
              <div>
                <span className="font-medium">{r.number}</span>
                <span className="text-muted-foreground"> · {r.cert_center_name}</span>
                <span className="text-muted-foreground"> · {statusLabel(r.status)}</span>
                <span className="text-muted-foreground"> · {lkT('label_updated', language)} {new Date(r.updated_at).toLocaleString('ru-RU')}</span>
              </div>
              {isManager && (
                <Link to={`/lk/cert-requests/${r.id}`} className="text-primary hover:underline flex items-center gap-1">
                  {lkT('btn_open', language)} <ExternalLink className="h-3.5 w-3.5" />
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
              <DialogTitle>{lkT('dialog_select_request_for_sync', language)}</DialogTitle>
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
                    {lkT('label_status', language)}: {statusLabel(r.status)} · {lkT('label_updated', language)} {new Date(r.updated_at).toLocaleString('ru-RU')}
                  </div>
                </button>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSyncModalOpen(false)}>
                {lkT('btn_cancel', language)}
              </Button>
              <Button
                onClick={() => selectedRequestId && sync.mutate(selectedRequestId)}
                disabled={!selectedRequestId || sync.isPending}
              >
                {sync.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
                {sync.isPending ? 'Синхронизация…' : lkT('btn_sync_confirm', language)}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}