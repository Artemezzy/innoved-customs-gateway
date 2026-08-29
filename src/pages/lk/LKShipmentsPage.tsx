import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { useAuth } from '@/contexts/AuthContext';
import { useLKLanguage } from '@/contexts/LKLanguageContext';
import { lkT } from '@/lib/lkTranslations';
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
  const { language } = useLKLanguage();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isManager = user?.role === 'manager';
  const [status, setStatus] = useState('');
  const [clientId, setClientId] = useState('');
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

  const statusLabel = (s: ShipmentStatus) => lkT(`status_${s}` as any, language);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-semibold">
          {isManager ? lkT('page_shipments_title', language) : lkT('page_my_shipments_title', language)}
        </h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          {lkT('btn_new_shipment', language)}
        </Button>
      </div>

      {isManager && (
        <div className="flex flex-wrap gap-2">
          <Select value={status} onValueChange={(v) => setStatus(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={lkT('label_all_statuses', language)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{lkT('label_all_statuses', language)}</SelectItem>
              {(Object.keys(STATUS_LABELS) as ShipmentStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {statusLabel(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={clientId} onValueChange={(v) => setClientId(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={lkT('label_all_clients', language)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{lkT('label_all_clients', language)}</SelectItem>
              {clients.data?.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {shipments.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{lkT('th_number', language)}</TableHead>
                <TableHead>{lkT('th_title', language)}</TableHead>
                {isManager && <TableHead>{lkT('th_client', language)}</TableHead>}
                <TableHead>{lkT('th_status', language)}</TableHead>
                <TableHead>{lkT('th_updated', language)}</TableHead>
                {isManager && <TableHead />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.data?.map((s) => (
                <TableRow
                  key={s.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/lk/shipments/${s.id}`)}
                >
                  <TableCell>
                    <span className="text-primary hover:underline">{s.number ?? `#${s.id}`}</span>
                  </TableCell>
                  <TableCell>{s.title}</TableCell>
                  {isManager && <TableCell>{s.client_name}</TableCell>}
                  <TableCell>
                    <StatusBadge status={s.status} />
                  </TableCell>
                  <TableCell>{new Date(s.updated_at).toLocaleDateString('ru-RU')}</TableCell>
                  {isManager && (
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(s.id);
                        }}
                        aria-label="Удалить поставку"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {shipments.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isManager ? 6 : 4} className="text-center text-muted-foreground py-8">
                    {lkT('empty_no_shipments', language)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      <CreateShipmentModal open={open} onOpenChange={setOpen} />

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{lkT('dialog_delete_shipment_title', language)}</AlertDialogTitle>
            <AlertDialogDescription>{lkT('dialog_delete_shipment_desc', language)}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{lkT('btn_cancel', language)}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (deleteId !== null) deleteMutation.mutate(deleteId);
              }}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Удаление...' : lkT('btn_delete', language)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}