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
      {/* ИСПРАВЛЕНО (SEO-аудит, август 2026): явный canonicalPath="/" вместо
          полагания на fallback window.location.pathname в SEOHead.
          window.location.pathname и раньше не включал query-параметры
          (?aviclid=..., ?other_stat=...), поэтому canonical технически был
          корректен и без этого явного указания. Но явная фиксация делает
          поведение предсказуемым и независимым от будущих изменений логики
          в SEOHead.tsx или от нестандартных схем роутинга. */}
      <SEOHead language={language} page="home" canonicalPath="/" />
      <Hero language={language} />
      <BrokerServices language={language} />
      <InfoBlocks language={language} />
      <CaseStudies language={language} />
      <CustomsCalculator language={language} />
      <Testimonials language={language} />
    </>
  );
}