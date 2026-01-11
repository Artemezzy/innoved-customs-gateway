import { Hero } from '@/components/Hero';
import { StatsSection } from '@/components/StatsSection';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { Services } from '@/components/Services';
import { Contact } from '@/components/Contact';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';

export default function Home() {
  const { language } = useLanguage();

  useEffect(() => {
    analytics.pageView('/', 'ИННОВЭД - Главная страница');
  }, []);

  return (
    <>
      <SEOHead language={language} page="home" />
      <Hero language={language} />
      <StatsSection language={language} />
      <WhyChooseUs language={language} />
      <Services language={language} />
      <Contact language={language} />
    </>
  );
}
