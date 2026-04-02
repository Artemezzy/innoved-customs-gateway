import { Globe, ShieldCheck, Scale, Zap } from 'lucide-react';
import { ClipboardList, Search, FileText, ScanLine, PackageCheck } from 'lucide-react';
import ServiceLandingPageWithForm from '@/components/ServiceLandingPageWithForm';

const whyItems = {
  ru: [
    { icon: Globe, title: 'Любые языки', desc: 'Переводим документы с/на китайский, английский, турецкий и другие языки' },
    { icon: ShieldCheck, title: 'Нотариальное заверение', desc: 'Организуем нотариальное заверение переводов' },
    { icon: Scale, title: 'Таможенная специфика', desc: 'Знаем терминологию ВЭД и требования таможенных органов' },
    { icon: Zap, title: 'Срочный перевод', desc: 'Выполняем срочные заказы в кратчайшие сроки' },
  ],
  en: [
    { icon: Globe, title: 'Any language', desc: 'We translate documents from/to Chinese, English, Turkish and more' },
    { icon: ShieldCheck, title: 'Notarization', desc: 'We arrange notarized translations' },
    { icon: Scale, title: 'Customs specifics', desc: 'We know foreign trade terminology and customs requirements' },
    { icon: Zap, title: 'Urgent translation', desc: 'We complete urgent orders in the shortest time' },
  ],
};

const stepIcons = [
  { id: 'receive', icon: ClipboardList },
  { id: 'analyze', icon: Search },
  { id: 'translate', icon: FileText },
  { id: 'review', icon: ScanLine },
  { id: 'deliver', icon: PackageCheck },
];

export default function TranslationPage() {
  return <ServiceLandingPageWithForm slug="translation" whyItems={whyItems} stepIcons={stepIcons} />;
}
