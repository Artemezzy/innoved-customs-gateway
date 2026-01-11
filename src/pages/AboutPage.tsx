import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';
import { Clock, Monitor, Users, Download, FileText } from 'lucide-react';
import aboutBg from '@/assets/about-bg.jpg';
import containerShip from '@/assets/container-ship.jpg';
import teamImage from '@/assets/team-professionals.jpg';

const content = {
  ru: {
    pageTitle: 'О компании',
    heroTitle: 'ИННОВЭД',
    heroSubtitle: 'Ваш надежный таможенный брокер',
    heroDescription: 'Мы предоставляем полный спектр услуг по таможенному оформлению грузов, обеспечивая быстрое и безопасное прохождение всех необходимых процедур.',
    features: [
      { icon: Clock, title: 'Оперативность', description: 'Быстрое оформление документов и решение задач в кратчайшие сроки' },
      { icon: Monitor, title: 'Дистанционность', description: 'Работаем удаленно по всей России, экономя ваше время' },
      { icon: Users, title: 'Экспертность', description: 'Команда профессионалов с многолетним опытом в сфере ВЭД' },
    ],
    downloadPrice: 'Скачать прайс-лист',
    aboutTitle: 'О нашей компании',
    aboutText1: 'ИННОВЭД — это команда профессионалов в области внешнеэкономической деятельности и таможенного оформления. Мы работаем на рынке с 2015 года и за это время накопили богатый опыт решения самых сложных задач.',
    aboutText2: 'Наша миссия — сделать международную торговлю доступной и понятной для каждого клиента. Мы берем на себя все заботы по таможенному оформлению, чтобы вы могли сосредоточиться на развитии своего бизнеса.',
    approachTitle: 'Наш подход',
    approachText: 'Мы используем современные технологии и индивидуальный подход к каждому клиенту. Наша система работы позволяет отслеживать статус оформления в режиме реального времени и получать консультации 24/7.',
    ctaTitle: 'Готовы начать сотрудничество?',
    ctaDescription: 'Оставьте заявку и наш менеджер свяжется с вами в течение 15 минут',
    ctaButton: 'Оформить заявку',
  },
  en: {
    pageTitle: 'About Us',
    heroTitle: 'INNOVED',
    heroSubtitle: 'Your Reliable Customs Broker',
    heroDescription: 'We provide a full range of customs clearance services, ensuring fast and secure completion of all necessary procedures.',
    features: [
      { icon: Clock, title: 'Efficiency', description: 'Quick document processing and problem-solving in the shortest time' },
      { icon: Monitor, title: 'Remote Work', description: 'We work remotely throughout Russia, saving your time' },
      { icon: Users, title: 'Expertise', description: 'A team of professionals with years of experience in foreign trade' },
    ],
    downloadPrice: 'Download Price List',
    aboutTitle: 'About Our Company',
    aboutText1: 'INNOVED is a team of professionals in foreign trade and customs clearance. We have been in the market since 2015 and have accumulated extensive experience in solving the most complex tasks.',
    aboutText2: 'Our mission is to make international trade accessible and understandable for every client. We take care of all customs formalities so you can focus on growing your business.',
    approachTitle: 'Our Approach',
    approachText: 'We use modern technologies and an individual approach to each client. Our system allows you to track the clearance status in real-time and receive consultations 24/7.',
    ctaTitle: 'Ready to Start Cooperation?',
    ctaDescription: 'Leave a request and our manager will contact you within 15 minutes',
    ctaButton: 'Submit Request',
  },
};

export default function AboutPage() {
  const { language } = useLanguage();
  const t = content[language];

  useEffect(() => {
    analytics.pageView('/about', 'ИННОВЭД - О компании');
  }, []);

  return (
    <>
      <SEOHead language={language} page="home" />
      
      {/* Hero Section */}
      <section 
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${aboutBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a365d]/80 to-[#2d5a87]/60" />
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            {t.heroTitle}
          </h1>
          <p className="text-2xl md:text-3xl font-light mb-6 text-white/90">
            {t.heroSubtitle}
          </p>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-white/80 mb-12">
            {t.heroDescription}
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            {t.features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
          
          {/* Download Button */}
          <a
            href="/price-list.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#1a365d] hover:bg-[#2d4a6f] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Download className="w-5 h-5" />
            {t.downloadPrice}
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src={containerShip} 
                alt="Container ship" 
                className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#1a365d] rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-white text-4xl font-bold">9+</span>
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl font-bold text-[#1a365d] mb-6">{t.aboutTitle}</h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {t.aboutText1}
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t.aboutText2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-20 bg-[#1a365d]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl font-bold text-white mb-6">{t.approachTitle}</h2>
              <p className="text-white/80 text-lg leading-relaxed">
                {t.approachText}
              </p>
            </div>
            
            <div className="order-1 lg:order-2">
              <img 
                src={teamImage} 
                alt="Our team" 
                className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#2d5a87] to-[#1a365d]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">{t.ctaTitle}</h2>
          <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto">
            {t.ctaDescription}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 bg-white hover:bg-gray-100 text-[#1a365d] px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <FileText className="w-5 h-5" />
            {t.ctaButton}
          </Link>
        </div>
      </section>
    </>
  );
}
