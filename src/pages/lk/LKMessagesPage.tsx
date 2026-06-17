import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { lkApi } from '@/api/lkClient';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function LKMessagesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['lk', 'manager-messages'],
    queryFn: () => lkApi.managerMessages(),
    refetchInterval: 15000,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Сообщения</h1>

      {isLoading && (
        <>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </>
      )}

      {!isLoading && data && data.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">Нет сообщений</Card>
      )}

      <div className="space-y-2">
        {data?.map((row: any) => (
          <Link key={row.shipment_id} to={`/lk/shipments/${row.shipment_id}`}>
            <Card className="p-4 hover:bg-muted/40 transition-colors">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{row.client_name}</span>
                    <span className="text-xs text-muted-foreground">
                      · Поставка #{row.shipment_id} — {row.shipment_title}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground truncate mt-1">{row.preview}</div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {new Date(row.last_at).toLocaleString('ru-RU')}
                  </span>
                  {row.unread > 0 && <Badge>{row.unread}</Badge>}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
