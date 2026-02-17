import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHero } from '@/components/PageHero';

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
  }
};

const Privacy = () => {
  const { language } = useLanguage();
  const text = content[language];

  return (
    <>
      <SEOHead language={language} page="privacy" />
      <PageHero title={text.title} />
      
      <div className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            {text.sections.map((section, index) => (
              <section key={index} className="bg-card p-6 rounded-lg shadow-card border border-border">
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
      </div>
    </>
  );
};

export default Privacy;
