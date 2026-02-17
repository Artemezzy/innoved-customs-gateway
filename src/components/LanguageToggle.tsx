import { useState } from 'react';
import { Button } from '@/components/ui/button';

export type Language = 'ru' | 'en';

interface LanguageToggleProps {
  onLanguageChange: (lang: Language) => void;
  currentLanguage: Language;
}

export function LanguageToggle({ onLanguageChange, currentLanguage }: LanguageToggleProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={currentLanguage === 'ru' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onLanguageChange('ru')}
        className={`text-xs ${currentLanguage === 'ru' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'border-white/30 text-white hover:bg-white/10'}`}
      >
        RU
      </Button>
      <Button
        variant={currentLanguage === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onLanguageChange('en')}
        className={`text-xs ${currentLanguage === 'en' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'border-white/30 text-white hover:bg-white/10'}`}
      >
        EN
      </Button>
    </div>
  );
}