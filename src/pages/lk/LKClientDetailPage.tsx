import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, Plus, KeyRound } from 'lucide-react';
import { lkApi } from '@/api/lkClient';
import { useLKLanguage } from '@/contexts/LKLanguageContext';
import { lkT } from '@/lib/lkTranslations';
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
  const { language } = useLKLanguage();
  const [open, setOpen] = useState(false);
  const [credsOpen, setCredsOpen] = useState(false);
  const [creds, setCreds] = useState<{ login: string; password: string } | null>(null);

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
      <Link to="/lk/clients" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" />
        {lkT('nav_clients', language)}
      </Link>

      <Card className="p-5">
        {client.isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : client.data ? (
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
                  <span className="text-muted-foreground">{lkT('th_contact_person', language)}: </span>
                  {client.data.contact_person}
                </div>
                <div>
                  <span className="text-muted-foreground">{lkT('th_phone', language)}: </span>
                  {client.data.phone}
                </div>
                <div>
                  <span className="text-muted-foreground">Email: </span>
                  {client.data.email}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => resetPasswordMutation.mutate()}
              disabled={resetPasswordMutation.isPending}
            >
              <KeyRound className="h-4 w-4 mr-1.5" />
              {resetPasswordMutation.isPending ? '...' : lkT('btn_reset_password', language)}
            </Button>
          </div>
        ) : null}
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">{lkT('page_shipments_title', language)}</h2>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            {lkT('btn_new_shipment', language)}
          </Button>
        </div>
        {shipments.isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{lkT('th_number', language)}</TableHead>
                <TableHead>{lkT('th_title', language)}</TableHead>
                <TableHead>{lkT('th_status', language)}</TableHead>
                <TableHead>{lkT('th_updated', language)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.data?.map((s) => (
                <TableRow key={s.id} className="cursor-pointer">
                  <TableCell>
                    <Link to={`/lk/shipments/${s.id}`} className="text-primary hover:underline">
                      {s.number ?? s.id}
                    </Link>
                  </TableCell>
                  <TableCell>{s.title}</TableCell>
                  <TableCell>
                    <StatusBadge status={s.status} />
                  </TableCell>
                  <TableCell>{new Date(s.updated_at).toLocaleDateString('ru-RU')}</TableCell>
                </TableRow>
              ))}
              {shipments.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    {lkT('empty_no_shipments', language)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <CreateShipmentModal open={open} onOpenChange={setOpen} fixedClientId={clientId} />

      {creds && (
        <Dialog open={credsOpen} onOpenChange={setCredsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{lkT('label_access_credentials', language)}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">email</div>
                <Input readOnly value={creds.login} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">{lkT('label_password', language)}</div>
                <Input readOnly value={creds.password} />
              </div>
              <p className="text-xs text-muted-foreground">{lkT('label_new_password_copy_hint', language)}</p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={() => {
                  const text = `${creds.login} / ${creds.password}`;
                  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
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