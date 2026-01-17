import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const content = {
  ru: {
    brand: 'ИННОВЭД',
    tagline: 'упрощая логистику',
    nav: [
      { label: 'Главная', path: '/' },
      { label: 'О компании', path: '/about' },
      { label: 'Услуги', path: '/services' },
      { label: 'Блог', path: '/blog' },
      { label: 'Новости', path: '/news' },
      { label: 'FAQ', path: '/faq' },
      { label: 'Контакты', path: '/contact' },
    ],
    email: 'info@innovedbroker.ru',
  },
  en: {
    brand: 'INNOVED',
    tagline: 'simplifying logistics',
    nav: [
      { label: 'Home', path: '/' },
      { label: 'About', path: '/about' },
      { label: 'Services', path: '/services' },
      { label: 'Blog', path: '/blog' },
      { label: 'News', path: '/news' },
      { label: 'FAQ', path: '/faq' },
      { label: 'Contact', path: '/contact' },
    ],
    email: 'info@innovedbroker.ru',
  },
};

export function HomeHeader() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-4 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex items-center gap-2">
            {/* Logo icon - green circle with arrow */}
            <div className="w-10 h-10 rounded-full bg-[hsl(80,45%,45%)] flex items-center justify-center">
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[hsl(80,45%,45%)] tracking-wide">
                {t.brand}
              </span>
              <span className="text-xs text-white/70 -mt-1">
                {t.tagline}
              </span>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {t.nav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-white/90 hover:text-white text-sm font-medium transition-colors duration-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Email */}
        <a
          href={`mailto:${t.email}`}
          className="hidden md:flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium transition-colors duration-200"
        >
          <Mail className="w-4 h-4" />
          <span>{t.email}</span>
        </a>
      </div>
    </header>
  );
}
