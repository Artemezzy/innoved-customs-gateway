import { useState } from 'react';
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
      submit: 'Отправить заявку', consent: 'Я согласен на обработку персональных данных'
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
      submit: 'Send Request', consent: 'I agree to the processing of personal data'
    },
    success: 'Request sent successfully!',
    error: 'Please fill in all required fields and give consent to data processing.'
  }
};

export function Contact({ language }: ContactProps) {
  const text = content[language];
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', additionalInfo: '', consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.consent) {
      toast({ title: "Ошибка", description: text.error, variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-telegram-message', {
        body: {
          name: formData.name,
          inn: '',
          phone: formData.phone,
          email: formData.email,
          message: formData.additionalInfo,
        },
      });

      if (error) throw error;
      
      toast({ title: "Успех", description: text.success });
      analytics.formSubmit('contact');
      setFormData({ name: '', phone: '', email: '', additionalInfo: '', consent: false });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({ title: "Ошибка", description: "Произошла ошибка при отправке заявки", variant: "destructive" });
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
              <h2 className="text-xl font-semibold text-accent flex items-center gap-2 tracking-tight">
                <Building className="w-5 h-5" />
                {text.companyInfo.title}
              </h2>
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
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox id="consent" checked={formData.consent} onCheckedChange={(checked) => setFormData({...formData, consent: checked as boolean})} required />
                  <Label htmlFor="consent" className="text-sm text-muted-foreground">{text.form.consent} *</Label>
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
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
