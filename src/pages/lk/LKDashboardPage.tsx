import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Users, Package, MessageSquare } from 'lucide-react';
import { lkApi } from '@/api/lkClient';
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

export default function LKDashboardPage() {
  const navigate = useNavigate();
  const stats = useQuery({ queryKey: ['lk', 'stats'], queryFn: () => lkApi.managerStats() });
  const clients = useQuery({ queryKey: ['lk', 'clients'], queryFn: () => lkApi.clients() });

  const cards = [
    { label: 'Всего клиентов', value: stats.data?.clients_total, icon: Users },
    { label: 'Активных поставок', value: stats.data?.shipments_active, icon: Package },
    { label: 'Непрочитанных сообщений', value: stats.data?.messages_unread, icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Дашборд</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{c.label}</div>
                <div className="text-3xl font-bold mt-1">
                  {stats.isLoading ? <Skeleton className="h-8 w-12" /> : c.value ?? 0}
                </div>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <c.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h2 className="font-semibold mb-3">Клиенты</h2>
        {clients.isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>ИНН</TableHead>
                <TableHead>Контакт</TableHead>
                <TableHead className="text-right">Поставок</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.data?.map((c) => (
                <TableRow
                  key={c.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/lk/clients/${c.id}`)}
                >
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.inn}</TableCell>
                  <TableCell>{c.contact_person}</TableCell>
                  <TableCell className="text-right">{c.shipment_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
