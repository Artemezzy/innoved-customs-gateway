import { Contact } from '@/components/Contact';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';
import { PageHero } from '@/components/PageHero';

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
      <SEOHead language={language} page="contact" />
      <PageHero title={text.title} subtitle={text.subtitle} />
      <Contact language={language} />
    </>
  );
}
