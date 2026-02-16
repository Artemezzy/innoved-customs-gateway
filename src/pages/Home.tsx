import { Hero } from '@/components/Hero';
import { Achievements } from '@/components/Achievements';
import { GeographyMap } from '@/components/GeographyMap';
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
      <Achievements language={language} />
      <GeographyMap language={language} />
      <Testimonials language={language} />
    </>
  );
}
