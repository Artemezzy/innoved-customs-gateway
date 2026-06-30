import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { lkApi } from '@/api/lkClient';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/lk/StatusBadge';
import { CreateShipmentModal } from '@/components/lk/CreateShipmentModal';
import { ShipmentStatus, STATUS_LABELS } from '@/types/lk';

export default function LKShipmentsPage() {
  const { user } = useAuth();
  const isManager = user?.role === 'manager';
  const [status, setStatus] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [open, setOpen] = useState(false);

  const params: { status?: string; client_id?: number } = {};
  if (isManager) {
    if (status) params.status = status;
    if (clientId) params.client_id = Number(clientId);
  } else if (user?.clientId) {
    params.client_id = user.clientId;
  }

  const shipments = useQuery({
    queryKey: ['lk', 'shipments', params],
    queryFn: () => lkApi.shipments(params),
  });

  const clients = useQuery({
    queryKey: ['lk', 'clients'],
    queryFn: () => lkApi.clients(),
    enabled: isManager,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-bold">{isManager ? 'Поставки' : 'Мои поставки'}</h1>
        {isManager && (
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Новая поставка
          </Button>
        )}
      </div>

      {isManager && (
        <div className="flex flex-col md:flex-row gap-3">
          <Select value={status || 'all'} onValueChange={(v) => setStatus(v === 'all' ? '' : v)}>
            <SelectTrigger className="md:w-64"><SelectValue placeholder="Все статусы" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              {(Object.keys(STATUS_LABELS) as ShipmentStatus[]).map((s) => (
                <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={clientId || 'all'} onValueChange={(v) => setClientId(v === 'all' ? '' : v)}>
            <SelectTrigger className="md:w-64"><SelectValue placeholder="Все клиенты" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все клиенты</SelectItem>
              {clients.data?.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Card className="p-0">
        {shipments.isLoading ? (
          <div className="p-5"><Skeleton className="h-40 w-full" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>№</TableHead>
                <TableHead>Название</TableHead>
                {isManager && <TableHead>Клиент</TableHead>}
                <TableHead>Статус</TableHead>
                <TableHead>Обновлена</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.data?.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <Link to={`/lk/shipments/${s.id}`} className="text-primary hover:underline">
                      #{s.id}
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium">{s.title}</TableCell>
                  {isManager && <TableCell>{s.client_name}</TableCell>}
                  <TableCell><StatusBadge status={s.status} /></TableCell>
                  <TableCell>{new Date(s.updated_at).toLocaleDateString('ru-RU')}</TableCell>
                </TableRow>
              ))}
              {shipments.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isManager ? 5 : 4} className="text-center text-muted-foreground py-8">
                    Поставок нет
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <CreateShipmentModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
