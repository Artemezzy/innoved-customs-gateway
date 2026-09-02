import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { useAuth } from '@/contexts/AuthContext';
import { useLKLanguage } from '@/contexts/LKLanguageContext';
import { lkT, LKDictKey } from '@/lib/lkTranslations';
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
import { CertRequestStatus, CERT_STATUS_ORDER } from '@/types/lk';

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

export default function LKCertRequestsPage() {
  const { user } = useAuth();
  const { language } = useLKLanguage();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isManager = user?.role === 'manager';
  const [status, setStatus] = useState('');
  const [centerId, setCenterId] = useState('');
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

  const statusLabel = (s: CertRequestStatus) => lkT(CERT_STATUS_KEY_MAP[s], language);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-semibold">
          {isManager ? lkT('page_cert_requests_title', language) : lkT('page_my_requests_title', language)}
        </h1>
        {isManager && (
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            {lkT('btn_new_request', language)}
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={status} onValueChange={(v) => setStatus(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder={lkT('label_all_statuses', language)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lkT('label_all_statuses', language)}</SelectItem>
            {CERT_STATUS_ORDER.map((s) => (
              <SelectItem key={s} value={s}>
                {statusLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isManager && (
          <Select value={centerId} onValueChange={(v) => setCenterId(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-[220px]">
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

      {requests.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{lkT('th_number', language)}</TableHead>
                <TableHead>{lkT('th_company', language)}</TableHead>
                <TableHead>{lkT('th_created_date', language)}</TableHead>
                <TableHead>{lkT('th_cert_center', language)}</TableHead>
                <TableHead>{lkT('th_linked_shipment', language)}</TableHead>
                <TableHead>{lkT('label_status', language)}</TableHead>
                <TableHead />
                {isManager && <TableHead />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.data?.map((r) => (
                <TableRow key={r.id} className="cursor-pointer" onClick={() => navigate(`/lk/cert-requests/${r.id}`)}>
                  <TableCell>
                    <span className="text-primary hover:underline flex items-center gap-1">
                      {r.number}
                      {r.has_unread && <UnreadDots />}
                    </span>
                  </TableCell>
                  <TableCell>{r.company}</TableCell>
                  <TableCell>{new Date(r.created_at).toLocaleDateString('ru-RU')}</TableCell>
                  <TableCell>{r.cert_center_name}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {r.linked_shipment ? (
                      <button
                        className="text-primary hover:underline"
                        onClick={() => navigate(`/lk/shipments/${r.linked_shipment!.id}`)}
                      >
                        {r.linked_shipment.number}
                      </button>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <CertStatusBadge status={r.status} />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await lkApi.exportCertRequest(r.id);
                        } catch (err: any) {
                          toast.error(err?.message || 'Не удалось скачать');
                        }
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  {isManager && (
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(r.id);
                        }}
                        aria-label="Удалить заявку"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {requests.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isManager ? 8 : 7} className="text-center text-muted-foreground py-8">
                    {lkT('empty_no_requests', language)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      <CreateCertRequestModal open={open} onOpenChange={setOpen} />

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{lkT('dialog_delete_request_title', language)}</AlertDialogTitle>
            <AlertDialogDescription>{lkT('dialog_delete_request_desc', language)}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{lkT('btn_cancel', language)}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (deleteId !== null) deleteMut.mutate(deleteId);
              }}
              disabled={deleteMut.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMut.isPending ? 'Удаление...' : lkT('btn_delete', language)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}