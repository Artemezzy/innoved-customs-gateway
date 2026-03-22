import { Link, useNavigate } from 'react-router-dom';
import { Send, Mail, Phone, Menu, X, Download } from 'lucide-react';
import maxIcon from '@/assets/max-icon-white.webp';
import { analytics } from '@/utils/analytics';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import logoImg from '@/assets/logo.png';
import { LanguageToggle } from './LanguageToggle';

interface HeaderProps {
  language: 'ru' | 'en';
  onLanguageChange: (lang: 'ru' | 'en') => void;
}

const content = {
  ru: {
    logo: 'ИННОВЭД',
    cta: 'Оставить заявку',
    links: {
      home: 'Главная',
      about: 'О компании',
      services: 'Услуги',
      howWeWork: 'Как мы работаем',
      branches: 'География',
      blog: 'Блог',
      news: 'Новости',
      faq: 'FAQ',
      contact: 'Контакты'
    }
  },
  en: {
    logo: 'INNOVED',
    cta: 'Submit Request',
    links: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      howWeWork: 'How We Work',
      branches: 'Geography',
      blog: 'Blog',
      news: 'News',
      faq: 'FAQ',
      contact: 'Contact'
    }
  }
};

export function Header({ language }: HeaderProps) {
  const text = content[language];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: text.links.home },
    { to: '/about', label: text.links.about },
    { to: '/services', label: text.links.services },
    { to: '/how-we-work', label: text.links.howWeWork },
    { to: '/tamozhennyj-broker', label: text.links.branches },
    { to: '/blog', label: text.links.blog },
    { to: '/faq', label: text.links.faq },
    { to: '/contact', label: text.links.contact },
  ];

  const handleCtaClick = () => {
    analytics.contactClick('contact-form');
    navigate('/contact');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="mx-auto px-2 lg:px-3 max-w-[1920px]">
        <div className="flex items-center h-16 gap-3">
          {/* Logo - Left */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src={logoImg}
              alt={text.logo}
              className="h-9 w-auto brightness-0 invert"
            />
          </Link>

          {/* Navigation - Center */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-4 flex-1 justify-center min-w-0">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className="text-primary-foreground hover:text-primary-glow transition-colors duration-300 font-medium text-xs xl:text-sm whitespace-nowrap">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact + CTA - Right */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            <a href="https://t.me/innovedbroker" target="_blank" rel="noopener noreferrer"
              className="text-primary-foreground hover:text-primary-glow transition-colors duration-300 p-1.5 rounded-full hover:bg-white/10"
              onClick={() => analytics.contactClick('telegram')}>
              <Send className="w-4 h-4" />
            </a>
            <a href="https://max.ru/id3849109300_bot" target="_blank" rel="noopener noreferrer"
              className="text-primary-foreground hover:text-primary-glow transition-colors duration-300 p-1.5 rounded-full hover:bg-white/10"
              onClick={() => analytics.contactClick('max-bot' as any)}>
              <img src={maxIcon} alt="MAX" className="w-5 h-5 opacity-90" />
            </a>
            <a href="mailto:info@innovedbroker.ru"
              className="text-primary-foreground hover:text-primary-glow transition-colors duration-300 p-1.5 rounded-full hover:bg-white/10"
              onClick={() => analytics.contactClick('email')}>
              <Mail className="w-4 h-4" />
            </a>
            <a href="tel:89331881009"
              className="flex items-center text-primary-foreground hover:text-primary-glow transition-colors duration-300 text-xs xl:text-sm font-medium whitespace-nowrap"
              onClick={() => analytics.contactClick('phone')}>
              <Phone className="w-4 h-4 mr-1.5 shrink-0" />
              8 933 188 10 09
            </a>
            <a
              href="/files/innoved_commercial.pdf"
              download
              className="inline-flex items-center gap-1 text-primary-foreground hover:text-primary-glow transition-colors duration-300 text-xs xl:text-sm font-medium whitespace-nowrap"
            >
              <Download className="w-4 h-4 shrink-0" />
              {language === 'ru' ? 'Цены' : 'Prices'}
            </a>
            <Button
              size="sm"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-xs xl:text-sm whitespace-nowrap"
              onClick={handleCtaClick}
            >
              {text.cta}
            </Button>
          </div>

          {/* Mobile */}
          <div className="flex items-center space-x-2 lg:hidden">
            <a href="https://t.me/innovedbroker" target="_blank" rel="noopener noreferrer"
              className="text-primary-foreground p-2" onClick={() => analytics.contactClick('telegram')}>
              <Send className="w-4 h-4" />
            </a>
            <a href="https://max.ru/id3849109300_bot" target="_blank" rel="noopener noreferrer"
              className="text-primary-foreground p-2" onClick={() => analytics.contactClick('max-bot' as any)}>
              <img src={maxIcon} alt="MAX" className="w-5 h-5 opacity-90" />
            </a>
            <a href="tel:89331881009" className="text-primary-foreground p-2" onClick={() => analytics.contactClick('phone')}>
              <Phone className="w-4 h-4" />
            </a>
            <button className="text-primary-foreground p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className="block text-primary-foreground hover:text-primary-glow py-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Button
              size="sm"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold w-full mt-3"
              onClick={() => { setMobileMenuOpen(false); handleCtaClick(); }}
            >
              {text.cta}
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
