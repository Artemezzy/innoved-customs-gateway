import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { lkApi } from '@/api/lkClient';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CertRequestStatusSelect } from '@/components/lk/CertRequestStatusSelect';
import { CertFilesPanel } from '@/components/lk/CertFilesPanel';
import { CertChatPanel } from '@/components/lk/CertChatPanel';
import { CertItemsPanel } from '@/components/lk/CertItemsPanel';

export default function LKCertRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const requestId = Number(id);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const detail = useQuery({
    queryKey: ['lk', 'cert-request', requestId],
    queryFn: () => lkApi.certRequest(requestId),
    enabled: !!requestId,
  });

  useEffect(() => {
    if (detail.isSuccess) {
      qc.invalidateQueries({ queryKey: ['lk', 'cert-requests'] });
    }
  }, [detail.isSuccess, qc]);

  if (detail.isLoading) return <Skeleton className="h-96 w-full" />;
  if (detail.isError || !detail.data) {
    return (
      <div className="space-y-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/lk/cert-requests')}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> К списку
        </Button>
        <p>Заявка не найдена.</p>
      </div>
    );
  }

  const { request, items, files } = detail.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/lk/cert-requests')}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> К списку
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Статус:</span>
          <CertRequestStatusSelect requestId={requestId} value={request.status} />
        </div>
      </div>

      <Card className="p-5">
        <h2 className="font-semibold mb-4">Данные заявки</h2>
        <CertItemsPanel requestId={requestId} items={items} />
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold mb-4">Вложения</h2>
        <CertFilesPanel requestId={requestId} files={files} />
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold mb-4">Чат</h2>
        <CertChatPanel requestId={requestId} />
      </Card>
    </div>
  );
}
