import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { useAuth } from '@/contexts/AuthContext';
import { useLKLanguage } from '@/contexts/LKLanguageContext';
import { lkT } from '@/lib/lkTranslations';
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

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  fixedClientId?: number;
}

export function CreateShipmentModal({ open, onOpenChange, fixedClientId }: Props) {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { language } = useLKLanguage();
  const isManager = user?.role === 'manager';
  const needsClientSelect = isManager && !fixedClientId;

  const schema = needsClientSelect
    ? z.object({
        client_id: z.coerce.number().min(1, 'Выберите клиента'),
        title: z.string().min(3, 'Минимум 3 символа'),
      })
    : z.object({
        client_id: z.coerce.number().optional(),
        title: z.string().min(3, 'Минимум 3 символа'),
      });
  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { client_id: fixedClientId || 0, title: '' } as FormData,
  });

  const { data: clients } = useQuery({
    queryKey: ['lk', 'clients'],
    queryFn: () => lkApi.clients(),
    enabled: open && needsClientSelect,
  });

  const create = useMutation({
    mutationFn: (d: FormData) => {
      if (isManager) {
        const cid = fixedClientId ?? d.client_id;
        return lkApi.createShipment({ client_id: Number(cid), title: d.title });
      }
      return lkApi.createShipment({ title: d.title });
    },
    onSuccess: (res) => {
      toast.success(`Поставка создана${res?.id ? ` (#${res.id})` : ''}`);
      qc.invalidateQueries({ queryKey: ['lk', 'shipments'] });
      onOpenChange(false);
      form.reset({ client_id: fixedClientId || 0, title: '' } as FormData);
    },
    onError: (e: any) => toast.error(e.message || 'Ошибка'),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{lkT('label_create_shipment_title', language)}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((d) => create.mutate(d))} className="space-y-3 py-2">
          {needsClientSelect && (
            <div className="space-y-1">
              <Label>{lkT('label_client', language)}</Label>
              <Select
                onValueChange={(v) => form.setValue('client_id', Number(v) as any, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={lkT('placeholder_select_client', language)} />
                </SelectTrigger>
                <SelectContent>
                  {clients?.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(form.formState.errors as any).client_id && (
                <p className="text-xs text-destructive">{(form.formState.errors as any).client_id.message}</p>
              )}
            </div>
          )}

          <div className="space-y-1">
            <Label>{lkT('field_shipment_title', language)}</Label>
            <Input {...form.register('title')} />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message as string}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {lkT('btn_cancel', language)}
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? 'Создание…' : lkT('btn_create', language)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}