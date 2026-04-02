import { Hero } from '@/components/Hero';
import { BrokerServices } from '@/components/BrokerServices';
import { InfoBlocks } from '@/components/InfoBlocks';
import { CaseStudies } from '@/components/CaseStudies';
import { CustomsCalculator } from '@/components/CustomsCalculator';
import { Testimonials } from '@/components/Testimonials';
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
      <BrokerServices language={language} />
      <InfoBlocks language={language} />
      <CaseStudies language={language} />
      <Testimonials language={language} />
    </>
  );
}
