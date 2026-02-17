import { Services } from '@/components/Services';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';
import { PageHero } from '@/components/PageHero';

const content = {
  ru: {
    title: 'Наши услуги',
    subtitle: 'Полный спектр услуг по таможенному оформлению и ВЭД'
  },
  en: {
    title: 'Our Services',
    subtitle: 'Full range of customs clearance and foreign trade services'
  }
};

export default function ServicesPage() {
  const { language } = useLanguage();
  const text = content[language];

  useEffect(() => {
    analytics.pageView('/services', 'ИННОВЭД - Услуги');
  }, []);

  return (
    <>
      <SEOHead language={language} page="services" />
      <PageHero title={text.title} subtitle={text.subtitle} />
      <Services language={language} />
    </>
  );
}
