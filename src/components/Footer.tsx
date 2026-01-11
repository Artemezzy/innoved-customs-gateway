import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';

interface FooterProps {
  language: 'ru' | 'en';
}

const content = {
  ru: {
    brand: 'ИННОВЭД',
    tagline: 'упрощая логистику',
    phone: '+7 933 188 10 09',
    email: 'info@innovedbroker.ru',
    links: {
      about: 'О компании',
      services: 'Услуги',
      howWeWork: 'Как мы работаем',
      contact: 'Контакты',
      blog: 'Блог',
      news: 'Новости',
      faq: 'FAQ'
    },
    legal: {
      privacy: 'Политика конфиденциальности',
      terms: 'Пользовательское соглашение'
    },
    copyright: `© ИННОВЭД ${new Date().getFullYear()}`
  },
  en: {
    brand: 'INNOVED',
    tagline: 'simplifying logistics',
    phone: '+7 933 188 10 09',
    email: 'info@innovedbroker.ru',
    links: {
      about: 'About',
      services: 'Services',
      howWeWork: 'How We Work',
      contact: 'Contact',
      blog: 'Blog',
      news: 'News',
      faq: 'FAQ'
    },
    legal: {
      privacy: 'Privacy Policy',
      terms: 'Terms of Service'
    },
    copyright: `© INNOVED ${new Date().getFullYear()}`
  }
};

export function Footer({ language }: FooterProps) {
  const text = content[language];

  return (
    <footer className="bg-navy text-white py-10 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
          {/* Left side - Brand */}
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-bold tracking-wide">{text.brand}</span>
            <span className="text-sm text-white/60">{text.tagline}</span>
          </div>

          {/* Right side - Contacts */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <a 
              href={`tel:${text.phone.replace(/\s/g, '')}`} 
              className="flex items-center gap-2 text-white hover:text-olive transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{text.phone}</span>
            </a>
            <a 
              href={`mailto:${text.email}`} 
              className="flex items-center gap-2 text-white hover:text-olive transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>{text.email}</span>
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap gap-4 md:gap-6 mb-8 pb-8 border-b border-white/10">
          <Link to="/about" className="text-sm text-white/80 hover:text-olive transition-colors">{text.links.about}</Link>
          <Link to="/services" className="text-sm text-white/80 hover:text-olive transition-colors">{text.links.services}</Link>
          <Link to="/how-we-work" className="text-sm text-white/80 hover:text-olive transition-colors">{text.links.howWeWork}</Link>
          <Link to="/blog" className="text-sm text-white/80 hover:text-olive transition-colors">{text.links.blog}</Link>
          <Link to="/news" className="text-sm text-white/80 hover:text-olive transition-colors">{text.links.news}</Link>
          <Link to="/faq" className="text-sm text-white/80 hover:text-olive transition-colors">{text.links.faq}</Link>
          <Link to="/contact" className="text-sm text-white/80 hover:text-olive transition-colors">{text.links.contact}</Link>
        </nav>

        {/* Bottom - Copyright and Legal */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-xs text-white/50">{text.copyright}</p>
          <div className="flex gap-4 text-xs">
            <Link to="/privacy" className="text-white/50 hover:text-olive transition-colors">
              {text.legal.privacy}
            </Link>
            <Link to="/terms" className="text-white/50 hover:text-olive transition-colors">
              {text.legal.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
