import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-bg-new.jpg';

export default function Home() {
  const { language } = useLanguage();

  return (
    <>
      <SEOHead language={language} page="home" />
      <div className="relative w-full">
        {/* Full-page image */}
        <img 
          src={heroImage} 
          alt="ИННОВЭД - Таможенное оформление" 
          className="w-full h-auto"
        />
        
        {/* Clickable hotspots overlay */}
        <div className="absolute inset-0">
          {/* Header navigation hotspots */}
          <Link 
            to="/" 
            className="absolute hover:bg-white/10 transition-colors rounded"
            style={{ top: '1.5%', left: '17%', width: '5%', height: '2.5%' }}
            aria-label="Главная"
          />
          <Link 
            to="/about" 
            className="absolute hover:bg-white/10 transition-colors rounded"
            style={{ top: '1.5%', left: '23%', width: '7%', height: '2.5%' }}
            aria-label="О компании"
          />
          <Link 
            to="/services" 
            className="absolute hover:bg-white/10 transition-colors rounded"
            style={{ top: '1.5%', left: '31%', width: '5%', height: '2.5%' }}
            aria-label="Услуги"
          />
          <Link 
            to="/blog" 
            className="absolute hover:bg-white/10 transition-colors rounded"
            style={{ top: '1.5%', left: '37%', width: '4%', height: '2.5%' }}
            aria-label="Блог"
          />
          <Link 
            to="/news" 
            className="absolute hover:bg-white/10 transition-colors rounded"
            style={{ top: '1.5%', left: '42%', width: '6%', height: '2.5%' }}
            aria-label="Новости"
          />
          <Link 
            to="/faq" 
            className="absolute hover:bg-white/10 transition-colors rounded"
            style={{ top: '1.5%', left: '49%', width: '3%', height: '2.5%' }}
            aria-label="FAQ"
          />
          <Link 
            to="/contact" 
            className="absolute hover:bg-white/10 transition-colors rounded"
            style={{ top: '1.5%', left: '53%', width: '6%', height: '2.5%' }}
            aria-label="Контакты"
          />

          {/* "Оформить заявку" button hotspot */}
          <Link 
            to="/contact" 
            className="absolute hover:bg-white/10 transition-colors rounded-lg"
            style={{ top: '22%', left: '3.5%', width: '12%', height: '3%' }}
            aria-label="Оформить заявку"
          />

          {/* "О компании" button hotspot in stats section */}
          <Link 
            to="/about" 
            className="absolute hover:bg-white/10 transition-colors rounded-lg"
            style={{ top: '32.5%', left: '3.5%', width: '9%', height: '2.5%' }}
            aria-label="О компании"
          />

          {/* Services section hotspots - top row */}
          <Link 
            to="/services" 
            className="absolute hover:bg-white/20 transition-colors rounded-lg"
            style={{ top: '68%', left: '3.5%', width: '22%', height: '8%' }}
            aria-label="Таможенное оформление"
          />
          <Link 
            to="/services" 
            className="absolute hover:bg-white/20 transition-colors rounded-lg"
            style={{ top: '68%', left: '27%', width: '22%', height: '8%' }}
            aria-label="Сертификация"
          />
          <Link 
            to="/services" 
            className="absolute hover:bg-white/20 transition-colors rounded-lg"
            style={{ top: '68%', left: '50.5%', width: '22%', height: '8%' }}
            aria-label="Контрактная логистика"
          />
          <Link 
            to="/services" 
            className="absolute hover:bg-white/20 transition-colors rounded-lg"
            style={{ top: '68%', left: '74%', width: '22%', height: '8%' }}
            aria-label="Валютный контроль"
          />

          {/* Services section hotspots - bottom row */}
          <Link 
            to="/services" 
            className="absolute hover:bg-white/20 transition-colors rounded-lg"
            style={{ top: '78%', left: '3.5%', width: '22%', height: '8%' }}
            aria-label="Классификация товаров"
          />
          <Link 
            to="/services" 
            className="absolute hover:bg-white/20 transition-colors rounded-lg"
            style={{ top: '78%', left: '27%', width: '22%', height: '8%' }}
            aria-label="Консультирование"
          />
          <Link 
            to="/services" 
            className="absolute hover:bg-white/20 transition-colors rounded-lg"
            style={{ top: '78%', left: '50.5%', width: '22%', height: '8%' }}
            aria-label="Страхование грузов"
          />
          <Link 
            to="/services" 
            className="absolute hover:bg-white/20 transition-colors rounded-lg"
            style={{ top: '78%', left: '74%', width: '22%', height: '8%' }}
            aria-label="Логистика под ключ"
          />

          {/* Footer contact hotspots */}
          <a 
            href="tel:+79331881009" 
            className="absolute hover:bg-white/10 transition-colors rounded"
            style={{ top: '94%', left: '75%', width: '12%', height: '2%' }}
            aria-label="Позвонить"
          />
          <a 
            href="mailto:info@innovedbroker.ru" 
            className="absolute hover:bg-white/10 transition-colors rounded"
            style={{ top: '96.5%', left: '75%', width: '15%', height: '2%' }}
            aria-label="Написать email"
          />
        </div>
      </div>
    </>
  );
}
