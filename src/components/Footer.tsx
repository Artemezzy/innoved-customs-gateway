import { Link } from 'react-router-dom';
import logoImg from '@/assets/logo.png';

interface FooterProps {
  language: 'ru' | 'en';
}

const content = {
  ru: {
    copyright: `© ИННОВЭД ${new Date().getFullYear()}`,
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
    }
  },
  en: {
    copyright: `© INNOVED ${new Date().getFullYear()}`,
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
    }
  }
};

export function Footer({ language }: FooterProps) {
  const text = content[language];

  return (
    <footer className="relative bg-primary text-primary-foreground py-10 overflow-hidden">
      {/* Triangle pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
        <polygon points="0,0 120,0 60,100" className="fill-white/5" />
        <polygon points="80,20 200,0 140,120" className="fill-white/8" />
        <polygon points="85%,90% 95%,70% 100%,95%" className="fill-white/5" />
        <polygon points="70%,70% 85%,60% 78%,90%" className="fill-white/6" />
        <polygon points="50%,20% 60%,10% 55%,35%" className="fill-white/3" />
      </svg>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start space-y-6 md:space-y-0">
          <div className="flex flex-col space-y-3">
            <Link to="/">
              <img
                src={logoImg}
                alt={language === 'ru' ? 'ИННОВЭД' : 'INNOVED'}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm font-semibold">{text.copyright}</p>
            <div className="flex flex-wrap gap-4 text-xs">
              <Link to="/privacy" className="hover:text-primary-glow transition-colors duration-300 underline-offset-4 hover:underline">
                {text.legal.privacy}
              </Link>
              <Link to="/terms" className="hover:text-primary-glow transition-colors duration-300 underline-offset-4 hover:underline">
                {text.legal.terms}
              </Link>
            </div>
          </div>
          <nav className="flex flex-wrap gap-4 md:gap-6">
            <Link to="/about" className="text-sm hover:text-primary-glow transition-colors duration-300">{text.links.about}</Link>
            <Link to="/services" className="text-sm hover:text-primary-glow transition-colors duration-300">{text.links.services}</Link>
            <Link to="/how-we-work" className="text-sm hover:text-primary-glow transition-colors duration-300">{text.links.howWeWork}</Link>
            <Link to="/blog" className="text-sm hover:text-primary-glow transition-colors duration-300">{text.links.blog}</Link>
            <Link to="/faq" className="text-sm hover:text-primary-glow transition-colors duration-300">{text.links.faq}</Link>
            <Link to="/contact" className="text-sm hover:text-primary-glow transition-colors duration-300">{text.links.contact}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
