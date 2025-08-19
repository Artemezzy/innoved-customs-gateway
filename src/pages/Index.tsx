import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Services } from '@/components/Services';
import { HowWeWork } from '@/components/HowWeWork';
import { Pricing } from '@/components/Pricing';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { LanguageToggle, Language } from '@/components/LanguageToggle';
import { SEOHead } from '@/components/SEOHead';
import { analytics } from '@/utils/analytics';

const Index = () => {
  const [language, setLanguage] = useState<Language>('ru');

  useEffect(() => {
    // Track page view
    analytics.pageView('/', 'ИННОВЭД - Главная страница');
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    analytics.languageChange(newLanguage);
  };

  const handleSectionClick = (section: string) => {
    // Scroll to section logic is handled in Footer component
  };

  return (
    <div className="min-h-screen">
      <SEOHead language={language} page="home" />
      
      {/* Header Navigation */}
      <Header language={language} />
      
      {/* Language Toggle - Fixed position */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle 
          currentLanguage={language}
          onLanguageChange={handleLanguageChange}
        />
      </div>

      {/* Hero Section */}
      <Hero language={language} />
      
      {/* About Section */}
      <About language={language} />
      
      {/* Services Section */}
      <Services language={language} />
      
      {/* How We Work Section */}
      <HowWeWork language={language} />
      
      {/* Pricing Section */}
      <Pricing language={language} />
      
      {/* Contact Section */}
      <Contact language={language} />
      
      {/* Footer */}
      <Footer language={language} onSectionClick={handleSectionClick} />
    </div>
  );
};

export default Index;
