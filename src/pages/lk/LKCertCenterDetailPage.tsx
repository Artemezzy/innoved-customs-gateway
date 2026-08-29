import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, KeyRound, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { useLKLanguage } from '@/contexts/LKLanguageContext';
import { lkT, LKDictKey } from '@/lib/lkTranslations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CertStatusBadge } from '@/components/lk/CertStatusBadge';
import { CertRequestStatus } from '@/types/lk';

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

export default function LKCertCenterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const centerId = Number(id);
  const navigate = useNavigate();
  const { language } = useLKLanguage();
  const [creds, setCreds] = useState<{ login: string; password: string } | null>(null);
  const [copied, setCopied] = useState<'login' | 'password' | null>(null);

  const centers = useQuery({
    queryKey: ['lk', 'cert-centers'],
    queryFn: () => lkApi.certCenters(),
  });
  const center = centers.data?.find((c) => c.id === centerId);

  const requests = useQuery({
    queryKey: ['lk', 'cert-requests', { cert_center_id: centerId }],
    queryFn: () => lkApi.certRequests({ cert_center_id: centerId }),
    enabled: !!centerId,
  });

  const reset = useMutation({
    mutationFn: () => lkApi.resetCertCenterPassword(centerId),
    onSuccess: (r) => {
      setCreds({ login: r.login, password: r.new_password });
      toast.success(lkT('toast_password_reset', language));
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось сбросить пароль'),
  });

  const copy = (val: string, k: 'login' | 'password') => {
    navigator.clipboard.writeText(val);
    setCopied(k);
    setTimeout(() => setCopied(null), 1500);
  };

  if (centers.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!center) {
    return <p className="text-muted-foreground">Центр не найден.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/lk/cert-centers" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-semibold">{center.name}</h1>
        <div className="ml-auto">
          <Button variant="outline" size="sm" onClick={() => reset.mutate()} disabled={reset.isPending}>
            <KeyRound className="h-4 w-4 mr-1.5" />
            {reset.isPending ? '...' : lkT('btn_reset_password', language)}
          </Button>
        </div>
      </div>

      <Card className="p-5 grid gap-3 sm:grid-cols-2 text-sm">
        <div>
          <span className="text-muted-foreground">{lkT('th_contact_person', language)}: </span>
          {center.contact_person}
        </div>
        <div>
          <span className="text-muted-foreground">{lkT('th_phone', language)}: </span>
          {center.phone}
        </div>
        <div>
          <span className="text-muted-foreground">{lkT('th_email', language)}: </span>
          {center.email}
        </div>
      </Card>

      <Card>
        <div className="p-4 font-semibold">{lkT('page_cert_requests_title', language)}</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{lkT('th_number', language)}</TableHead>
              <TableHead>{lkT('th_company', language)}</TableHead>
              <TableHead>{lkT('th_created_date', language)}</TableHead>
              <TableHead>{lkT('label_status', language)}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.data?.map((r) => (
              <TableRow key={r.id} className="cursor-pointer" onClick={() => navigate(`/lk/cert-requests/${r.id}`)}>
                <TableCell>{r.number}</TableCell>
                <TableCell>{r.company}</TableCell>
                <TableCell>{new Date(r.created_at).toLocaleDateString('ru-RU')}</TableCell>
                <TableCell>
                  <CertStatusBadge status={r.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {creds && (
        <Dialog open onOpenChange={(o) => !o && setCreds(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{lkT('label_access_credentials', language)}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">{lkT('label_login', language)}</div>
                <div className="flex items-center gap-2">
                  <Input readOnly value={creds.login} />
                  <Button size="icon" variant="outline" onClick={() => copy(creds.login, 'login')}>
                    {copied === 'login' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">{lkT('label_password', language)}</div>
                <div className="flex items-center gap-2">
                  <Input readOnly value={creds.password} />
                  <Button size="icon" variant="outline" onClick={() => copy(creds.password, 'password')}>
                    {copied === 'password' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{lkT('label_new_password_copy_hint', language)}</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setCreds(null)}>{lkT('btn_close', language)}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}