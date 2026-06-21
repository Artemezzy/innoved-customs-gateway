import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, Plus, KeyRound } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function LKClientDetailPage() {
  const { id } = useParams();
  const clientId = Number(id);
  const [open, setOpen] = useState(false);

  // состояние для модалки с доступами
  const [credsOpen, setCredsOpen] = useState(false);
  const [creds, setCreds] = useState<{ login: string; password: string } | null>(
    null
  );

  const client = useQuery({
    queryKey: ['lk', 'client', clientId],
    queryFn: () => lkApi.client(clientId),
    enabled: Number.isFinite(clientId),
  });

  const shipments = useQuery({
    queryKey: ['lk', 'shipments', { client_id: clientId }],
    queryFn: () => lkApi.shipments({ client_id: clientId }),
    enabled: Number.isFinite(clientId),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: () => lkApi.resetClientPassword(clientId),
    onSuccess: (res) => {
      if (!res) {
        toast.error('Сервер не вернул данные о новом пароле');
        return;
      }
      setCreds({ login: res.login, password: res.new_password });
      setCredsOpen(true);
      toast.success('Пароль клиента сброшен');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Не удалось сбросить пароль');
    },
  });

  return (
    <div className="space-y-4">
      <Link
        to="/lk/clients"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> К списку клиентов
      </Link>

      <Card className="p-5">
        {client.isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : client.data ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{client.data.name}</h1>
                <Separator className="my-3" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">ИНН: </span>
                    {client.data.inn}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Контактное лицо: </span>
                    {client.data.contact_person}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Телефон: </span>
                    {client.data.phone}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email: </span>
                    {client.data.email}
                  </div>
                </div>
              </div>

              {/* Кнопка сброса пароля */}
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => resetPasswordMutation.mutate()}
                disabled={resetPasswordMutation.isPending}
              >
                <KeyRound className="h-4 w-4 mr-1.5" />
                {resetPasswordMutation.isPending ? 'Сбрасываем…' : 'Сбросить пароль'}
              </Button>
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
                    <Link
                      to={`/lk/shipments/${s.id}`}
                      className="text-primary hover:underline"
                    >
                      #{s.id}
                    </Link>
                  </TableCell>
                  <TableCell>{s.title}</TableCell>
                  <TableCell>
                    <StatusBadge status={s.status} />
                  </TableCell>
                  <TableCell>
                    {new Date(s.updated_at).toLocaleDateString('ru-RU')}
                  </TableCell>
                </TableRow>
              ))}
              {shipments.data?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-8"
                  >
                    Поставок нет
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <CreateShipmentModal
        open={open}
        onOpenChange={setOpen}
        fixedClientId={clientId}
      />

      {/* Модалка с логином / паролем */}
      {creds && (
        <Dialog open={credsOpen} onOpenChange={setCredsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Доступы клиента</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Логин (email)
                </div>
                <Input readOnly value={creds.login} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Новый пароль
                </div>
                <Input readOnly value={creds.password} />
              </div>
              <p className="text-xs text-muted-foreground">
                Сохраните эти данные и отправьте клиенту. Повторно пароль показан
                не будет.
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={() => {
                  const text = `ЛК ИННОВЭД\nЛогин: ${creds.login}\nПароль: ${creds.password}`;
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(text).catch(() => {});
                  }
                }}
              >
                Скопировать
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}