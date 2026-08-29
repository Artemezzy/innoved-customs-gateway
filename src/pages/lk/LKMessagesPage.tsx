import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { lkApi } from '@/api/lkClient';
import { useLKLanguage } from '@/contexts/LKLanguageContext';
import { lkT } from '@/lib/lkTranslations';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function LKMessagesPage() {
  const { language } = useLKLanguage();
  const { data, isLoading } = useQuery({
    queryKey: ['lk', 'manager-messages'],
    queryFn: () => lkApi.managerMessages(),
    refetchInterval: 15000,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{lkT('page_messages_title', language)}</h1>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : data && data.length > 0 ? (
        <div className="space-y-2">
          {data.map((m: any) => (
            <Link key={m.shipment_id} to={`/lk/shipments/${m.shipment_id}`}>
              <Card className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="font-medium">
                    {m.title} <span className="text-muted-foreground">· {m.client_name}</span>
                  </p>
                  <p className="text-sm text-muted-foreground truncate max-w-md">{m.last_message}</p>
                </div>
                <div className="flex items-center gap-2">
                  {m.unread_count > 0 && <Badge>{m.unread_count}</Badge>}
                  <span className="text-xs text-muted-foreground">
                    {new Date(m.last_message_at).toLocaleString('ru-RU')}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">{lkT('empty_no_messages_list', language)}</p>
      )}
    </div>
  );
}