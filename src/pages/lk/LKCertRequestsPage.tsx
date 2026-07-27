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
import { CertStatusBadge } from '@/components/lk/CertStatusBadge';
import { UnreadDots } from '@/components/lk/UnreadDots';
import { CreateCertRequestModal } from '@/components/lk/CreateCertRequestModal';
import { CertRequestStatus, CERT_STATUS_LABELS } from '@/types/lk';

export default function LKCertRequestsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isManager = user?.role === 'manager';
  const [status, setStatus] = useState<string>('');
  const [centerId, setCenterId] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const params: { status?: string; cert_center_id?: number } = {};
  if (status) params.status = status;
  if (isManager && centerId) params.cert_center_id = Number(centerId);

  const requests = useQuery({
    queryKey: ['lk', 'cert-requests', params],
    queryFn: () => lkApi.certRequests(params),
  });

  const centers = useQuery({
    queryKey: ['lk', 'cert-centers'],
    queryFn: () => lkApi.certCenters(),
    enabled: isManager,
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => lkApi.deleteCertRequest(id),
    onSuccess: () => {
      toast.success('Заявка удалена');
      qc.invalidateQueries({ queryKey: ['lk', 'cert-requests'] });
      setDeleteId(null);
    },
    onError: (e: any) => {
      const msg: string = e?.message || '';
      if (msg.includes('401')) toast.error('Сессия истекла, войдите снова');
      else if (msg.includes('403')) toast.error('Недостаточно прав для удаления');
      else if (msg.includes('404')) toast.error('Заявка не найдена');
      else toast.error(msg || 'Не удалось удалить');
      setDeleteId(null);
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-bold">
          {isManager ? 'Заявки на сертификацию' : 'Мои заявки'}
        </h1>
        {isManager && (
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Новая заявка
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <Select value={status || 'all'} onValueChange={(v) => setStatus(v === 'all' ? '' : v)}>
          <SelectTrigger className="md:w-64">
            <SelectValue placeholder="Все статусы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            {(Object.keys(CERT_STATUS_LABELS) as CertRequestStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                {CERT_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isManager && (
          <Select
            value={centerId || 'all'}
            onValueChange={(v) => setCenterId(v === 'all' ? '' : v)}
          >
            <SelectTrigger className="md:w-64">
              <SelectValue placeholder="Все центры" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все центры</SelectItem>
              {centers.data?.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Card className="p-0">
        {requests.isLoading ? (
          <div className="p-5"><Skeleton className="h-40 w-full" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>№</TableHead>
                <TableHead>Компания</TableHead>
                <TableHead>Дата создания</TableHead>
                <TableHead>Сертцентр</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-16"></TableHead>
                {isManager && <TableHead className="w-12"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.data?.map((r) => (
                <TableRow
                  key={r.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/lk/cert-requests/${r.id}`)}
                >
                  <TableCell><span className="text-primary">{r.number}</span></TableCell>
                  <TableCell className="font-medium">{r.company}</TableCell>
                  <TableCell>{new Date(r.created_at).toLocaleDateString('ru-RU')}</TableCell>
                  <TableCell>{r.cert_center_name}</TableCell>
                  <TableCell><CertStatusBadge status={r.status} /></TableCell>
                  <TableCell>
                    <UnreadDots
                      hasUnreadMessages={r.has_unread_messages}
                      hasUnreadChanges={r.has_unread_changes}
                    />
                  </TableCell>
                  {isManager && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(r.id);
                        }}
                        aria-label="Удалить заявку"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {requests.data?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={isManager ? 7 : 6}
                    className="text-center text-muted-foreground py-8"
                  >
                    Заявок нет
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <CreateCertRequestModal open={open} onOpenChange={setOpen} />

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить заявку?</AlertDialogTitle>
            <AlertDialogDescription>
              Действие необратимо. Все файлы и сообщения заявки будут удалены.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMut.isPending}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (deleteId !== null) deleteMut.mutate(deleteId);
              }}
              disabled={deleteMut.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMut.isPending ? 'Удаление...' : 'Удалить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
