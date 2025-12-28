import { HowWeWork } from '@/components/HowWeWork';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';

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
      <SEOHead language={language} page="home" />
      
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

      {/* How We Work Component */}
      <HowWeWork language={language} />
    </>
  );
}
