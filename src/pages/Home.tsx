import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { HomeHeader } from '@/components/HomeHeader';
import { Footer } from '@/components/Footer';
import homeBgClean from '@/assets/home-bg-clean.jpg';

const content = {
  ru: {
    hero: {
      titleLine1: 'ТАМОЖНЯ БЕЗ ГРАНИЦ:',
      titleLine2: 'ВАШ ГРУЗ — НАША ЗАБОТА!',
      cta: 'Оформить заявку',
    },
    stats: {
      title: 'С ИННОВЭД - таможенное оформление: быстро, надежно, удобно!',
      aboutBtn: 'О компании',
      items: [
        { number: '200+', label: 'городов по всей России' },
        { number: '100+', label: 'завершенных сделок в месяц' },
        { number: '10', label: 'лет на рынке внешнеэкономической деятельности' },
      ],
    },
    whyUs: {
      title: 'Почему выбирают нас?',
      items: [
        { title: 'Скорость и эффективность', desc: 'Быстрое таможенное оформление без задержек' },
        { title: 'Финансовая экономия', desc: 'Оптимизация затрат на логистику' },
        { title: 'Дистанционный формат', desc: 'Работаем онлайн по всей России' },
        { title: 'Экспертная поддержка 24/7', desc: 'Консультации в любое время' },
      ],
    },
    services: {
      title: 'Услуги',
      items: [
        'Оформление импорта',
        'Оформление экспорта',
        'Определение кода ТН ВЭД',
        'Регистрация импортёра в ЛК ФТС',
        'Организация получения сертификатов',
        'Подготовка писем в таможенные органы',
        'Организация досмотра товаров',
        'Перевод документов',
      ],
    },
  },
  en: {
    hero: {
      titleLine1: 'CUSTOMS WITHOUT BORDERS',
      titleLine2: 'YOUR CARGO - OUR CARE!',
      cta: 'Submit Request',
    },
    stats: {
      title: 'With INNOVED - customs clearance: fast, reliable, convenient!',
      aboutBtn: 'About Us',
      items: [
        { number: '200+', label: 'cities across Russia' },
        { number: '100+', label: 'completed deals per month' },
        { number: '10', label: 'years in foreign trade market' },
      ],
    },
    whyUs: {
      title: 'Why Choose Us?',
      items: [
        { title: 'Speed and Efficiency', desc: 'Fast customs clearance without delays' },
        { title: 'Cost Savings', desc: 'Logistics cost optimization' },
        { title: 'Remote Format', desc: 'Working online across Russia' },
        { title: 'Expert Support 24/7', desc: 'Consultations anytime' },
      ],
    },
    services: {
      title: 'Services',
      items: [
        'Import Processing',
        'Export Processing',
        'HS Code Determination',
        'Importer Registration in FCS',
        'Certificate Obtaining',
        'Letters to Customs Authorities',
        'Cargo Inspection Organization',
        'Document Translation',
      ],
    },
  },
};

export default function Home() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <>
      <SEOHead language={language} page="home" />
      <div className="relative w-full">
        {/* Background image */}
        <img 
          src={homeBgClean} 
          alt="ИННОВЭД - Таможенное оформление" 
          className="w-full h-auto"
        />
        
        {/* Overlay with real HTML elements */}
        <div className="absolute inset-0 flex flex-col">
          {/* Header */}
          <HomeHeader />
          
          {/* Hero Section */}
          <section 
            className="absolute flex flex-col items-start justify-center"
            style={{ top: '18%', left: '4%', width: '45%' }}
          >
            <h1 
              className="text-white whitespace-nowrap"
              style={{ 
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                fontSize: 'clamp(1rem, 3vw, 2.5rem)',
                lineHeight: 1.3,
              }}
            >
              {t.hero.titleLine1}<br />
              {t.hero.titleLine2}
            </h1>
            <Link
              to="/contact"
              className="mt-4 md:mt-6 px-5 md:px-8 py-2.5 md:py-3 text-white font-semibold rounded-md transition-colors duration-200 text-xs sm:text-sm md:text-base shadow-lg hover:opacity-90"
              style={{ 
                backgroundColor: '#c1442b',
              }}
            >
              {t.hero.cta}
            </Link>
          </section>
          
          {/* Stats Section */}
          <section 
            className="absolute"
            style={{ top: '36%', left: '4%', width: '92%' }}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              {/* Left column: title + button */}
              <div className="flex flex-col max-w-md">
                <h2 
                  className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold leading-tight"
                  style={{ color: '#1a2744' }}
                >
                  {t.stats.title}
                </h2>
                <div style={{ marginLeft: '2rem' }}>
                  <Link
                    to="/about"
                    className="mt-3 md:mt-4 inline-flex w-fit px-5 md:px-6 py-2 md:py-2.5 text-white font-medium rounded-md transition-colors duration-200 text-xs sm:text-sm hover:opacity-90 border border-white/30"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    {t.stats.aboutBtn}
                  </Link>
                </div>
              </div>
              
              {/* Right column: stats numbers */}
              <div className="flex justify-around items-start gap-4 md:gap-8 lg:gap-12 flex-1">
                {t.stats.items.map((stat, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    <span 
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold"
                      style={{ color: '#6dad42' }}
                    >
                      {stat.number}
                    </span>
                    <span 
                      className="text-[10px] sm:text-xs md:text-sm mt-1 max-w-24 md:max-w-32"
                      style={{ color: '#1a2744' }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Why Choose Us Section */}
          <section 
            className="absolute"
            style={{ top: '55%', left: '4%', width: '92%' }}
          >
            <h2 
              className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold mb-3 md:mb-4"
              style={{ color: '#1a2744' }}
            >
              {t.whyUs.title}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {t.whyUs.items.map((item, index) => (
                <div key={index} className="flex flex-col">
                  <h3 
                    className="text-xs sm:text-sm md:text-base font-semibold"
                    style={{ color: '#1a2744' }}
                  >
                    {item.title}
                  </h3>
                  <p 
                    className="text-[10px] sm:text-xs mt-1"
                    style={{ color: '#6b7280' }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Services Section */}
          <section 
            className="absolute"
            style={{ top: '72%', left: '4%', width: '92%' }}
          >
            <h2 
              className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold mb-3 md:mb-4"
              style={{ color: '#1a2744' }}
            >
              {t.services.title}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {t.services.items.map((service, index) => (
                <Link
                  key={index}
                  to="/services"
                  className="bg-white/95 hover:bg-white px-3 md:px-4 py-2 md:py-3 rounded-md text-[10px] sm:text-xs md:text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
                  style={{ color: '#1a2744' }}
                >
                  <span 
                    className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: '#6dad42' }}
                  />
                  {service}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
      
      {/* Footer */}
      <Footer language={language} />
    </>
  );
}
