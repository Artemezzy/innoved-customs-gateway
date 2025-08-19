import { Link } from 'react-router-dom';

interface FooterProps {
  language: 'ru' | 'en' | 'zh';
  onSectionClick: (section: string) => void;
}

const content = {
  ru: {
    copyright: `© ИННОВЭД ${new Date().getFullYear()}`,
    links: {
      about: 'О компании',
      services: 'Услуги',
      pricing: 'Цены',
      contact: 'Контакты'
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
      pricing: 'Pricing',
      contact: 'Contacts'
    },
    legal: {
      privacy: 'Privacy Policy',
      terms: 'Terms of Service'
    }
  },
  zh: {
    copyright: `© INNOVED ${new Date().getFullYear()}`,
    links: {
      about: '关于我们',
      services: '服务',
      pricing: '价格',
      contact: '联系我们'
    },
    legal: {
      privacy: '隐私政策',
      terms: '服务条款'
    }
  }
};

export function Footer({ language, onSectionClick }: FooterProps) {
  const text = content[language];

  const handleLinkClick = (section: string) => {
    onSectionClick(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start space-y-6 md:space-y-0">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-semibold">
              {text.copyright}
            </p>
            <div className="flex flex-wrap gap-4 text-xs">
              <Link
                to="/privacy"
                className="hover:text-primary-glow transition-colors duration-300 underline-offset-4 hover:underline"
              >
                {text.legal.privacy}
              </Link>
              <Link
                to="/terms"
                className="hover:text-primary-glow transition-colors duration-300 underline-offset-4 hover:underline"
              >
                {text.legal.terms}
              </Link>
            </div>
          </div>
          <nav className="flex flex-wrap gap-6">
            <button
              onClick={() => handleLinkClick('about')}
              className="text-sm hover:text-primary-glow transition-colors duration-300 underline-offset-4 hover:underline"
            >
              {text.links.about}
            </button>
            <button
              onClick={() => handleLinkClick('services')}
              className="text-sm hover:text-primary-glow transition-colors duration-300 underline-offset-4 hover:underline"
            >
              {text.links.services}
            </button>
            <button
              onClick={() => handleLinkClick('pricing')}
              className="text-sm hover:text-primary-glow transition-colors duration-300 underline-offset-4 hover:underline"
            >
              {text.links.pricing}
            </button>
            <button
              onClick={() => handleLinkClick('contact')}
              className="text-sm hover:text-primary-glow transition-colors duration-300 underline-offset-4 hover:underline"
            >
              {text.links.contact}
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}