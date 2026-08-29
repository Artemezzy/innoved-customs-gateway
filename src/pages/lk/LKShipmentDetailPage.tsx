import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { useAuth } from '@/contexts/AuthContext';
import { useLKLanguage } from '@/contexts/LKLanguageContext';
import { lkT } from '@/lib/lkTranslations';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/lk/StatusBadge';
import { DocumentsPanel } from '@/components/lk/DocumentsPanel';
import { ChatPanel } from '@/components/lk/ChatPanel';
import { ShipmentItemsPanel } from '@/components/lk/ShipmentItemsPanel';
import { LinkedCertRequestsPanel } from '@/components/lk/LinkedCertRequestsPanel';
import { ShipmentStatus, STATUS_LABELS } from '@/types/lk';

export default function LKShipmentDetailPage() {
  const { id } = useParams();
  const shipmentId = Number(id);
  const { user } = useAuth();
  const { language } = useLKLanguage();
  const isManager = user?.role === 'manager';
  const qc = useQueryClient();

  const shipment = useQuery({
    queryKey: ['lk', 'shipment', shipmentId],
    queryFn: () => lkApi.shipment(shipmentId),
  });

  const items = useQuery({
    queryKey: ['lk', 'shipment-items', shipmentId],
    queryFn: () => lkApi.shipmentItems(shipmentId),
    enabled: !!shipment.data,
  });

  const updateStatus = useMutation({
    mutationFn: (status: ShipmentStatus) => lkApi.updateShipment(shipmentId, { status }),
    onSuccess: () => {
      toast.success('Статус обновлён');
      qc.invalidateQueries({ queryKey: ['lk', 'shipment', shipmentId] });
      qc.invalidateQueries({ queryKey: ['lk', 'shipments'] });
    },
    onError: (e: any) => toast.error(e.message || 'Ошибка'),
  });

  const statusLabel = (s: ShipmentStatus) => lkT(`status_${s}` as any, language);

  if (shipment.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!shipment.data) {
    return <p className="text-muted-foreground">Поставка не найдена.</p>;
  }

  const s = shipment.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/lk/shipments" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold">
            {s.number} — {s.title}
          </h1>
          <p className="text-sm text-muted-foreground">{s.client_name}</p>
        </div>
        <div className="ml-auto">
          {isManager ? (
            <Select value={s.status} onValueChange={(v) => updateStatus.mutate(v as ShipmentStatus)}>
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(STATUS_LABELS) as ShipmentStatus[]).map((st) => (
                  <SelectItem key={st} value={st}>
                    {statusLabel(st)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <StatusBadge status={s.status} />
          )}
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="items">
            <TabsList>
              <TabsTrigger value="items">{lkT('tab_products', language)}</TabsTrigger>
              <TabsTrigger value="cert-requests">{lkT('tab_cert_requests', language)}</TabsTrigger>
              <TabsTrigger value="documents">{lkT('tab_documents', language)}</TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="mt-4">
              {items.isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ShipmentItemsPanel
                  shipmentId={shipmentId}
                  shipment={s}
                  items={items.data ?? []}
                  isManager={isManager}
                />
              )}
            </TabsContent>

            <TabsContent value="cert-requests" className="mt-4">
              <LinkedCertRequestsPanel
                shipmentId={shipmentId}
                linkedRequests={s.linked_cert_requests ?? []}
                isManager={isManager}
              />
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <Card className="p-4">
                <DocumentsPanel shipmentId={shipmentId} />
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Card className="p-0 overflow-hidden h-fit">
          <ChatPanel shipmentId={shipmentId} />
        </Card>
      </div>
    </div>
  );
}