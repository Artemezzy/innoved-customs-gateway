import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MessageCircle, Send, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactProps {
  language: 'ru' | 'en' | 'zh';
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
      submit: 'Send Request',
      consent: 'I agree to the processing of personal data'
    },
    success: 'Request sent successfully!',
    error: 'Please fill in all required fields and give consent to data processing.'
  },
  zh: {
    title: '联系我们',
    companyInfo: {
      title: '公司信息',
      phone: '电话',
      email: '邮箱',
      telegram: 'Telegram'
    },
    form: {
      title: '提交申请',
      name: '姓名',
      inn: '公司税号',
      phone: '联系电话',
      email: '邮箱',
      submit: '提交申请',
      consent: '我同意处理个人数据'
    },
    success: '申请提交成功！',
    error: '请填写所有必填字段并同意数据处理。'
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
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // For now, just show success message without actual email sending
    try {
      // Simulate form submission delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Успех", 
        description: text.success,
      });

      // Reset form
      setFormData({
        name: '',
        inn: '',
        phone: '',
        email: '',
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
                    language === 'ru' ? 'Отправка...' : 
                    language === 'en' ? 'Sending...' : 
                    '发送中...'
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