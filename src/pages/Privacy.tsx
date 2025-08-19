import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LanguageToggle, Language } from '@/components/LanguageToggle';
import { SEOHead } from '@/components/SEOHead';
import { useState } from 'react';

const content = {
  ru: {
    title: 'Политика конфиденциальности',
    sections: [
      {
        title: '1. Общие положения',
        content: 'Настоящая Политика конфиденциальности определяет порядок обработки персональных данных пользователей сайта ИННОВЭД. Мы уважаем вашу конфиденциальность и обязуемся защищать ваши персональные данные.'
      },
      {
        title: '2. Сбор персональных данных',
        content: 'Мы собираем только необходимую информацию для предоставления наших услуг: имя, контактную информацию, данные о грузах для таможенного оформления.'
      },
      {
        title: '3. Использование данных',
        content: 'Ваши данные используются исключительно для предоставления услуг таможенного оформления, связи с вами и улучшения качества наших услуг.'
      },
      {
        title: '4. Защита данных',
        content: 'Мы применяем современные технические и организационные меры для защиты ваших персональных данных от несанкционированного доступа, изменения или уничтожения.'
      },
      {
        title: '5. Контакты',
        content: 'По вопросам обработки персональных данных обращайтесь к нам через Telegram: @innovedbroker'
      }
    ]
  },
  en: {
    title: 'Privacy Policy',
    sections: [
      {
        title: '1. General Provisions',
        content: 'This Privacy Policy defines the procedure for processing personal data of INNOVED website users. We respect your privacy and are committed to protecting your personal data.'
      },
      {
        title: '2. Personal Data Collection',
        content: 'We collect only necessary information to provide our services: name, contact information, cargo data for customs clearance.'
      },
      {
        title: '3. Data Usage',
        content: 'Your data is used exclusively for providing customs clearance services, communicating with you, and improving the quality of our services.'
      },
      {
        title: '4. Data Protection',
        content: 'We apply modern technical and organizational measures to protect your personal data from unauthorized access, modification, or destruction.'
      },
      {
        title: '5. Contacts',
        content: 'For questions regarding personal data processing, contact us via Telegram: @innovedbroker'
      }
    ]
  },
  zh: {
    title: '隐私政策',
    sections: [
      {
        title: '1. 一般条款',
        content: '本隐私政策规定了INNOVED网站用户个人数据的处理程序。我们尊重您的隐私，并致力于保护您的个人数据。'
      },
      {
        title: '2. 个人数据收集',
        content: '我们只收集提供服务所需的信息：姓名、联系信息、海关清关的货物数据。'
      },
      {
        title: '3. 数据使用',
        content: '您的数据仅用于提供海关清关服务、与您沟通以及改善我们的服务质量。'
      },
      {
        title: '4. 数据保护',
        content: '我们采用现代技术和组织措施来保护您的个人数据免受未经授权的访问、修改或销毁。'
      },
      {
        title: '5. 联系方式',
        content: '有关个人数据处理的问题，请通过Telegram联系我们：@innovedbroker'
      }
    ]
  }
};

const Privacy = () => {
  const [language, setLanguage] = useState<Language>('ru');
  const text = content[language];

  return (
    <div className="min-h-screen">
      <SEOHead language={language} page="privacy" />
      
      <Header language={language} />
      
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle 
          currentLanguage={language}
          onLanguageChange={setLanguage}
        />
      </div>

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-primary mb-8">{text.title}</h1>
          
          <div className="space-y-8">
            {text.sections.map((section, index) => (
              <section key={index} className="bg-card p-6 rounded-lg shadow-card">
                <h2 className="text-xl font-semibold text-card-foreground mb-4">
                  {section.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer language={language} onSectionClick={() => {}} />
    </div>
  );
};

export default Privacy;