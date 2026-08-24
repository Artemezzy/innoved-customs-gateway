import { NotificationSettingsCard } from '@/components/lk/NotificationSettingsCard';

export default function LKNotificationsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Уведомления</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Настройте, на какие email-адреса отправлять уведомления по заявкам на сертификацию.
        </p>
      </div>

      <NotificationSettingsCard />
    </div>
  );
}
