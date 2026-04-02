import { PackageCheck, ShieldCheck, Clock, Globe } from 'lucide-react';
import { ClipboardList, Search, FileText, ScanLine } from 'lucide-react';
import ServiceLandingPage from '@/components/ServiceLandingPage';

const whyItems = {
  ru: [
    { icon: ShieldCheck, title: 'Белый импорт', desc: 'Работаем только в правовом поле, исключая серые схемы' },
    { icon: PackageCheck, title: 'Любые категории', desc: 'Электроника, одежда, оборудование, сырьё и продукты питания' },
    { icon: Clock, title: 'Декларирование 24/7', desc: 'Подача деклараций через защищённые каналы ФТС в любое время' },
    { icon: Globe, title: 'Выделенный менеджер', desc: 'Один специалист ведёт партию от приёма документов до выпуска' },
  ],
  en: [
    { icon: ShieldCheck, title: 'White import', desc: 'We only work within the legal framework, no gray schemes' },
    { icon: PackageCheck, title: 'Any category', desc: 'Electronics, clothing, equipment, raw materials and food' },
    { icon: Clock, title: 'Declaration 24/7', desc: 'Filing through secure FCS channels at any time' },
    { icon: Globe, title: 'Dedicated manager', desc: 'One specialist handles your shipment from start to finish' },
  ],
};

const stepIcons = [
  { id: 'docs', icon: ClipboardList },
  { id: 'classify', icon: Search },
  { id: 'declare', icon: FileText },
  { id: 'control', icon: ScanLine },
  { id: 'release', icon: PackageCheck },
];

export default function RastamozhkaTovarovPage() {
  return <ServiceLandingPage slug="rastamozhka-tovarov" whyItems={whyItems} stepIcons={stepIcons} />;
}
