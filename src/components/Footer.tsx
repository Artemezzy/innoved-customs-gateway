import { Link } from 'react-router-dom';

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
    <footer className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start space-y-6 md:space-y-0">
          <div className="flex flex-col space-y-2">
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
            <Link to="/news" className="text-sm hover:text-primary-glow transition-colors duration-300">{text.links.news}</Link>
            <Link to="/faq" className="text-sm hover:text-primary-glow transition-colors duration-300">{text.links.faq}</Link>
            <Link to="/contact" className="text-sm hover:text-primary-glow transition-colors duration-300">{text.links.contact}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
