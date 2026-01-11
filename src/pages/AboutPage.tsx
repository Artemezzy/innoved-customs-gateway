import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';
import aboutImage from '@/assets/about-page.jpg';

export default function AboutPage() {
  const { language } = useLanguage();

  useEffect(() => {
    analytics.pageView('/about', 'ИННОВЭД - О компании');
  }, []);

  return (
    <>
      <SEOHead language={language} page="home" />
      <div className="relative w-full">
        {/* Full-page image */}
        <img 
          src={aboutImage} 
          alt="ИННОВЭД - О компании" 
          className="w-full h-auto"
        />
        
        {/* Clickable hotspots overlay */}
        <div className="absolute inset-0">
          {/* Header navigation hotspots */}
          <Link 
            to="/" 
            className="absolute hover:bg-white/10 transition-colors rounded cursor-pointer"
            style={{ top: '1.2%', left: '25%', width: '4.5%', height: '1.8%' }}
            aria-label="Главная"
          />
          <Link 
            to="/about" 
            className="absolute hover:bg-white/10 transition-colors rounded cursor-pointer"
            style={{ top: '1.2%', left: '30.5%', width: '6.5%', height: '1.8%' }}
            aria-label="О компании"
          />
          <Link 
            to="/services" 
            className="absolute hover:bg-white/10 transition-colors rounded cursor-pointer"
            style={{ top: '1.2%', left: '38%', width: '4%', height: '1.8%' }}
            aria-label="Услуги"
          />
          <Link 
            to="/blog" 
            className="absolute hover:bg-white/10 transition-colors rounded cursor-pointer"
            style={{ top: '1.2%', left: '43%', width: '3%', height: '1.8%' }}
            aria-label="Блог"
          />
          <Link 
            to="/news" 
            className="absolute hover:bg-white/10 transition-colors rounded cursor-pointer"
            style={{ top: '1.2%', left: '47%', width: '5%', height: '1.8%' }}
            aria-label="Новости"
          />
          <Link 
            to="/faq" 
            className="absolute hover:bg-white/10 transition-colors rounded cursor-pointer"
            style={{ top: '1.2%', left: '53%', width: '2.5%', height: '1.8%' }}
            aria-label="FAQ"
          />
          <Link 
            to="/contact" 
            className="absolute hover:bg-white/10 transition-colors rounded cursor-pointer"
            style={{ top: '1.2%', left: '56.5%', width: '5.5%', height: '1.8%' }}
            aria-label="Контакты"
          />

          {/* Email in header */}
          <a 
            href="mailto:info@innovedbroker.ru" 
            className="absolute hover:bg-white/10 transition-colors rounded cursor-pointer"
            style={{ top: '1.2%', left: '80%', width: '14%', height: '1.8%' }}
            aria-label="Email"
          />

          {/* Logo */}
          <Link 
            to="/" 
            className="absolute hover:bg-white/5 transition-colors rounded cursor-pointer"
            style={{ top: '0.8%', left: '3%', width: '13%', height: '2.5%' }}
            aria-label="ИННОВЭД - Главная"
          />

          {/* "Скачать прайс-лист" button hotspot */}
          <a 
            href="/price-list.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute hover:bg-white/20 transition-colors rounded-full cursor-pointer"
            style={{ top: '17.2%', left: '36%', width: '24%', height: '2.2%' }}
            aria-label="Скачать прайс-лист"
          />

          {/* "Оформить заявку" button hotspot */}
          <Link 
            to="/contact" 
            className="absolute hover:bg-white/10 transition-colors rounded-lg cursor-pointer"
            style={{ top: '93.2%', left: '66%', width: '16%', height: '1.5%' }}
            aria-label="Оформить заявку"
          />

          {/* Footer contact hotspots */}
          <a 
            href="tel:+79331881009" 
            className="absolute hover:bg-white/10 transition-colors rounded cursor-pointer"
            style={{ top: '96%', left: '43%', width: '12%', height: '2%' }}
            aria-label="Позвонить"
          />
          <a 
            href="mailto:info@innovedbroker.ru" 
            className="absolute hover:bg-white/10 transition-colors rounded cursor-pointer"
            style={{ top: '96%', left: '62%', width: '16%', height: '2%' }}
            aria-label="Написать email"
          />

          {/* Footer logo */}
          <Link 
            to="/" 
            className="absolute hover:bg-white/5 transition-colors rounded cursor-pointer"
            style={{ top: '94.5%', left: '3%', width: '14%', height: '4%' }}
            aria-label="ИННОВЭД - Главная"
          />
        </div>
      </div>
    </>
  );
}
