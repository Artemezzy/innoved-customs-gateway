import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { CreateCertCenterModal } from '@/components/lk/CreateCertCenterModal';
import type { CertCenter } from '@/types/lk';

export default function LKCertCentersPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'active' | 'archived'>('active');
  const [toDelete, setToDelete] = useState<CertCenter | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['lk', 'cert-centers', q, tab],
    queryFn: () => lkApi.certCenters(q || undefined, tab),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => lkApi.deleteCertCenter(id),
    onSuccess: () => {
      toast.success('Сертификационный центр перемещён в архив');
      qc.invalidateQueries({ queryKey: ['lk', 'cert-centers'] });
      setToDelete(null);
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось удалить центр'),
  });

  const restoreMutation = useMutation({
    mutationFn: (id: number) => lkApi.restoreCertCenter(id),
    onSuccess: () => {
      toast.success('Сертификационный центр восстановлен');
      qc.invalidateQueries({ queryKey: ['lk', 'cert-centers'] });
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось восстановить центр'),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-bold">Сертификационные центры</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Добавить центр
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as 'active' | 'archived')}>
          <TabsList>
            <TabsTrigger value="active">Активные</TabsTrigger>
            <TabsTrigger value="archived">Архив</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск по названию"
            className="pl-9"
          />
        </div>
      </div>

      <Card className="p-0">
        {isLoading ? (
          <div className="p-5">
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Контактное лицо</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Заявки</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((cc) => (
                <TableRow
                  key={cc.id}
                  className={tab === 'active' ? 'cursor-pointer' : ''}
                  onClick={() => tab === 'active' && navigate(`/lk/cert-centers/${cc.id}`)}
                >
                  <TableCell className={tab === 'active' ? 'font-medium' : 'font-medium text-muted-foreground'}>
                    {cc.name}
                  </TableCell>
                  <TableCell>{cc.contact_person}</TableCell>
                  <TableCell>{cc.phone}</TableCell>
                  <TableCell>{cc.email}</TableCell>
                  <TableCell className="text-right">{cc.requests_count}</TableCell>
                  <TableCell className="text-right">
                    {tab === 'active' ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setToDelete(cc);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          restoreMutation.mutate(cc.id);
                        }}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    {tab === 'active' ? 'Сертификационные центры не найдены' : 'Архив пуст'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <CreateCertCenterModal open={open} onOpenChange={setOpen} />

      <AlertDialog open={!!toDelete} onOpenChange={(v) => !v && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить сертификационный центр?</AlertDialogTitle>
            <AlertDialogDescription>
              «{toDelete?.name}» будет перемещён в архив. Доступ к личному кабинету
              будет заблокирован, но все данные (заявки, файлы, переписка) сохранятся.
              Восстановить центр можно из вкладки «Архив».
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => toDelete && deleteMutation.mutate(toDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}