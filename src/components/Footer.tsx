interface FooterProps {
  language: 'ru' | 'en' | 'zh';
  onSectionClick: (section: string) => void;
}

const content = {
  ru: {
    copyright: '© ИННОВЭД',
    links: {
      about: 'О компании',
      services: 'Услуги',
      pricing: 'Цены',
      contact: 'Контакты'
    }
  },
  en: {
    copyright: '© INNOVVED',
    links: {
      about: 'About',
      services: 'Services',
      pricing: 'Pricing',
      contact: 'Contacts'
    }
  },
  zh: {
    copyright: '© INNOVVED',
    links: {
      about: '关于我们',
      services: '服务',
      pricing: '价格',
      contact: '联系我们'
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
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm font-semibold">
              {text.copyright}
            </p>
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