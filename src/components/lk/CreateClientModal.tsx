import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Copy, Check } from 'lucide-react';
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

const schema = z.object({
  name: z.string().min(2, 'Укажите название'),
  inn: z.string().min(10, 'ИНН не короче 10 цифр').max(12),
  contact_person: z.string().min(2, 'Укажите контактное лицо'),
  phone: z.string().min(5, 'Укажите телефон'),
  email: z.string().email('Некорректный email'),
});
type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function CreateClientModal({ open, onOpenChange }: Props) {
  const qc = useQueryClient();
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState<'email' | 'password' | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', inn: '', contact_person: '', phone: '', email: '' },
  });

  const create = useMutation({
    mutationFn: (data: FormData) => lkApi.createClient(data),
    onSuccess: (res) => {
      toast.success('Клиент создан');
      setCredentials(res.credentials);
      qc.invalidateQueries({ queryKey: ['lk', 'clients'] });
    },
    onError: (e: any) => toast.error(e.message || 'Ошибка'),
  });

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setCredentials(null);
      form.reset();
    }, 200);
  };

  const copy = (val: string, k: 'email' | 'password') => {
    navigator.clipboard.writeText(val);
    setCopied(k);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(v) : handleClose())}>
      <DialogContent>
        {!credentials ? (
          <>
            <DialogHeader>
              <DialogTitle>Создать клиента</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit((d) => create.mutate(d))}
              className="space-y-3 py-2"
            >
              {(
                [
                  ['name', 'Название организации'],
                  ['inn', 'ИНН'],
                  ['contact_person', 'Контактное лицо'],
                  ['phone', 'Телефон'],
                  ['email', 'Email'],
                ] as const
              ).map(([k, label]) => (
                <div key={k}>
                  <Label htmlFor={k}>{label}</Label>
                  <Input id={k} {...form.register(k)} />
                  {form.formState.errors[k] && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors[k]?.message as string}
                    </p>
                  )}
                </div>
              ))}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Отмена
                </Button>
                <Button type="submit" disabled={create.isPending}>
                  {create.isPending ? 'Создание…' : 'Создать'}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Учётные данные клиента</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <p className="text-sm text-muted-foreground">
                Сохраните эти данные и передайте клиенту. После закрытия окна пароль не будет
                показан повторно.
              </p>
              {(['email', 'password'] as const).map((k) => (
                <div key={k}>
                  <Label>{k === 'email' ? 'Логин (email)' : 'Пароль'}</Label>
                  <div className="flex gap-2">
                    <Input readOnly value={credentials[k]} />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => copy(credentials[k], k)}
                    >
                      {copied === k ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Готово</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
