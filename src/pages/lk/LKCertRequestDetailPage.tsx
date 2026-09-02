import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Download } from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { useAuth } from '@/contexts/AuthContext';
import { useLKLanguage } from '@/contexts/LKLanguageContext';
import { lkT } from '@/lib/lkTranslations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CertRequestStatusSelect } from '@/components/lk/CertRequestStatusSelect';
import { CertChatPanel } from '@/components/lk/CertChatPanel';
import { CertItemsPanel } from '@/components/lk/CertItemsPanel';
import { TemplatesPanel } from '@/components/lk/TemplatesPanel';

export default function LKCertRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const requestId = Number(id);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();
  const { language } = useLKLanguage();
  const isManager = user?.role === 'manager';

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

  if (detail.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!detail.data) {
    return <p className="text-muted-foreground">Заявка не найдена.</p>;
  }

  const { request, items } = detail.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/lk/cert-requests')} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-semibold">
            {request.number} — {request.cert_center_name}
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                await lkApi.exportCertRequest(requestId);
              } catch (err: any) {
                toast.error(err?.message || 'Не удалось скачать');
              }
            }}
          >
            <Download className="h-4 w-4 mr-1" />
            {lkT('btn_download', language)}
          </Button>
          <CertRequestStatusSelect requestId={requestId} value={request.status} disabled={!isManager} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CertItemsPanel
            requestId={requestId}
            request={request}
            items={items}
            canEditHeader={isManager}
          />
        </div>
        <div className="space-y-4">
          <Card className="p-0 overflow-hidden h-fit">
            <CertChatPanel requestId={requestId} />
          </Card>
          <TemplatesPanel />
        </div>
      </div>
    </div>
  );
}