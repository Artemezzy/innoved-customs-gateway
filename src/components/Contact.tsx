import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MessageCircle, Send, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      title: 'Форма обратной связи',
      name: 'Имя',
      inn: 'ИНН компании',
      phone: 'Номер телефона для связи',
      email: 'Почта',
      submit: 'Отправить заявку'
    },
    success: 'Заявка отправлена успешно!',
    error: 'Пожалуйста, заполните все обязательные поля.'
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
      title: 'Contact Form',
      name: 'Name',
      inn: 'Company TIN',
      phone: 'Contact Phone',
      email: 'Email',
      submit: 'Send Request'
    },
    success: 'Request sent successfully!',
    error: 'Please fill in all required fields.'
  }
};

export function Contact({ language }: ContactProps) {
  const text = content[language];
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    inn: '',
    phone: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.inn || !formData.phone || !formData.email) {
      toast({
        title: "Ошибка",
        description: text.error,
        variant: "destructive"
      });
      return;
    }

    // Here you would normally send the data to your backend
    toast({
      title: "Успех",
      description: text.success,
    });

    // Reset form
    setFormData({
      name: '',
      inn: '',
      phone: '',
      email: ''
    });
  };

  return (
    <section id="contact" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12 animate-fade-in">
          {text.title}
        </h2>
        
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
                  <a href="tel:88001112233" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                    8 800 111 22 33
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{text.companyInfo.email}</p>
                  <a href="mailto:broker@innovedbroker.ru" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                    broker@innovedbroker.ru
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

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-3 transition-all duration-300"
                >
                  {text.form.submit}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}