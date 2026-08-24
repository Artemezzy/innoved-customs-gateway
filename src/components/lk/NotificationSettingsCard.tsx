import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BellRing, MailPlus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function NotificationSettingsCard() {
  const qc = useQueryClient();
  const settings = useQuery({
    queryKey: ['lk', 'notification-settings'],
    queryFn: () => lkApi.getNotificationSettings(),
  });

  const [newEmail, setNewEmail] = useState('');

  const update = useMutation({
    mutationFn: (payload: { enabled: boolean; emails: string[] }) =>
      lkApi.updateNotificationSettings(payload),
    onSuccess: () => {
      toast.success('Настройки уведомлений сохранены');
      qc.invalidateQueries({ queryKey: ['lk', 'notification-settings'] });
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось сохранить настройки уведомлений'),
  });

  const emails = settings.data?.emails ?? [];
  const enabled = settings.data?.enabled ?? false;

  const normalizedNewEmail = useMemo(() => normalizeEmail(newEmail), [newEmail]);
  const canAddEmail =
    normalizedNewEmail.length > 0 &&
    isValidEmail(normalizedNewEmail) &&
    !emails.includes(normalizedNewEmail);

  const save = (next: { enabled?: boolean; emails?: string[] }) => {
    update.mutate({
      enabled: next.enabled ?? enabled,
      emails: next.emails ?? emails,
    });
  };

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          <BellRing className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <h2 className="font-semibold">Email-уведомления</h2>
          <p className="text-sm text-muted-foreground">
            Укажите список адресов, на которые отправлять уведомления по изменениям в заявках.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
        <div>
          <Label htmlFor="notifications-enabled">Отправка уведомлений</Label>
          <p className="text-sm text-muted-foreground">
            Если выключить, письма на все адреса из списка отправляться не будут.
          </p>
        </div>
        <Switch
          id="notifications-enabled"
          checked={enabled}
          disabled={settings.isLoading || update.isPending}
          onCheckedChange={(checked) => save({ enabled: checked })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notification-email">Дополнительный email</Label>
        <div className="flex flex-col gap-2 md:flex-row">
          <Input
            id="notification-email"
            type="email"
            placeholder="name@company.ru"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            disabled={settings.isLoading || update.isPending}
          />
          <Button
            type="button"
            variant="outline"
            disabled={!canAddEmail || update.isPending}
            onClick={() => {
              if (!canAddEmail) {
                if (normalizedNewEmail && !isValidEmail(normalizedNewEmail)) {
                  toast.error('Введите корректный email');
                }
                return;
              }
              save({ emails: [...emails, normalizedNewEmail] });
              setNewEmail('');
            }}
          >
            <MailPlus className="h-4 w-4 mr-1.5" />
            Добавить
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {settings.isLoading ? (
          <p className="text-sm text-muted-foreground">Загрузка настроек…</p>
        ) : emails.length === 0 ? (
          <p className="text-sm text-muted-foreground">Дополнительные адреса пока не добавлены.</p>
        ) : (
          <div className="space-y-2">
            {emails.map((email) => (
              <div
                key={email}
                className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
              >
                <span className="text-sm">{email}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={update.isPending}
                  onClick={() => save({ emails: emails.filter((item) => item !== email) })}
                  aria-label={`Удалить ${email}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
