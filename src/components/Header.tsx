import { Link } from 'react-router-dom';
import { Send, Mail, Phone, Menu, X } from 'lucide-react';
import { analytics } from '@/utils/analytics';
import { useState } from 'react';

interface HeaderProps {
  language: 'ru' | 'en';
}

const content = {
  ru: {
    logo: 'ИННОВЭД',
    links: {
      home: 'Главная',
      about: 'О компании',
      services: 'Услуги',
      howWeWork: 'Как мы работаем',
      blog: 'Блог',
      news: 'Новости',
      faq: 'FAQ',
      contact: 'Контакты'
    }
  },
  en: {
    logo: 'INNOVED',
    links: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      howWeWork: 'How We Work',
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

  const navLinks = [
    { to: '/', label: text.links.home },
    { to: '/about', label: text.links.about },
    { to: '/services', label: text.links.services },
    { to: '/how-we-work', label: text.links.howWeWork },
    { to: '/blog', label: text.links.blog },
    // { to: '/news', label: text.links.news }, // temporarily hidden
    { to: '/faq', label: text.links.faq },
    { to: '/contact', label: text.links.contact },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Contact Info - Left */}
          <div className="hidden lg:flex items-center space-x-4">
            <a href="https://t.me/innovedbroker" target="_blank" rel="noopener noreferrer"
              className="text-primary-foreground hover:text-primary-glow transition-colors duration-300 p-2 rounded-full hover:bg-white/10"
              onClick={() => analytics.contactClick('telegram')}>
              <Send className="w-4 h-4" />
            </a>
            <a href="mailto:info@innovedbroker.ru"
              className="text-primary-foreground hover:text-primary-glow transition-colors duration-300 p-2 rounded-full hover:bg-white/10"
              onClick={() => analytics.contactClick('email')}>
              <Mail className="w-4 h-4" />
            </a>
            <a href="tel:89331881009"
              className="flex items-center text-primary-foreground hover:text-primary-glow transition-colors duration-300 text-sm font-medium"
              onClick={() => analytics.contactClick('phone')}>
              <Phone className="w-4 h-4 mr-2" />
              8 933 188 10 09
            </a>
          </div>

          {/* Navigation - Center */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className="text-primary-foreground hover:text-primary-glow transition-colors duration-300 font-medium text-sm">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile */}
          <div className="flex items-center space-x-2 md:hidden">
            <a href="https://t.me/innovedbroker" target="_blank" rel="noopener noreferrer"
              className="text-primary-foreground p-2" onClick={() => analytics.contactClick('telegram')}>
              <Send className="w-4 h-4" />
            </a>
            <a href="tel:89331881009" className="text-primary-foreground p-2" onClick={() => analytics.contactClick('phone')}>
              <Phone className="w-4 h-4" />
            </a>
            <button className="text-primary-foreground p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <div className="hidden lg:block w-48"></div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className="block text-primary-foreground hover:text-primary-glow py-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
