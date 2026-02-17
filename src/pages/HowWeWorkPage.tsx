import { HowWeWork } from '@/components/HowWeWork';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';
import { PageHero } from '@/components/PageHero';

const content = {
  ru: {
    title: 'Как мы работаем',
    subtitle: 'Прозрачный процесс от заявки до получения груза'
  },
  en: {
    title: 'How We Work',
    subtitle: 'Transparent process from application to cargo receipt'
  }
};

export default function HowWeWorkPage() {
  const { language } = useLanguage();
  const text = content[language];

  useEffect(() => {
    analytics.pageView('/how-we-work', 'ИННОВЭД - Как мы работаем');
  }, []);

  return (
    <>
      <SEOHead language={language} page="howWeWork" />
      <PageHero title={text.title} subtitle={text.subtitle} />
      <HowWeWork language={language} showHeader={false} />
    </>
  );
}
