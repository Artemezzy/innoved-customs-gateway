import { ServiceCard } from './ServiceCard';
import { Truck, FileSearch, UserCheck, Shield } from 'lucide-react';

interface ServicesProps {
  language: 'ru' | 'en' | 'zh';
}

const content = {
  ru: {
    title: 'Наши услуги',
    services: [
      {
        title: 'Оформление импорта и экспорта',
        icon: <Truck />
      },
      {
        title: 'Определение кода ТН ВЭД',
        icon: <FileSearch />
      },
      {
        title: 'Регистрация импортёра в ЛК ФТС',
        icon: <UserCheck />
      },
      {
        title: 'Организация получения сертификатов и декларация соответствия',
        icon: <Shield />
      }
    ]
  },
  en: {
    title: 'Our Services',
    services: [
      {
        title: 'Import and Export Registration',
        icon: <Truck />
      },
      {
        title: 'HS Code Determination',
        icon: <FileSearch />
      },
      {
        title: 'Importer Registration in FCS Personal Account',
        icon: <UserCheck />
      },
      {
        title: 'Organization of Certificates and Declaration of Conformity',
        icon: <Shield />
      }
    ]
  },
  zh: {
    title: '我们的服务',
    services: [
      {
        title: '进出口登记',
        icon: <Truck />
      },
      {
        title: 'HS代码确定',
        icon: <FileSearch />
      },
      {
        title: '联邦海关总署个人账户进口商注册',
        icon: <UserCheck />
      },
      {
        title: '证书获取和合规声明组织',
        icon: <Shield />
      }
    ]
  }
};

export function Services({ language }: ServicesProps) {
  const text = content[language];

  return (
    <section id="services" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12 animate-fade-in">
          {text.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {text.services.map((service, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
              <ServiceCard 
                title={service.title}
                icon={service.icon}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}