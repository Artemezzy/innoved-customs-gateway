import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { StatusBadge } from '@/components/lk/StatusBadge';
import { CreateShipmentModal } from '@/components/lk/CreateShipmentModal';
import { ShipmentStatus, STATUS_LABELS } from '@/types/lk';

export default function LKShipmentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isManager = user?.role === 'manager';
  const [status, setStatus] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

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

  const deleteMutation = useMutation({
    mutationFn: (id: number) => lkApi.deleteShipment(id),
    onSuccess: () => {
      toast.success('Поставка удалена');
      qc.invalidateQueries({ queryKey: ['lk', 'shipments'] });
      setDeleteId(null);
    },
    onError: (e: any) => {
      const msg: string = e?.message || '';
      if (msg.includes('401')) toast.error('Сессия истекла, войдите снова');
      else if (msg.includes('403')) toast.error('Недостаточно прав для удаления');
      else if (msg.includes('404')) toast.error('Поставка не найдена');
      else toast.error(msg || 'Не удалось удалить поставку');
      setDeleteId(null);
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-bold">{isManager ? 'Поставки' : 'Мои поставки'}</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> Новая поставка
        </Button>

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
                {isManager && <TableHead className="w-12"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.data?.map((s) => (
                <TableRow
                  key={s.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/lk/shipments/${s.id}`)}
                >
                  <TableCell>
                    <span className="text-primary">#{s.id}</span>
                  </TableCell>
                  <TableCell className="font-medium">{s.title}</TableCell>
                  {isManager && <TableCell>{s.client_name}</TableCell>}
                  <TableCell><StatusBadge status={s.status} /></TableCell>
                  <TableCell>{new Date(s.updated_at).toLocaleDateString('ru-RU')}</TableCell>
                  {isManager && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(s.id);
                        }}
                        aria-label="Удалить поставку"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {shipments.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isManager ? 6 : 4} className="text-center text-muted-foreground py-8">
                    Поставок нет
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <CreateShipmentModal open={open} onOpenChange={setOpen} />

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить поставку?</AlertDialogTitle>
            <AlertDialogDescription>
              Действие необратимо. Все документы и сообщения поставки будут удалены.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (deleteId !== null) deleteMutation.mutate(deleteId);
              }}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Удаление...' : 'Удалить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
