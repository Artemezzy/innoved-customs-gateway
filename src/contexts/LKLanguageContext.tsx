import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LKLanguage = 'ru' | 'en' | 'zh';

interface LKLanguageContextType {
  language: LKLanguage;
  setLanguage: (lang: LKLanguage) => void;
}

const LKLanguageContext = createContext<LKLanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'lk_language';

export function LKLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LKLanguage>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved as LKLanguage) || 'ru';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  return (
    <LKLanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LKLanguageContext.Provider>
  );
}

export function useLKLanguage() {
  const context = useContext(LKLanguageContext);
  if (!context) {
    throw new Error('useLKLanguage must be used within an LKLanguageProvider');
  }
  return context;
}
