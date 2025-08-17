import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Services } from '@/components/Services';
import { Pricing } from '@/components/Pricing';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { LanguageToggle, Language } from '@/components/LanguageToggle';

const Index = () => {
  const [language, setLanguage] = useState<Language>('ru');

  const handleSectionClick = (section: string) => {
    // Scroll to section logic is handled in Footer component
  };

  return (
    <div className="min-h-screen">
      {/* Header Navigation */}
      <Header language={language} />
      
      {/* Language Toggle - Fixed position */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle 
          currentLanguage={language}
          onLanguageChange={setLanguage}
        />
      </div>

      {/* Hero Section */}
      <Hero language={language} />
      
      {/* About Section */}
      <About language={language} />
      
      {/* Services Section */}
      <Services language={language} />
      
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
