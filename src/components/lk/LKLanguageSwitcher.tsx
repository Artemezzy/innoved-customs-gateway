import { useLKLanguage, LKLanguage } from '@/contexts/LKLanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const OPTIONS: { value: LKLanguage; label: string }[] = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
];

export function LKLanguageSwitcher() {
  const { language, setLanguage } = useLKLanguage();

  return (
    <Select value={language} onValueChange={(v) => setLanguage(v as LKLanguage)}>
      <SelectTrigger className="w-full bg-white/10 border-white/20 text-white text-sm h-9">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
