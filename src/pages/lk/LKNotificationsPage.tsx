import { NotificationSettingsCard } from '@/components/lk/NotificationSettingsCard';
import { useLKLanguage } from '@/contexts/LKLanguageContext';
import { lkT } from '@/lib/lkTranslations';

export default function LKNotificationsPage() {
  const { language } = useLKLanguage();
  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-xl font-semibold">{lkT('nav_notifications', language)}</h1>
      <p className="text-sm text-muted-foreground">{lkT('section_notifications_desc', language)}</p>
      <NotificationSettingsCard />
    </div>
  );
}
