import { ShieldCheck, Scale, Globe, Zap } from 'lucide-react';
import { ClipboardList, Search, FileText, ScanLine, PackageCheck } from 'lucide-react';
import ServiceLandingPage from '@/components/ServiceLandingPage';

const whyItems = {
  ru: [
    { icon: ShieldCheck, title: 'Комплексный подход', desc: 'Закрываем весь процесс: от сбора документов до выпуска товара' },
    { icon: Scale, title: 'Знание законодательства', desc: 'Отслеживаем все изменения в таможенном регулировании' },
    { icon: Zap, title: 'Минимизация рисков', desc: 'Исключаем доначисления, штрафы и отказы в выпуске' },
    { icon: Globe, title: 'Удалённое оформление', desc: 'Работаем по всей России независимо от места нахождения груза' },
  ],
  en: [
    { icon: ShieldCheck, title: 'Comprehensive approach', desc: 'We cover the full process: from document collection to goods release' },
    { icon: Scale, title: 'Legal expertise', desc: 'We track all changes in customs regulation' },
    { icon: Zap, title: 'Risk minimization', desc: 'We eliminate additional charges, fines, and release refusals' },
    { icon: Globe, title: 'Remote processing', desc: 'We work across Russia regardless of cargo location' },
  ],
};

const stepIcons = [
  { id: 'analysis', icon: ClipboardList },
  { id: 'classification', icon: Search },
  { id: 'declaration', icon: FileText },
  { id: 'control', icon: ScanLine },
  { id: 'release', icon: PackageCheck },
];

export default function TamozhennayaOchistkaPage() {
  return <ServiceLandingPage slug="tamozhennaya-ochistka" whyItems={whyItems} stepIcons={stepIcons} />;
}
