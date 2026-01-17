import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { HomeHeader } from '@/components/HomeHeader';
import { Footer } from '@/components/Footer';
import homeBgClean from '@/assets/home-bg-clean.jpg';
const content = {
  ru: {
    hero: {
      title: '"ТАМОЖНЯ БЕЗ ГРАНИЦ: ВАШ ГРУЗ - НАША ЗАБОТА!"',
      cta: 'Оформить заявку'
    },
    stats: {
      title: 'С ИННОВЭД - таможенное оформление: быстро, надежно, удобно!',
      aboutBtn: 'О компании',
      items: [{
        number: '200+',
        label: 'городов по всей России'
      }, {
        number: '100+',
        label: 'завершенных сделок в месяц'
      }, {
        number: '10',
        label: 'лет на рынке внешнеэкономической деятельности'
      }]
    },
    whyUs: {
      title: 'Почему выбирают нас?',
      items: [{
        title: 'Скорость и эффективность',
        desc: 'Быстрое таможенное оформление без задержек'
      }, {
        title: 'Финансовая экономия',
        desc: 'Оптимизация затрат на логистику'
      }, {
        title: 'Дистанционный формат',
        desc: 'Работаем онлайн по всей России'
      }, {
        title: 'Экспертная поддержка 24/7',
        desc: 'Консультации в любое время'
      }]
    },
    services: {
      title: 'Услуги',
      items: ['Оформление импорта', 'Оформление экспорта', 'Определение кода ТН ВЭД', 'Регистрация импортёра в ЛК ФТС', 'Организация получения сертификатов', 'Подготовка писем в таможенные органы', 'Организация досмотра товаров', 'Перевод документов']
    }
  },
  en: {
    hero: {
      title: '"CUSTOMS WITHOUT BORDERS: YOUR CARGO - OUR CARE!"',
      cta: 'Submit Request'
    },
    stats: {
      title: 'With INNOVED - customs clearance: fast, reliable, convenient!',
      aboutBtn: 'About Us',
      items: [{
        number: '200+',
        label: 'cities across Russia'
      }, {
        number: '100+',
        label: 'completed deals per month'
      }, {
        number: '10',
        label: 'years in foreign trade market'
      }]
    },
    whyUs: {
      title: 'Why Choose Us?',
      items: [{
        title: 'Speed and Efficiency',
        desc: 'Fast customs clearance without delays'
      }, {
        title: 'Cost Savings',
        desc: 'Logistics cost optimization'
      }, {
        title: 'Remote Format',
        desc: 'Working online across Russia'
      }, {
        title: 'Expert Support 24/7',
        desc: 'Consultations anytime'
      }]
    },
    services: {
      title: 'Services',
      items: ['Import Processing', 'Export Processing', 'HS Code Determination', 'Importer Registration in FCS', 'Certificate Obtaining', 'Letters to Customs Authorities', 'Cargo Inspection Organization', 'Document Translation']
    }
  }
};
export default function Home() {
  const {
    language
  } = useLanguage();
  const t = content[language];
  return <>
      <SEOHead language={language} page="home" />
      <div className="relative w-full">
        {/* Background image */}
        <img src={homeBgClean} alt="ИННОВЭД - Таможенное оформление" className="w-full h-auto" />
        
        {/* Overlay with real HTML elements */}
        <div className="absolute inset-0 flex flex-col">
          {/* Header */}
          <HomeHeader />
          
          {/* Hero Section */}
          <section className="absolute flex flex-col items-start justify-center px-6 lg:px-12" style={{
          top: '10%',
          left: '3%',
          width: '50%',
          height: '18%'
        }}>
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold italic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight max-w-2xl">
              {t.hero.title}
            </h1>
            <Link to="/contact" className="mt-4 md:mt-6 px-6 py-3 bg-[hsl(8,65%,46%)] hover:bg-[hsl(8,65%,40%)] text-white font-semibold rounded-lg transition-colors duration-200 text-sm md:text-base shadow-lg">
              {t.hero.cta}
            </Link>
          </section>
          
          {/* Stats Section */}
          <section className="absolute flex flex-col px-6 lg:px-12" style={{
          top: '32%',
          left: '3%',
          width: '95%',
          height: '30%'
        }}>
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground mb-4 max-w-xl">
              {t.stats.title}
            </h2>
            <Link to="/about" className="inline-flex w-fit px-6 py-2.5 bg-[hsl(214,60%,25%)] hover:bg-[hsl(214,60%,30%)] text-white font-medium rounded-lg transition-colors duration-200 text-sm shadow-md">
              {t.stats.aboutBtn}
            </Link>
            
            {/* Stats numbers */}
            <div className="absolute flex justify-between items-start gap-4" style={{
            top: '40%',
            left: '25%',
            width: '70%'
          }}>
              {t.stats.items.map((stat, index) => <div key={index} className="flex flex-col items-center text-center flex-1">
                  <span className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[hsl(80,45%,45%)]">
                    {stat.number}
                  </span>
                  <span className="text-xs md:text-sm text-foreground/80 mt-1 max-w-32">
                    {stat.label}
                  </span>
                </div>)}
            </div>
          </section>
          
          {/* Why Choose Us Section */}
          <section className="absolute flex flex-col px-6 lg:px-12" style={{
          top: '56%',
          left: '3%',
          width: '95%',
          height: '16%'
        }}>
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-4">
              {t.whyUs.title}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {t.whyUs.items.map((item, index) => <div key={index} className="flex flex-col">
                  <h3 className="text-sm md:text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.desc}
                  </p>
                </div>)}
            </div>
          </section>
          
          {/* Services Section */}
          <section className="absolute flex flex-col px-6 lg:px-12" style={{
          top: '74%',
          left: '3%',
          width: '95%',
          height: '20%'
        }}>
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-4">
              {t.services.title}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {t.services.items.map((service, index) => <Link key={index} to="/services" className="py-3 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 px-[100px] text-4xl bg-white/0 text-white">
                  <span className="w-2 h-2 rounded-full bg-[hsl(80,45%,45%)]" />
                  {service}
                </Link>)}
            </div>
          </section>
        </div>
      </div>
      
      {/* Footer */}
      <Footer language={language} />
    </>;
}