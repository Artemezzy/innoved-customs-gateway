import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MessageCircle, Send, Building, Download, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/utils/analytics';

interface ContactProps {
  language: 'ru' | 'en';
}

const content = {
  ru: {
    title: 'Контакты',
    companyInfo: {
      title: 'Информация о компании',
      phone: 'Телефон',
      email: 'Email',
      telegram: 'Telegram'
    },
    form: {
      title: 'Оставить заявку',
      name: 'Имя',
      inn: 'ИНН компании',
      phone: 'Номер телефона для связи',
      email: 'Почта',
      additionalInfo: 'Дополнительная информация',
      additionalInfoPlaceholder: 'Опишите подробно вашу потребность, требования к логистике, особенности груза и другие важные детали...',
      submit: 'Отправить заявку',
      consent: 'Я согласен на обработку персональных данных'
    },
    success: 'Заявка отправлена успешно!',
    error: 'Пожалуйста, заполните все обязательные поля и дайте согласие на обработку данных.'
  },
  en: {
    title: 'Contacts',
    companyInfo: {
      title: 'Company Information',
      phone: 'Phone',
      email: 'Email',
      telegram: 'Telegram'
    },
    form: {
      title: 'Leave Request',
      name: 'Name',
      inn: 'Company TIN',
      phone: 'Contact Phone',
      email: 'Email',
      additionalInfo: 'Additional Information',
      additionalInfoPlaceholder: 'Please describe your needs, logistics requirements, cargo specifics and other important details...',
      submit: 'Send Request',
      consent: 'I agree to the processing of personal data'
    },
    success: 'Request sent successfully!',
    error: 'Please fill in all required fields and give consent to data processing.'
  }
};

export function Contact({ language }: ContactProps) {
  const text = content[language];
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    inn: '',
    phone: '',
    email: '',
    additionalInfo: '',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Load webhook URL from localStorage
    const savedWebhook = localStorage.getItem('pipedreamWebhookUrl');
    if (savedWebhook) {
      setWebhookUrl(savedWebhook);
    }
  }, []);

  const handleSaveWebhook = () => {
    if (webhookUrl) {
      localStorage.setItem('pipedreamWebhookUrl', webhookUrl);
      toast({
        title: "Успех",
        description: "Webhook URL сохранен",
      });
      setShowSettings(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.inn || !formData.phone || !formData.email || !formData.consent) {
      toast({
        title: "Ошибка",
        description: text.error,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to localStorage
      const contactRequest = {
        id: crypto.randomUUID(),
        name: formData.name,
        inn: formData.inn,
        phone: formData.phone,
        email: formData.email,
        additionalInfo: formData.additionalInfo,
        language,
        createdAt: new Date().toISOString(),
      };

      const existingRequests = JSON.parse(localStorage.getItem('contactRequests') || '[]');
      existingRequests.push(contactRequest);
      localStorage.setItem('contactRequests', JSON.stringify(existingRequests));

      // Send to Pipedream webhook
      if (webhookUrl) {
        console.log('Sending to webhook:', webhookUrl);
        try {
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formData.name,
              inn: formData.inn,
              phone: formData.phone,
              email: formData.email,
              message: formData.additionalInfo,
              language: language,
              timestamp: new Date().toISOString(),
            }),
          });
          
          console.log('Webhook response status:', response.status);
          
          if (!response.ok) {
            throw new Error(`Webhook failed with status: ${response.status}`);
          }
          
          console.log('Webhook sent successfully');
        } catch (error) {
          console.error('Webhook error:', error);
          toast({
            title: "Предупреждение",
            description: "Заявка сохранена локально, но не отправлена в Telegram. Проверьте настройки webhook.",
            variant: "destructive"
          });
        }
      } else {
        console.warn('Webhook URL not configured');
        toast({
          title: "Предупреждение",
          description: "Webhook URL не настроен. Заявка сохранена только локально.",
          variant: "destructive"
        });
      }
      
      toast({
        title: "Успех", 
        description: text.success,
      });

      // Track form submission
      analytics.formSubmit('contact');

      // Reset form
      setFormData({
        name: '',
        inn: '',
        phone: '',
        email: '',
        additionalInfo: '',
        consent: false
      });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при отправке заявки",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportJSON = () => {
    const requests = JSON.parse(localStorage.getItem('contactRequests') || '[]');
    
    if (requests.length === 0) {
      toast({
        title: "Предупреждение",
        description: "Нет заявок для экспорта",
        variant: "destructive"
      });
      return;
    }

    const dataStr = JSON.stringify(requests, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contact-requests-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Успех",
      description: `Экспортировано ${requests.length} заявок`,
    });
  };

  return (
    <section id="contact" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground animate-fade-in text-center">
            {text.title}
          </h2>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Company Information */}
          <Card className="animate-slide-in-left shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
                <Building className="w-5 h-5" />
                {text.companyInfo.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{text.companyInfo.phone}</p>
                  <a href="tel:89331881009" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                    8 933 188 10 09
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{text.companyInfo.email}</p>
                  <a href="mailto:info@innovedbroker.ru" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                    info@innovedbroker.ru
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Send className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{text.companyInfo.telegram}</p>
                  <a href="https://t.me/innovedbroker" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                    @innovedbroker
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="animate-slide-in-right shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {text.form.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    {text.form.name} *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inn" className="text-sm font-medium">
                    {text.form.inn} *
                  </Label>
                  <Input
                    id="inn"
                    type="text"
                    value={formData.inn}
                    onChange={(e) => setFormData({...formData, inn: e.target.value})}
                    required
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    {text.form.phone} *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {text.form.email} *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo" className="text-sm font-medium">
                    {text.form.additionalInfo}
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                    placeholder={text.form.additionalInfoPlaceholder}
                    rows={4}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) => setFormData({...formData, consent: checked as boolean})}
                    required
                  />
                  <Label htmlFor="consent" className="text-sm text-muted-foreground">
                    {text.form.consent} *
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {isSubmitting ? (
                    language === 'ru' ? 'Отправка...' : 'Sending...'
                  ) : text.form.submit}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}