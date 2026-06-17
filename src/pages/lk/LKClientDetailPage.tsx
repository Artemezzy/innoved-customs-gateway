import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Plus } from 'lucide-react';
import { lkApi } from '@/api/lkClient';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/lk/StatusBadge';
import { CreateShipmentModal } from '@/components/lk/CreateShipmentModal';

export default function LKClientDetailPage() {
  const { id } = useParams();
  const clientId = Number(id);
  const [open, setOpen] = useState(false);

  const client = useQuery({
    queryKey: ['lk', 'client', clientId],
    queryFn: () => lkApi.client(clientId),
  });
  const shipments = useQuery({
    queryKey: ['lk', 'shipments', { client_id: clientId }],
    queryFn: () => lkApi.shipments({ client_id: clientId }),
  });

  return (
    <div className="space-y-4">
      <Link to="/lk/clients" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> К списку клиентов
      </Link>

      <Card className="p-5">
        {client.isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : client.data ? (
          <>
            <h1 className="text-2xl font-bold">{client.data.name}</h1>
            <Separator className="my-3" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">ИНН: </span>{client.data.inn}</div>
              <div><span className="text-muted-foreground">Контактное лицо: </span>{client.data.contact_person}</div>
              <div><span className="text-muted-foreground">Телефон: </span>{client.data.phone}</div>
              <div><span className="text-muted-foreground">Email: </span>{client.data.email}</div>
            </div>
          </>
        ) : null}
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Поставки</h2>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Новая поставка
          </Button>
        </div>
        {shipments.isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>№</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Обновлена</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.data?.map((s) => (
                <TableRow key={s.id} className="cursor-pointer">
                  <TableCell>
                    <Link to={`/lk/shipments/${s.id}`} className="text-primary hover:underline">
                      #{s.id}
                    </Link>
                  </TableCell>
                  <TableCell>{s.title}</TableCell>
                  <TableCell><StatusBadge status={s.status} /></TableCell>
                  <TableCell>{new Date(s.updated_at).toLocaleDateString('ru-RU')}</TableCell>
                </TableRow>
              ))}
              {shipments.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Поставок нет
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <CreateShipmentModal open={open} onOpenChange={setOpen} fixedClientId={clientId} />
    </div>
  );
}
