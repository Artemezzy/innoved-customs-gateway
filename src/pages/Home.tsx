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
            className="absolute hover:bg-white/10 transition-colors rounded cursor-pointer"
            style={{ top: '1.2%', left: '26%', width: '4.5%', height: '1.8%' }}
            aria-label="Главная"
          />
          <Link 
            to="/about" 
            className="absolute hover:bg-white/10 transition-colors rounded cursor-pointer"
            style={{ top: '1.2%', left: '32.5%', width: '6%', height: '1.8%' }}
            aria-label="О компании"
          />
          <Link 
            to="/services" 
            className="absolute hover:bg-white/10 transition-colors rounded cursor-pointer"
            style={{ top: '1.2%', left: '41%', width: '3.8%', height: '1.8%' }}
            aria-label="Услуги"
          />
          <Link 
            to="/blog" 
            className="absolute hover:bg-white/10 transition-colors rounded cursor-pointer"
            style={{ top: '1.2%', left: '47%', width: '2.8%', height: '1.8%' }}
            aria-label="Блог"
          />
          <Link 
            to="/news" 
            className="absolute hover:bg-white/10 transition-colors rounded cursor-pointer"
            style={{ top: '1.2%', left: '52%', width: '4.5%', height: '1.8%' }}
            aria-label="Новости"
          />
          <Link 
            to="/faq" 
            className="absolute hover:bg-white/10 transition-colors rounded cursor-pointer"
            style={{ top: '1.2%', left: '58.5%', width: '2.5%', height: '1.8%' }}
            aria-label="FAQ"
          />
          <Link 
            to="/contact" 
            className="absolute hover:bg-white/10 transition-colors rounded cursor-pointer"
            style={{ top: '1.2%', left: '63%', width: '5%', height: '1.8%' }}
            aria-label="Контакты"
          />

          {/* Email in header */}
          <a 
            href="mailto:info@innovedbroker.ru" 
            className="absolute hover:bg-white/10 transition-colors rounded cursor-pointer"
            style={{ top: '1.2%', left: '80%', width: '15%', height: '1.8%' }}
            aria-label="Email"
          />

          {/* Logo */}
          <Link 
            to="/" 
            className="absolute hover:bg-white/5 transition-colors rounded cursor-pointer"
            style={{ top: '0.8%', left: '3.5%', width: '13%', height: '2.5%' }}
            aria-label="ИННОВЭД - Главная"
          />

          {/* "Оформить заявку" button hotspot */}
          <Link 
            to="/contact" 
            className="absolute hover:bg-white/10 transition-colors rounded-lg cursor-pointer"
            style={{ top: '20%', left: '4.5%', width: '15%', height: '3.2%' }}
            aria-label="Оформить заявку"
          />

          {/* "О компании" button hotspot in stats section */}
          <Link 
            to="/about" 
            className="absolute hover:bg-white/10 transition-colors rounded-lg cursor-pointer"
            style={{ top: '39%', left: '4%', width: '14.5%', height: '3%' }}
            aria-label="О компании"
          />

          {/* Services section hotspots - top row */}
          <Link 
            to="/services" 
            className="absolute hover:bg-black/10 transition-colors rounded-lg cursor-pointer"
            style={{ top: '75.5%', left: '4%', width: '21%', height: '6.5%' }}
            aria-label="Оформление импорта"
          />
          <Link 
            to="/services" 
            className="absolute hover:bg-black/10 transition-colors rounded-lg cursor-pointer"
            style={{ top: '75.5%', left: '27%', width: '21%', height: '6.5%' }}
            aria-label="Оформление экспорта"
          />
          <Link 
            to="/services" 
            className="absolute hover:bg-black/10 transition-colors rounded-lg cursor-pointer"
            style={{ top: '75.5%', left: '50%', width: '21%', height: '6.5%' }}
            aria-label="Определение кода ТН ВЭД"
          />
          <Link 
            to="/services" 
            className="absolute hover:bg-black/10 transition-colors rounded-lg cursor-pointer"
            style={{ top: '75.5%', left: '73%', width: '21%', height: '6.5%' }}
            aria-label="Регистрация импортёра в ЛК ФТС"
          />

          {/* Services section hotspots - bottom row */}
          <Link 
            to="/services" 
            className="absolute hover:bg-black/10 transition-colors rounded-lg cursor-pointer"
            style={{ top: '83.5%', left: '4%', width: '21%', height: '6.5%' }}
            aria-label="Организация получения сертификатов"
          />
          <Link 
            to="/services" 
            className="absolute hover:bg-black/10 transition-colors rounded-lg cursor-pointer"
            style={{ top: '83.5%', left: '27%', width: '21%', height: '6.5%' }}
            aria-label="Подготовка писем в таможенные органы"
          />
          <Link 
            to="/services" 
            className="absolute hover:bg-black/10 transition-colors rounded-lg cursor-pointer"
            style={{ top: '83.5%', left: '50%', width: '21%', height: '6.5%' }}
            aria-label="Организация досмотра товаров"
          />
          <Link 
            to="/services" 
            className="absolute hover:bg-black/10 transition-colors rounded-lg cursor-pointer"
            style={{ top: '83.5%', left: '73%', width: '21%', height: '6.5%' }}
            aria-label="Перевод документов"
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
