import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Mail, Phone, MessageCircle, Send, Building, MapPin } from 'lucide-react';
import maxIconWhite from '@/assets/max-icon-white.webp';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/utils/analytics';
import { supabase } from '@/integrations/supabase/client';

interface ContactProps {
  language: 'ru' | 'en';
}

const content = {
  ru: {
    title: 'Контакты',
    companyInfo: { title: 'Информация о компании', phone: 'Телефон', email: 'Email', telegram: 'Telegram', max: 'MAX Бот', address: 'Адрес' },
    form: {
      title: 'Оставить заявку', name: 'Имя', inn: 'ИНН компании', phone: 'Номер телефона для связи', email: 'Почта',
      additionalInfo: 'Дополнительная информация',
      additionalInfoPlaceholder: 'Опишите подробно вашу потребность, требования к логистике, особенности груза и другие важные детали...',
      submit: 'Отправить заявку',
      consent: 'Нажимая кнопку «Отправить заявку», я даю свое согласие на обработку моих персональных данных, в соответствии с Федеральным законом от 27.07.2006 года №152-ФЗ «О персональных данных», на условиях и для целей, определенных в',
      consentLink: 'Политике конфиденциальности',
      marketing: 'Согласен(на) на получение информационных и рекламных сообщений'
    },
    success: 'Заявка отправлена успешно!',
    error: 'Пожалуйста, заполните все обязательные поля и дайте согласие на обработку данных.'
  },
  en: {
    title: 'Contacts',
    companyInfo: { title: 'Company Information', phone: 'Phone', email: 'Email', telegram: 'Telegram', max: 'MAX Bot', address: 'Address' },
    form: {
      title: 'Leave Request', name: 'Name', inn: 'Company TIN', phone: 'Contact Phone', email: 'Email',
      additionalInfo: 'Additional Information',
      additionalInfoPlaceholder: 'Please describe your needs, logistics requirements, cargo specifics and other important details...',
      submit: 'Send Request',
      consent: 'By clicking "Send Request", I give my consent to the processing of my personal data, in accordance with the Federal Law of 27.07.2006 No. 152-FZ "On Personal Data", under the terms and for the purposes defined in the',
      consentLink: 'Privacy Policy',
      marketing: 'I agree to receive informational and promotional messages'
    },
    success: 'Request sent successfully!',
    error: 'Please fill in all required fields and give consent to data processing.'
  }
};

export function Contact({ language }: ContactProps) {
  const text = content[language];
  const { toast } = useToast();
  const location = useLocation();
  const prefill = (location.state as { prefill?: string })?.prefill || '';
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', additionalInfo: prefill, consent: false, marketing: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (prefill) {
      setFormData(prev => ({ ...prev, additionalInfo: prefill }));
    }
  }, [prefill]);

  const isValidPhone = (phone: string) => /^[\d\s\+\-\(\)]{7,20}$/.test(phone);
  const isValidEmail = (email: string) => !email || (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim() || !formData.consent) {
      toast({ title: "Ошибка", description: text.error, variant: "destructive" });
      return;
    }

    if (!isValidPhone(formData.phone)) {
      toast({ title: "Ошибка", description: language === 'ru' ? "Укажите корректный номер телефона" : "Please enter a valid phone number", variant: "destructive" });
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast({ title: "Ошибка", description: language === 'ru' ? "Укажите корректный email" : "Please enter a valid email", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-bitrix-lead', {
        body: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.additionalInfo,
        },
      });

      if (error) throw error;
      
      toast({ title: "Успех", description: text.success });
      analytics.formSubmit('contact');
      setFormData({ name: '', phone: '', email: '', additionalInfo: '', consent: false, marketing: false });
    } catch (error: unknown) {
      toast({ title: "Ошибка", description: language === 'ru' ? "Произошла ошибка при отправке заявки. Попробуйте позже." : "An error occurred. Please try again later.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Company Information */}
          <Card className="animate-fade-in shadow-card hover:shadow-hover transition-all duration-300 border border-border">
            <CardHeader>
              <h2 className="sr-only">{language === 'ru' ? 'Контакты таможенного брокера и форма заявки' : 'Customs broker contacts and request form'}</h2>
              <p className="text-xl font-semibold text-accent flex items-center gap-2 tracking-tight">
                <Building className="w-5 h-5" />
                {text.companyInfo.title}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">{text.companyInfo.phone}</p>
                  <a href="tel:89331881009" className="text-lg font-semibold text-foreground hover:text-accent transition-colors">
                    8 933 188 10 09
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">{text.companyInfo.email}</p>
                  <a href="mailto:info@innovedbroker.ru" className="text-lg font-semibold text-foreground hover:text-accent transition-colors">
                    info@innovedbroker.ru
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <img src={maxIconWhite} alt="MAX" className="w-5 h-5 shrink-0" style={{ filter: 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(1500%) hue-rotate(10deg) brightness(95%) contrast(90%)' }} />
                <div>
                  <p className="text-sm text-muted-foreground">{text.companyInfo.max}</p>
                  <a href="https://max.ru/id3849109300_bot" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-foreground hover:text-accent transition-colors">
                    @innovedbroker
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Send className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">{text.companyInfo.telegram}</p>
                  <a href="https://t.me/innovedbroker" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-foreground hover:text-accent transition-colors">
                    @innovedbroker
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">{text.companyInfo.address}</p>
                  <a href="https://go.2gis.com/V7I3P" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-foreground hover:text-accent transition-colors">
                    664050, {language === 'ru' ? 'Иркутск, Байкальская ул., 289/2' : 'Irkutsk, Baikalskaya st., 289/2'}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="animate-fade-in shadow-card hover:shadow-hover transition-all duration-300 border border-border" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <h2 className="text-xl font-semibold text-accent flex items-center gap-2 tracking-tight">
                <MessageCircle className="w-5 h-5" />
                {text.form.title}
              </h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">{text.form.name} *</Label>
                  <Input id="name" type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="transition-all duration-300 focus:ring-2 focus:ring-accent" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">{text.form.phone} *</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required className="transition-all duration-300 focus:ring-2 focus:ring-accent" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">{text.form.email}</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="transition-all duration-300 focus:ring-2 focus:ring-accent" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo" className="text-sm font-medium">{text.form.additionalInfo}</Label>
                  <Textarea id="additionalInfo" value={formData.additionalInfo} onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})} placeholder={text.form.additionalInfoPlaceholder} rows={4} className="transition-all duration-300 focus:ring-2 focus:ring-accent resize-none" />
                </div>
                <div className="flex items-start space-x-2 mt-4">
                  <Checkbox id="consent" checked={formData.consent} onCheckedChange={(checked) => setFormData({...formData, consent: checked as boolean})} className="mt-1" />
                  <Label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed">
                    {text.form.consent} <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{text.form.consentLink}</a> *
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox id="marketing" checked={formData.marketing} onCheckedChange={(checked) => setFormData({...formData, marketing: checked as boolean})} className="mt-1" />
                  <Label htmlFor="marketing" className="text-sm text-muted-foreground leading-relaxed">{text.form.marketing}</Label>
                </div>
                <Button type="submit" disabled={isSubmitting || !formData.consent} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? (language === 'ru' ? 'Отправка...' : 'Sending...') : text.form.submit}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
