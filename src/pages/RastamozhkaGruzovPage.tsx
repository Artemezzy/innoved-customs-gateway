import { Truck, ShieldCheck, Clock, Globe } from 'lucide-react';
import { ClipboardList, Search, FileText, ScanLine, PackageCheck } from 'lucide-react';
import ServiceLandingPage from '@/components/ServiceLandingPage';

const whyItems = {
  ru: [
    { icon: Truck, title: 'Любые типы грузов', desc: 'Контейнерные, навалочные, наливные, негабаритные и сборные поставки' },
    { icon: ShieldCheck, title: 'Проверка документов', desc: 'Многоуровневый контроль каждого документа до подачи декларации' },
    { icon: Clock, title: 'Минимальные сроки', desc: 'Электронное декларирование и выстроенные процессы ускоряют оформление' },
    { icon: Globe, title: 'Все посты РФ', desc: 'Удалённое оформление грузов независимо от точки прибытия' },
  ],
  en: [
    { icon: Truck, title: 'All cargo types', desc: 'Container, bulk, liquid, oversized, and consolidated shipments' },
    { icon: ShieldCheck, title: 'Document verification', desc: 'Multi-level review of every document before declaration' },
    { icon: Clock, title: 'Minimal timelines', desc: 'Electronic declaration and streamlined processes speed up clearance' },
    { icon: Globe, title: 'All Russian posts', desc: 'Remote cargo processing regardless of arrival point' },
  ],
};

const stepIcons = [
  { id: 'docs', icon: ClipboardList },
  { id: 'classify', icon: Search },
  { id: 'declare', icon: FileText },
  { id: 'control', icon: ScanLine },
  { id: 'release', icon: PackageCheck },
];

export default function RastamozhkaGruzovPage() {
  return <ServiceLandingPage slug="rastamozhka-gruzov" whyItems={whyItems} stepIcons={stepIcons} />;
}
