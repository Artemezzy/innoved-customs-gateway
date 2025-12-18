import { About } from '@/components/About';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';
import teamImage from '@/assets/team-professionals.jpg';

const content = {
  ru: {
    title: 'О компании ИННОВЭД',
    subtitle: 'Ваш надежный партнер в сфере таможенного оформления',
    history: {
      title: 'Наша история',
      text: 'Компания ИННОВЭД была основана командой профессионалов с многолетним опытом работы в сфере таможенного оформления и внешнеэкономической деятельности. За годы работы мы помогли сотням компаний успешно организовать импорт и экспорт товаров.'
    },
    mission: {
      title: 'Наша миссия',
      text: 'Сделать таможенное оформление простым, быстрым и понятным для каждого клиента. Мы стремимся к тому, чтобы внешнеэкономическая деятельность перестала быть преградой для развития вашего бизнеса.'
    },
    values: {
      title: 'Наши ценности',
      items: [
        { title: 'Профессионализм', text: 'Команда сертифицированных специалистов с глубоким знанием законодательства' },
        { title: 'Скорость', text: 'Оперативное оформление благодаря отлаженным процессам и современным технологиям' },
        { title: 'Прозрачность', text: 'Честные цены без скрытых платежей, полная отчётность по каждой операции' },
        { title: 'Надёжность', text: 'Гарантия соблюдения всех требований законодательства и сроков оформления' }
      ]
    }
  },
  en: {
    title: 'About INNOVED',
    subtitle: 'Your reliable partner in customs clearance',
    history: {
      title: 'Our History',
      text: 'INNOVED was founded by a team of professionals with many years of experience in customs clearance and foreign economic activity. Over the years, we have helped hundreds of companies successfully organize import and export of goods.'
    },
    mission: {
      title: 'Our Mission',
      text: 'To make customs clearance simple, fast, and understandable for every client. We strive to ensure that foreign economic activity is no longer a barrier to the development of your business.'
    },
    values: {
      title: 'Our Values',
      items: [
        { title: 'Professionalism', text: 'A team of certified specialists with deep knowledge of legislation' },
        { title: 'Speed', text: 'Prompt processing thanks to streamlined processes and modern technologies' },
        { title: 'Transparency', text: 'Honest prices without hidden fees, full reporting on every operation' },
        { title: 'Reliability', text: 'Guarantee of compliance with all legal requirements and processing deadlines' }
      ]
    }
  },
  zh: {
    title: '关于 INNOVED',
    subtitle: '您在清关方面的可靠合作伙伴',
    history: {
      title: '我们的历史',
      text: 'INNOVED由一支在清关和对外经济活动方面拥有多年经验的专业团队创立。多年来，我们帮助数百家公司成功组织了商品进出口。'
    },
    mission: {
      title: '我们的使命',
      text: '使清关对每个客户来说都变得简单、快速和易于理解。我们努力确保对外经济活动不再成为您业务发展的障碍。'
    },
    values: {
      title: '我们的价值观',
      items: [
        { title: '专业性', text: '拥有深厚法律知识的认证专家团队' },
        { title: '速度', text: '凭借优化的流程和现代技术进行快速处理' },
        { title: '透明度', text: '诚实的价格，无隐藏费用，每项操作都有完整报告' },
        { title: '可靠性', text: '保证遵守所有法律要求和处理期限' }
      ]
    }
  }
};

export default function AboutPage() {
  const { language } = useLanguage();
  const text = content[language];

  useEffect(() => {
    analytics.pageView('/about', 'ИННОВЭД - О компании');
  }, []);

  return (
    <>
      <SEOHead language={language} page="home" />
      
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            {text.title}
          </h1>
          <p className="text-xl opacity-90 animate-fade-in">
            {text.subtitle}
          </p>
        </div>
      </section>

      {/* About Component */}
      <About language={language} />

      {/* History Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                {text.history.title}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {text.history.text}
              </p>
            </div>
            <div className="animate-fade-in">
              <img
                src={teamImage}
                alt="INNOVED team"
                className="w-full h-auto rounded-lg shadow-card"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-foreground mb-6 animate-fade-in">
            {text.mission.title}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed animate-fade-in">
            {text.mission.text}
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center animate-fade-in">
            {text.values.title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {text.values.items.map((value, index) => (
              <div 
                key={index}
                className="bg-card p-6 rounded-lg shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
