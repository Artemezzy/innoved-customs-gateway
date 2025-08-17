import { useState } from 'react';
import { Button } from '@/components/ui/button';

export type Language = 'ru' | 'en' | 'zh';

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
        className="text-xs"
      >
        RU
      </Button>
      <Button
        variant={currentLanguage === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onLanguageChange('en')}
        className="text-xs"
      >
        EN
      </Button>
      <Button
        variant={currentLanguage === 'zh' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onLanguageChange('zh')}
        className="text-xs"
      >
        中文
      </Button>
    </div>
  );
}