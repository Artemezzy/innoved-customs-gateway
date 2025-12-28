import { Contact } from '@/components/Contact';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';

const content = {
  ru: {
    title: 'Контакты',
    subtitle: 'Свяжитесь с нами для консультации'
  },
  en: {
    title: 'Contact Us',
    subtitle: 'Get in touch for a consultation'
  }
};

export default function ContactPage() {
  const { language } = useLanguage();
  const text = content[language];

  useEffect(() => {
    analytics.pageView('/contact', 'ИННОВЭД - Контакты');
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

      {/* Contact Component */}
      <Contact language={language} />
    </>
  );
}
