import { Search, ShieldCheck, Scale, Zap } from 'lucide-react';
import { ClipboardList, FileText, ScanLine, PackageCheck } from 'lucide-react';
import ServiceLandingPageWithForm from '@/components/ServiceLandingPageWithForm';

const whyItems = {
  ru: [
    { icon: Search, title: 'Точная классификация', desc: 'Определяем код ТН ВЭД с учётом всех особенностей товара' },
    { icon: ShieldCheck, title: 'Минимизация рисков', desc: 'Исключаем ошибки классификации и связанные с ними штрафы' },
    { icon: Scale, title: 'Оптимизация платежей', desc: 'Подбираем код с минимальной ставкой пошлины в рамках закона' },
    { icon: Zap, title: 'Быстрый результат', desc: 'Классификация товара в кратчайшие сроки' },
  ],
  en: [
    { icon: Search, title: 'Accurate classification', desc: 'We determine HS code considering all product specifics' },
    { icon: ShieldCheck, title: 'Risk minimization', desc: 'We eliminate classification errors and related fines' },
    { icon: Scale, title: 'Payment optimization', desc: 'We select the code with the lowest duty rate within the law' },
    { icon: Zap, title: 'Quick results', desc: 'Product classification in the shortest time' },
  ],
};

const stepIcons = [
  { id: 'analyze', icon: ClipboardList },
  { id: 'search', icon: Search },
  { id: 'classify', icon: FileText },
  { id: 'verify', icon: ScanLine },
  { id: 'confirm', icon: PackageCheck },
];

export default function HsCodePage() {
  return <ServiceLandingPageWithForm slug="hs-code" whyItems={whyItems} stepIcons={stepIcons} />;
}
