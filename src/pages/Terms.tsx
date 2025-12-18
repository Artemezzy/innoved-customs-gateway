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
  },
  zh: {
    title: '服务条款',
    sections: [
      {
        title: '1. 协议主题',
        content: '本协议规定使用INNOVED网站和接受海关清关服务的条款。'
      },
      {
        title: '2. 服务',
        content: 'INNOVED提供专业的海关清关服务，包括在俄罗斯联邦境内的进口、出口和过境业务。'
      },
      {
        title: '3. 双方义务',
        content: '客户有义务提供准确的货物信息和必要的文件。INNOVED有义务在规定时间内优质地提供服务。'
      },
      {
        title: '4. 责任',
        content: '双方根据俄罗斯联邦现行法律承担责任。INNOVED不对第三方行为负责。'
      },
      {
        title: '5. 服务费用',
        content: '服务费用根据现行关税确定，并在工作开始前与客户协商。'
      },
      {
        title: '6. 协议变更',
        content: 'INNOVED有权通过在网站上通知用户来修改本协议。'
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
