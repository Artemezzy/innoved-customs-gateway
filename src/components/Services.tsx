import { ServiceCard } from './ServiceCard';
import { Truck, Ship, FileSearch, UserPlus, Shield, Mail, ScanLine, Languages } from 'lucide-react';

interface ServicesProps {
  language: 'ru' | 'en' | 'zh';
}

const content = {
  ru: {
    title: 'Наши услуги',
    services: [
      {
        title: 'Оформление импорта',
        icon: <Truck />
      },
      {
        title: 'Оформление экспорта',
        icon: <Ship />
      },
      {
        title: 'Определение кода ТН ВЭД',
        icon: <FileSearch />
      },
      {
        title: 'Регистрация импортёра в ЛК ФТС',
        icon: <UserPlus />
      },
      {
        title: 'Организация получения сертификатов и декларация соответствия',
        icon: <Shield />
      },
      {
        title: 'Подготовка писем в таможенные органы',
        icon: <Mail />
      },
      {
        title: 'Организация досмотра товаров',
        icon: <ScanLine />
      },
      {
        title: 'Перевод документов',
        icon: <Languages />
      }
    ]
  },
  en: {
    title: 'Our Services',
    services: [
      {
        title: 'Import Registration',
        icon: <Truck />
      },
      {
        title: 'Export Registration',
        icon: <Ship />
      },
      {
        title: 'HS Code Determination',
        icon: <FileSearch />
      },
      {
        title: 'Importer Registration in FCS Personal Account',
        icon: <UserPlus />
      },
      {
        title: 'Organization of Certificates and Declaration of Conformity',
        icon: <Shield />
      },
      {
        title: 'Preparation of Letters to Customs Authorities',
        icon: <Mail />
      },
      {
        title: 'Organization of Goods Inspection',
        icon: <ScanLine />
      },
      {
        title: 'Document Translation',
        icon: <Languages />
      }
    ]
  },
  zh: {
    title: '我们的服务',
    services: [
      {
        title: '进口登记',
        icon: <Truck />
      },
      {
        title: '出口登记',
        icon: <Ship />
      },
      {
        title: 'HS代码确定',
        icon: <FileSearch />
      },
      {
        title: '联邦海关总署个人账户进口商注册',
        icon: <UserPlus />
      },
      {
        title: '证书获取和合规声明组织',
        icon: <Shield />
      },
      {
        title: '海关机关信件准备',
        icon: <Mail />
      },
      {
        title: '货物检查组织',
        icon: <ScanLine />
      },
      {
        title: '文件翻译',
        icon: <Languages />
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