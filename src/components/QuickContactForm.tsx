import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/utils/analytics';
import { supabase } from '@/integrations/supabase/client';

interface QuickContactFormProps {
  language: 'ru' | 'en';
  serviceName?: string;
}

const texts = {
  ru: {
    title: 'Оставить заявку',
    name: 'Имя',
    phone: 'Телефон',
    submit: 'Отправить заявку',
    sending: 'Отправка...',
    success: 'Заявка отправлена успешно!',
    errorRequired: 'Пожалуйста, заполните имя и телефон.',
    errorPhone: 'Укажите корректный номер телефона',
    errorGeneral: 'Произошла ошибка при отправке. Попробуйте позже.',
    consent: 'Отправляя заявку, я даю согласие на обработку персональных данных, в соответствии с',
    privacy: 'Политикой конфиденциальности',
    and: 'и',
    terms: 'Пользовательским соглашением',
    consentEnd: ', ознакомление с текстом которых подтверждаю.',
  },
  en: {
    title: 'Submit a request',
    name: 'Name',
    phone: 'Phone',
    submit: 'Send request',
    sending: 'Sending...',
    success: 'Request sent successfully!',
    errorRequired: 'Please fill in name and phone.',
    errorPhone: 'Please enter a valid phone number',
    errorGeneral: 'An error occurred. Please try again later.',
    consent: 'By submitting, I consent to the processing of personal data in accordance with the',
    privacy: 'Privacy Policy',
    and: 'and',
    terms: 'Terms of Service',
    consentEnd: ', confirming that I have read them.',
  },
};

export function QuickContactForm({ language, serviceName }: QuickContactFormProps) {
  const t = texts[language];
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidPhone = (p: string) => /^[\d\s\+\-\(\)]{7,20}$/.test(p);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      toast({ title: language === 'ru' ? 'Ошибка' : 'Error', description: t.errorRequired, variant: 'destructive' });
      return;
    }

    if (!isValidPhone(phone)) {
      toast({ title: language === 'ru' ? 'Ошибка' : 'Error', description: t.errorPhone, variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      const message = serviceName ? `Заявка со страницы услуги: ${serviceName}` : '';
      const { error } = await supabase.functions.invoke('send-bitrix-lead', {
        body: { name, phone, email: '', message },
      });
      if (error) throw error;

      toast({ title: language === 'ru' ? 'Успех' : 'Success', description: t.success });
      analytics.formSubmit('quick-contact');
      setName('');
      setPhone('');
    } catch {
      toast({ title: language === 'ru' ? 'Ошибка' : 'Error', description: t.errorGeneral, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-bold text-primary-foreground mb-4">{t.title}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="quick-name" className="text-sm text-primary-foreground/80">{t.name} *</Label>
          <Input
            id="quick-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:ring-accent"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="quick-phone" className="text-sm text-primary-foreground/80">{t.phone} *</Label>
          <Input
            id="quick-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:ring-accent"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? t.sending : t.submit}
        </Button>
      </form>
      <p className="mt-4 text-[11px] leading-relaxed text-primary-foreground/60">
        {t.consent}{' '}
        <Link to="/privacy" className="text-accent hover:underline">{t.privacy}</Link>{' '}
        {t.and}{' '}
        <Link to="/terms" className="text-accent hover:underline">{t.terms}</Link>
        {t.consentEnd}
      </p>
    </div>
  );
}
