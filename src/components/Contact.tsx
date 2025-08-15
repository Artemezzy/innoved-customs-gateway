import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactProps {
  language: 'ru' | 'en';
}

const content = {
  ru: {
    title: 'Контакты',
    form: {
      email: 'Электронная почта',
      phone: 'Телефон',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      message: 'Сообщение',
      consent: 'Я согласен на обработку персональных данных',
      submit: 'Отправить заявку'
    },
    success: 'Заявка отправлена успешно!',
    error: 'Пожалуйста, заполните все обязательные поля и дайте согласие на обработку данных.'
  },
  en: {
    title: 'Contacts',
    form: {
      email: 'Email',
      phone: 'Phone',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      message: 'Message',
      consent: 'I agree to the processing of personal data',
      submit: 'Send Request'
    },
    success: 'Request sent successfully!',
    error: 'Please fill in all required fields and give consent to data processing.'
  }
};

export function Contact({ language }: ContactProps) {
  const text = content[language];
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    whatsapp: '',
    telegram: '',
    message: '',
    consent: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.phone || !formData.consent) {
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
      email: '',
      phone: '',
      whatsapp: '',
      telegram: '',
      message: '',
      consent: false
    });
  };

  return (
    <section id="contact" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12 animate-fade-in">
          {text.title}
        </h2>
        <div className="max-w-2xl mx-auto">
          <Card className="animate-slide-in-right shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-center text-xl font-semibold text-primary flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />
                {text.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
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
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      {text.form.whatsapp}
                    </Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telegram" className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      {text.form.telegram}
                    </Label>
                    <Input
                      id="telegram"
                      type="text"
                      value={formData.telegram}
                      onChange={(e) => setFormData({...formData, telegram: e.target.value})}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    {text.form.message}
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex items-center space-x-2">
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
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-3 transition-all duration-300 hover:scale-105"
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