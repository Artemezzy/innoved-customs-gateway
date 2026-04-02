import { ShieldCheck, Scale, Globe, Zap } from 'lucide-react';
import { ClipboardList, Search, FileText, ScanLine, PackageCheck } from 'lucide-react';
import ServiceLandingPageWithForm from '@/components/ServiceLandingPageWithForm';

const whyItems = {
  ru: [
    { icon: ShieldCheck, title: 'Все виды сертификатов', desc: 'Оформляем сертификаты, декларации соответствия и СГР' },
    { icon: Scale, title: 'Аккредитованные лаборатории', desc: 'Работаем с проверенными испытательными центрами' },
    { icon: Zap, title: 'Сжатые сроки', desc: 'Ускоренное оформление разрешительных документов' },
    { icon: Globe, title: 'Для любых товаров', desc: 'Сертификация продукции из любых стран мира' },
  ],
  en: [
    { icon: ShieldCheck, title: 'All certificate types', desc: 'We issue certificates, declarations of conformity and SGR' },
    { icon: Scale, title: 'Accredited laboratories', desc: 'We work with verified testing centers' },
    { icon: Zap, title: 'Tight deadlines', desc: 'Fast processing of permits and certificates' },
    { icon: Globe, title: 'For any goods', desc: 'Certification of products from any country' },
  ],
};

const stepIcons = [
  { id: 'request', icon: ClipboardList },
  { id: 'analyze', icon: Search },
  { id: 'test', icon: ScanLine },
  { id: 'docs', icon: FileText },
  { id: 'issue', icon: PackageCheck },
];

export default function CertificationPage() {
  return <ServiceLandingPageWithForm slug="certification" whyItems={whyItems} stepIcons={stepIcons} />;
}
