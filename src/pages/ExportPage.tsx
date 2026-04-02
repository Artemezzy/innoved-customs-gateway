import { ShieldCheck, Globe, Zap, Scale } from 'lucide-react';
import { ClipboardList, Search, FileText, ScanLine, PackageCheck } from 'lucide-react';
import ServiceLandingPageWithForm from '@/components/ServiceLandingPageWithForm';

const whyItems = {
  ru: [
    { icon: ShieldCheck, title: 'Безотказное оформление', desc: 'Гарантируем корректное оформление экспортных деклараций' },
    { icon: Scale, title: 'Валютный контроль', desc: 'Помогаем с оформлением паспортов сделок и валютных операций' },
    { icon: Zap, title: 'Оперативность', desc: 'Минимальные сроки подготовки документов для экспорта' },
    { icon: Globe, title: 'Любые направления', desc: 'Оформляем экспорт в любые страны мира' },
  ],
  en: [
    { icon: ShieldCheck, title: 'Reliable clearance', desc: 'We guarantee correct export declaration processing' },
    { icon: Scale, title: 'Currency control', desc: 'We help with transaction passports and currency operations' },
    { icon: Zap, title: 'Speed', desc: 'Minimal document preparation time for export' },
    { icon: Globe, title: 'Any destination', desc: 'We process exports to any country worldwide' },
  ],
};

const stepIcons = [
  { id: 'docs', icon: ClipboardList },
  { id: 'classify', icon: Search },
  { id: 'declare', icon: FileText },
  { id: 'control', icon: ScanLine },
  { id: 'release', icon: PackageCheck },
];

export default function ExportPage() {
  return <ServiceLandingPageWithForm slug="export" whyItems={whyItems} stepIcons={stepIcons} />;
}
