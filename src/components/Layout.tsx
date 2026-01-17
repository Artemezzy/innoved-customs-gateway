import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { analytics } from '@/utils/analytics';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isImagePage = location.pathname === '/about';

  const handleLanguageChange = (newLanguage: 'ru' | 'en') => {
    setLanguage(newLanguage);
    analytics.languageChange(newLanguage);
  };

  // Home page has its own header and footer
  if (isHomePage) {
    return (
      <div className="min-h-screen">
        <div className="fixed top-4 right-4 z-50">
          <LanguageToggle 
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
          />
        </div>
        {children}
      </div>
    );
  }

  // На страницах с изображениями Header и Footer являются частью изображения
  if (isImagePage) {
    return (
      <div className="min-h-screen">
        <div className="fixed top-4 right-4 z-50">
          <LanguageToggle 
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
          />
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header language={language} />
      
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle 
          currentLanguage={language}
          onLanguageChange={handleLanguageChange}
        />
      </div>

      <main className="flex-1 pt-16">
        {children}
      </main>
      
      <Footer language={language} />
    </div>
  );
}
