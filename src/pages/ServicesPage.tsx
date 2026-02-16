import { Services } from '@/components/Services';
import { RussiaMap } from '@/components/RussiaMap';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';

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
      
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            {text.title}
          </h1>
          <p className="text-xl opacity-90 animate-fade-in">
            {text.subtitle}
          </p>
        </div>
      </section>

      {/* Services Component */}
      <Services language={language} />

      {/* Russia Coverage Map */}
      <RussiaMap language={language} />
    </>
  );
}
