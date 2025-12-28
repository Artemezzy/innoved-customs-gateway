import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';

const content = {
  ru: {
    title: 'Пользовательское соглашение',
    sections: [
      {
        title: '1. Предмет соглашения',
        content: 'Настоящее соглашение регулирует условия использования сайта ИННОВЭД и получения услуг таможенного оформления товаров.'
      },
      {
        title: '2. Услуги',
        content: 'ИННОВЭД предоставляет профессиональные услуги по таможенному оформлению товаров, включая импорт, экспорт и транзитные операции на территории Российской Федерации.'
      },
      {
        title: '3. Обязательства сторон',
        content: 'Клиент обязуется предоставить достоверную информацию о товарах и необходимые документы. ИННОВЭД обязуется оказать услуги качественно и в установленные сроки.'
      },
      {
        title: '4. Ответственность',
        content: 'Стороны несут ответственность в соответствии с действующим законодательством РФ. ИННОВЭД не несет ответственности за действия третьих лиц.'
      },
      {
        title: '5. Стоимость услуг',
        content: 'Стоимость услуг определяется в соответствии с действующими тарифами и согласовывается с клиентом до начала работ.'
      },
      {
        title: '6. Изменения соглашения',
        content: 'ИННОВЭД вправе вносить изменения в настоящее соглашение, уведомив об этом пользователей на сайте.'
      }
    ]
  },
  en: {
    title: 'Terms of Service',
    sections: [
      {
        title: '1. Subject of Agreement',
        content: 'This agreement regulates the terms of using the INNOVED website and receiving customs clearance services.'
      },
      {
        title: '2. Services',
        content: 'INNOVED provides professional customs clearance services, including import, export and transit operations in the Russian Federation.'
      },
      {
        title: '3. Obligations of the Parties',
        content: 'The client is obliged to provide accurate information about goods and necessary documents. INNOVED is obliged to provide services with quality and within established timeframes.'
      },
      {
        title: '4. Responsibility',
        content: 'The parties bear responsibility in accordance with the current legislation of the Russian Federation. INNOVED is not responsible for the actions of third parties.'
      },
      {
        title: '5. Service Cost',
        content: 'The cost of services is determined in accordance with current tariffs and agreed with the client before work begins.'
      },
      {
        title: '6. Agreement Changes',
        content: 'INNOVED has the right to make changes to this agreement by notifying users on the website.'
      }
    ]
  }
};

const Terms = () => {
  const { language } = useLanguage();
  const text = content[language];

  return (
    <Layout>
      <SEOHead language={language} page="terms" />
      
      <div className="py-12">
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
      </div>
    </Layout>
  );
};

export default Terms;
