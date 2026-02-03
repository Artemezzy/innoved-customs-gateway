import { Hero } from '@/components/Hero';
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
      <Testimonials language={language} />
    </>
  );
}
