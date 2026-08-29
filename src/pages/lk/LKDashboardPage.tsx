import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Users, Package, MessageSquare } from 'lucide-react';
import { lkApi } from '@/api/lkClient';
import { useLKLanguage } from '@/contexts/LKLanguageContext';
import { lkT } from '@/lib/lkTranslations';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function LKDashboardPage() {
  const navigate = useNavigate();
  const { language } = useLKLanguage();
  const stats = useQuery({ queryKey: ['lk', 'stats'], queryFn: () => lkApi.managerStats() });

  const cards = [
    { label: lkT('card_total_clients', language), value: stats.data?.clients_total, icon: Users, to: '/lk/clients' },
    { label: lkT('card_active_shipments', language), value: stats.data?.shipments_active, icon: Package, to: '/lk/shipments' },
    { label: lkT('card_unread_messages', language), value: stats.data?.messages_unread, icon: MessageSquare, to: '/lk/messages' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{lkT('nav_dashboard', language)}</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card
              key={c.label}
              className="p-5 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(c.to)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  {stats.isLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold mt-1">{c.value ?? 0}</p>
                  )}
                </div>
                <Icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}