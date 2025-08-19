import { Send, Mail, Phone } from 'lucide-react';

interface HeaderProps {
  language: 'ru' | 'en' | 'zh';
}

const content = {
  ru: {
    logo: 'ИННОВЭД',
    links: {
      about: 'О компании',
      services: 'Услуги',
      pricing: 'Цены',
      contact: 'Контакты'
    }
  },
  en: {
    logo: 'INNOVED',
    links: {
      about: 'About',
      services: 'Services',
      pricing: 'Pricing',
      contact: 'Contacts'
    }
  },
  zh: {
    logo: 'INNOVED',
    links: {
      about: '关于我们',
      services: '服务',
      pricing: '价格',
      contact: '联系我们'
    }
  }
};

export function Header({ language }: HeaderProps) {
  const text = content[language];

  const handleLinkClick = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Contact Info - Left */}
          <div className="hidden lg:flex items-center space-x-4">
            <a 
              href="https://t.me/innovedbroker" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-foreground hover:text-primary-glow transition-colors duration-300 p-2 rounded-full hover:bg-white/10"
              title="Telegram"
            >
              <Send className="w-4 h-4" />
            </a>
            <a 
              href="mailto:info@innovedbroker.ru"
              className="text-primary-foreground hover:text-primary-glow transition-colors duration-300 p-2 rounded-full hover:bg-white/10"
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a 
              href="tel:89331881009"
              className="flex items-center text-primary-foreground hover:text-primary-glow transition-colors duration-300 text-sm font-medium"
              title="Телефон"
            >
              <Phone className="w-4 h-4 mr-2" />
              8 933 188 10 09
            </a>
          </div>

          {/* Navigation - Center */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleLinkClick('about')}
              className="text-primary-foreground hover:text-primary-glow transition-colors duration-300 font-medium"
            >
              {text.links.about}
            </button>
            <button
              onClick={() => handleLinkClick('services')}
              className="text-primary-foreground hover:text-primary-glow transition-colors duration-300 font-medium"
            >
              {text.links.services}
            </button>
            <button
              onClick={() => handleLinkClick('pricing')}
              className="text-primary-foreground hover:text-primary-glow transition-colors duration-300 font-medium"
            >
              {text.links.pricing}
            </button>
            <button
              onClick={() => handleLinkClick('contact')}
              className="text-primary-foreground hover:text-primary-glow transition-colors duration-300 font-medium"
            >
              {text.links.contact}
            </button>
          </nav>

          {/* Mobile contacts and menu */}
          <div className="flex items-center space-x-2">
            {/* Mobile contact icons */}
            <div className="flex items-center space-x-2 md:hidden">
              <a 
                href="https://t.me/innovedbroker" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-foreground hover:text-primary-glow transition-colors duration-300 p-2 rounded-full hover:bg-white/10"
              >
                <Send className="w-4 h-4" />
              </a>
              <a 
                href="mailto:info@innovedbroker.ru"
                className="text-primary-foreground hover:text-primary-glow transition-colors duration-300 p-2 rounded-full hover:bg-white/10"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a 
                href="tel:89331881009"
                className="text-primary-foreground hover:text-primary-glow transition-colors duration-300 p-2 rounded-full hover:bg-white/10"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden text-primary-foreground">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Right spacer for balance on desktop */}
          <div className="hidden lg:block w-48"></div>
        </div>
      </div>
    </header>
  );
}