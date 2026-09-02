import { useState } from 'react';
import { ChevronDown, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLKLanguage } from '@/contexts/LKLanguageContext';
import { lkT } from '@/lib/lkTranslations';

const TEMPLATES: { key: 'dul' | 'request'; labelKey: 'template_dul' | 'template_request'; filename: string }[] = [
  { key: 'dul', labelKey: 'template_dul', filename: 'Шаблон ДУЛ.docx' },
  { key: 'request', labelKey: 'template_request', filename: 'Шаблон заявки.docx' },
];

export function TemplatesPanel() {
  const [open, setOpen] = useState(false);
  const { language } = useLKLanguage();

  const handleDownload = async (key: 'dul' | 'request', filename: string) => {
    try {
      await lkApi.downloadTemplate(key, filename);
    } catch (err: any) {
      toast.error(err?.message || 'Не удалось скачать шаблон');
    }
  };

  return (
    <Card className="p-0 overflow-hidden">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors">
            <span>{lkT('section_templates', language)}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-2">
            {TEMPLATES.map((t) => (
              <div key={t.key} className="flex items-center justify-between rounded-md border px-3 py-2">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {lkT(t.labelKey, language)}
                </div>
                <Button variant="outline" size="sm" onClick={() => handleDownload(t.key, t.filename)}>
                  <Download className="h-4 w-4 mr-1" />
                  {lkT('btn_download', language)}
                </Button>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}