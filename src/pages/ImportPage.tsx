import { Package, ShieldCheck, Zap, Globe } from 'lucide-react';
import { ClipboardList, Search, FileText, ScanLine, PackageCheck } from 'lucide-react';
import ServiceLandingPage from '@/components/ServiceLandingPage';

const whyItems = {
  ru: [
    { icon: Package, title: 'Электронное декларирование', desc: 'Подача деклараций онлайн через защищённые каналы связи с ФТС' },
    { icon: ShieldCheck, title: 'Работаем 24/7', desc: 'Отправляем декларацию в наиболее оптимальное время без задержек' },
    { icon: Globe, title: 'Любые посты РФ', desc: 'Удалённое оформление независимо от точки прибытия груза' },
    { icon: Zap, title: 'Выделенный менеджер', desc: 'Один специалист ведёт сделку от начала до конца' },
  ],
  en: [
    { icon: Package, title: 'Electronic declaration', desc: 'Online declaration filing through secure FCS channels' },
    { icon: ShieldCheck, title: 'We work 24/7', desc: 'We submit declarations at the optimal time without delays' },
    { icon: Globe, title: 'Any Russian post', desc: 'Remote processing regardless of cargo arrival point' },
    { icon: Zap, title: 'Dedicated manager', desc: 'One specialist handles your transaction from start to finish' },
  ],
};

const stepIcons = [
  { id: 'docs', icon: ClipboardList },
  { id: 'analyze', icon: Search },
  { id: 'declare', icon: FileText },
  { id: 'support', icon: ScanLine },
  { id: 'release', icon: PackageCheck },
];

export default function ImportPage() {
  return <ServiceLandingPage slug="import" whyItems={whyItems} stepIcons={stepIcons} />;
}
