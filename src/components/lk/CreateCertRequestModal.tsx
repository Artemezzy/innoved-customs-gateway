import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const schema = z.object({
  company: z.string().min(2, 'Укажите компанию'),
  cert_center_id: z.coerce.number().min(1, 'Выберите центр'),
});
type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function CreateCertRequestModal({ open, onOpenChange }: Props) {
  const qc = useQueryClient();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { company: '', cert_center_id: 0 },
  });

  const { data: centers } = useQuery({
    queryKey: ['lk', 'cert-centers'],
    queryFn: () => lkApi.certCenters(),
    enabled: open,
  });

  const create = useMutation({
    mutationFn: (d: FormData) =>
      lkApi.createCertRequest({ company: d.company, cert_center_id: Number(d.cert_center_id) }),
    onSuccess: (res) => {
      toast.success(`Заявка создана${res?.id ? ` (#${res.id})` : ''}`);
      qc.invalidateQueries({ queryKey: ['lk', 'cert-requests'] });
      onOpenChange(false);
      form.reset({ company: '', cert_center_id: 0 });
    },
    onError: (e: any) => toast.error(e.message || 'Ошибка'),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новая заявка на сертификацию</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((d) => create.mutate(d))} className="space-y-3 py-2">
          <div>
            <Label htmlFor="company">Компания</Label>
            <Input id="company" {...form.register('company')} />
            {form.formState.errors.company && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.company.message}
              </p>
            )}
          </div>
          <div>
            <Label>Сертификационный центр</Label>
            <Select
              value={String(form.watch('cert_center_id') || '')}
              onValueChange={(v) =>
                form.setValue('cert_center_id', Number(v) as any, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите центр" />
              </SelectTrigger>
              <SelectContent>
                {centers?.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.cert_center_id && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.cert_center_id.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? 'Создание…' : 'Создать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
