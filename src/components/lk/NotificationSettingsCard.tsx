import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BellRing, MailPlus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { useLKLanguage } from '@/contexts/LKLanguageContext';
import { lkT } from '@/lib/lkTranslations';
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
  const { language } = useLKLanguage();
  const settings = useQuery({
    queryKey: ['lk', 'notification-settings'],
    queryFn: () => lkApi.getNotificationSettings(),
  });

  const [newEmail, setNewEmail] = useState('');

  const update = useMutation({
    mutationFn: (payload: { enabled: boolean; emails: string[] }) =>
      lkApi.updateNotificationSettings(payload),
    onSuccess: () => {
      toast.success(lkT('toast_settings_saved', language));
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
    <Card className="p-5 space-y-5">
      <div className="flex items-center gap-2">
        <BellRing className="h-5 w-5" />
        <h2 className="font-semibold">{lkT('section_notifications_title', language)}</h2>
      </div>
      <p className="text-sm text-muted-foreground">{lkT('section_notifications_desc', language)}</p>

      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <Label className="font-medium">{lkT('label_send_notifications', language)}</Label>
          <p className="text-xs text-muted-foreground mt-0.5">{lkT('label_notifications_hint', language)}</p>
        </div>
        <Switch checked={enabled} onCheckedChange={(checked) => save({ enabled: checked })} />
      </div>

      <div className="space-y-2">
        <Label>{lkT('label_additional_email', language)}</Label>
        <div className="flex items-center gap-2">
          <Input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder={lkT('placeholder_email', language)}
            disabled={settings.isLoading || update.isPending}
          />
          <Button
            size="sm"
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
            disabled={!canAddEmail || update.isPending}
          >
            <MailPlus className="h-4 w-4 mr-1" />
            {lkT('btn_add', language)}
          </Button>
        </div>

        {settings.isLoading ? (
          <p className="text-sm text-muted-foreground">{lkT('label_loading', language)}</p>
        ) : emails.length === 0 ? (
          <p className="text-sm text-muted-foreground">{lkT('empty_no_additional_emails', language)}</p>
        ) : (
          <div className="space-y-1">
            {emails.map((email) => (
              <div key={email} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                <span>{email}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => save({ emails: emails.filter((item) => item !== email) })}
                  aria-label={`Удалить ${email}`}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}