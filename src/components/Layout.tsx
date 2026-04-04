import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { LanguageToggle } from './LanguageToggle';
import { Bitrix24Chat } from './Bitrix24Chat';
import { CookieConsent } from './CookieConsent';
import { useLanguage } from '@/contexts/LanguageContext';
import { analytics } from '@/utils/analytics';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLanguage: 'ru' | 'en') => {
    setLanguage(newLanguage);
    analytics.languageChange(newLanguage);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header language={language} onLanguageChange={handleLanguageChange} />

      <main className="flex-1">
        {children}
      </main>
      
      <Footer language={language} />
      <Bitrix24Chat />
      <CookieConsent />
    </div>
  );
}
