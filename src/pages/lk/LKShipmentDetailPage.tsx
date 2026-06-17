import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { useAuth } from '@/contexts/AuthContext';
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
import { ShipmentStatus, STATUS_LABELS } from '@/types/lk';

export default function LKShipmentDetailPage() {
  const { id } = useParams();
  const shipmentId = Number(id);
  const { user } = useAuth();
  const isManager = user?.role === 'manager';
  const qc = useQueryClient();

  const shipment = useQuery({
    queryKey: ['lk', 'shipment', shipmentId],
    queryFn: () => lkApi.shipment(shipmentId),
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

  return (
    <div className="space-y-4">
      <Link to="/lk/shipments" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> К списку поставок
      </Link>

      {shipment.isLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : shipment.data ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-5">
              <Tabs defaultValue="docs">
                <TabsList>
                  <TabsTrigger value="docs">Документы</TabsTrigger>
                  <TabsTrigger value="chat">Чат</TabsTrigger>
                </TabsList>
                <TabsContent value="docs" className="mt-4">
                  <DocumentsPanel shipmentId={shipmentId} />
                </TabsContent>
                <TabsContent value="chat" className="mt-4">
                  <ChatPanel shipmentId={shipmentId} />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
          <div>
            <Card className="p-5 sticky top-4">
              <div className="text-xs text-muted-foreground">Поставка #{shipment.data.id}</div>
              <h1 className="text-xl font-bold mt-1">{shipment.data.title}</h1>
              <Separator className="my-3" />
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground mb-1">Статус</div>
                  {isManager ? (
                    <Select
                      value={shipment.data.status}
                      onValueChange={(v) => updateStatus.mutate(v as ShipmentStatus)}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(Object.keys(STATUS_LABELS) as ShipmentStatus[]).map((s) => (
                          <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <StatusBadge status={shipment.data.status} />
                  )}
                </div>
                <div>
                  <div className="text-muted-foreground">Клиент</div>
                  <div>{shipment.data.client_name}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Создана</div>
                  <div>{new Date(shipment.data.created_at).toLocaleString('ru-RU')}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Обновлена</div>
                  <div>{new Date(shipment.data.updated_at).toLocaleString('ru-RU')}</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
