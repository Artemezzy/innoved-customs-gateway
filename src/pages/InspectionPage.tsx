import { ScanLine, ShieldCheck, Scale, Zap } from 'lucide-react';
import { ClipboardList, Search, FileText, PackageCheck } from 'lucide-react';
import ServiceLandingPageWithForm from '@/components/ServiceLandingPageWithForm';

const whyItems = {
  ru: [
    { icon: ScanLine, title: 'Полное сопровождение', desc: 'Организуем досмотр от подачи заявки до получения акта' },
    { icon: ShieldCheck, title: 'Присутствие на досмотре', desc: 'Наш специалист присутствует при проведении досмотра' },
    { icon: Scale, title: 'Документальное оформление', desc: 'Корректное оформление всех актов и протоколов' },
    { icon: Zap, title: 'Минимизация простоя', desc: 'Сокращаем время досмотра и связанные с ним расходы' },
  ],
  en: [
    { icon: ScanLine, title: 'Full support', desc: 'We organize inspection from application to receiving the report' },
    { icon: ShieldCheck, title: 'On-site presence', desc: 'Our specialist is present during the inspection' },
    { icon: Scale, title: 'Documentation', desc: 'Proper preparation of all reports and protocols' },
    { icon: Zap, title: 'Minimize downtime', desc: 'We reduce inspection time and related costs' },
  ],
};

const stepIcons = [
  { id: 'request', icon: ClipboardList },
  { id: 'plan', icon: Search },
  { id: 'docs', icon: FileText },
  { id: 'inspect', icon: ScanLine },
  { id: 'report', icon: PackageCheck },
];

export default function InspectionPage() {
  return <ServiceLandingPageWithForm slug="inspection" whyItems={whyItems} stepIcons={stepIcons} />;
}
