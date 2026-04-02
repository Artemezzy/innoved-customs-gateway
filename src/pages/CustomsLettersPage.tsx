import { FileText, ShieldCheck, Scale, Zap } from 'lucide-react';
import { ClipboardList, Search, ScanLine, PackageCheck } from 'lucide-react';
import ServiceLandingPageWithForm from '@/components/ServiceLandingPageWithForm';

const whyItems = {
  ru: [
    { icon: FileText, title: 'Юридическая грамотность', desc: 'Составляем письма в точном соответствии с требованиями ФТС' },
    { icon: ShieldCheck, title: 'Защита интересов', desc: 'Отстаиваем ваши права в переписке с таможенными органами' },
    { icon: Scale, title: 'Знание практики', desc: 'Опыт работы с различными таможенными управлениями' },
    { icon: Zap, title: 'Быстрая подготовка', desc: 'Оперативное составление и отправка обращений' },
  ],
  en: [
    { icon: FileText, title: 'Legal accuracy', desc: 'We draft letters in full compliance with FCS requirements' },
    { icon: ShieldCheck, title: 'Interest protection', desc: 'We defend your rights in correspondence with customs' },
    { icon: Scale, title: 'Practical knowledge', desc: 'Experience with various customs administrations' },
    { icon: Zap, title: 'Fast preparation', desc: 'Prompt drafting and sending of appeals' },
  ],
};

const stepIcons = [
  { id: 'brief', icon: ClipboardList },
  { id: 'analyze', icon: Search },
  { id: 'draft', icon: FileText },
  { id: 'review', icon: ScanLine },
  { id: 'send', icon: PackageCheck },
];

export default function CustomsLettersPage() {
  return <ServiceLandingPageWithForm slug="customs-letters" whyItems={whyItems} stepIcons={stepIcons} />;
}
