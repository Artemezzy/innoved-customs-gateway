import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, KeyRound, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
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

export default function LKCertCenterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const centerId = Number(id);
  const navigate = useNavigate();
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
      toast.success('Пароль сброшен');
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось сбросить пароль'),
  });

  const copy = (val: string, k: 'login' | 'password') => {
    navigator.clipboard.writeText(val);
    setCopied(k);
    setTimeout(() => setCopied(null), 1500);
  };

  if (centers.isLoading) return <Skeleton className="h-40 w-full" />;
  if (!center) {
    return (
      <div className="space-y-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/lk/cert-centers')}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> К списку
        </Button>
        <p>Центр не найден.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate('/lk/cert-centers')}>
        <ArrowLeft className="h-4 w-4 mr-1.5" /> К списку
      </Button>

      <Card className="p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold">{center.name}</h1>
            <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
              <div>Контактное лицо: {center.contact_person}</div>
              <div>Телефон: {center.phone}</div>
              <div>Email: {center.email}</div>
              <div>Заявок: {center.requests_count}</div>
            </div>
          </div>
          <Button variant="outline" onClick={() => reset.mutate()} disabled={reset.isPending}>
            <KeyRound className="h-4 w-4 mr-1.5" />
            {reset.isPending ? 'Сброс…' : 'Сбросить пароль'}
          </Button>
        </div>
      </Card>

      <Card className="p-0">
        <div className="p-5 pb-2 font-semibold">Заявки центра</div>
        {requests.isLoading ? (
          <div className="p-5"><Skeleton className="h-20 w-full" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>№</TableHead>
                <TableHead>Компания</TableHead>
                <TableHead>Создана</TableHead>
                <TableHead>Статус</TableHead>
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
                  <TableCell><CertStatusBadge status={r.status} /></TableCell>
                </TableRow>
              ))}
              {requests.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Заявок нет
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={!!creds} onOpenChange={(v) => !v && setCreds(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новый пароль</DialogTitle>
          </DialogHeader>
          {creds && (
            <div className="space-y-3 py-2">
              <p className="text-sm text-muted-foreground">
                Передайте эти данные центру. После закрытия окна пароль не будет показан повторно.
              </p>
              {(['login', 'password'] as const).map((k) => (
                <div key={k}>
                  <Label>{k === 'login' ? 'Логин' : 'Пароль'}</Label>
                  <div className="flex gap-2">
                    <Input readOnly value={creds[k]} />
                    <Button variant="outline" size="icon" onClick={() => copy(creds[k], k)}>
                      {copied === k ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setCreds(null)}>Готово</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
