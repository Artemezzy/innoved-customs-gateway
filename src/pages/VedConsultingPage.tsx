import { Globe, ShieldCheck, Scale, Zap } from 'lucide-react';
import { ClipboardList, Search, FileText, ScanLine, PackageCheck } from 'lucide-react';
import ServiceLandingPageWithForm from '@/components/ServiceLandingPageWithForm';

const whyItems = {
  ru: [
    { icon: Globe, title: 'Комплексный подход', desc: 'Консультируем по всем аспектам внешнеэкономической деятельности' },
    { icon: ShieldCheck, title: 'Актуальная экспертиза', desc: 'Отслеживаем все изменения в законодательстве ВЭД' },
    { icon: Scale, title: 'Оптимизация затрат', desc: 'Помогаем снизить таможенные и логистические расходы' },
    { icon: Zap, title: 'Индивидуальные решения', desc: 'Разрабатываем стратегию ВЭД под задачи вашего бизнеса' },
  ],
  en: [
    { icon: Globe, title: 'Comprehensive approach', desc: 'We consult on all aspects of foreign trade' },
    { icon: ShieldCheck, title: 'Up-to-date expertise', desc: 'We track all changes in foreign trade legislation' },
    { icon: Scale, title: 'Cost optimization', desc: 'We help reduce customs and logistics costs' },
    { icon: Zap, title: 'Custom solutions', desc: 'We develop a foreign trade strategy for your business' },
  ],
};

const stepIcons = [
  { id: 'brief', icon: ClipboardList },
  { id: 'analyze', icon: Search },
  { id: 'plan', icon: FileText },
  { id: 'implement', icon: ScanLine },
  { id: 'support', icon: PackageCheck },
];

export default function VedConsultingPage() {
  return <ServiceLandingPageWithForm slug="ved-consulting" whyItems={whyItems} stepIcons={stepIcons} />;
}
