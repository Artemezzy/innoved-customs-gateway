interface HeaderProps {
  language: 'ru' | 'en';
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
    logo: 'INNOVVED',
    links: {
      about: 'About',
      services: 'Services',
      pricing: 'Pricing',
      contact: 'Contacts'
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
          {/* Logo */}
          <div className="text-xl font-bold text-primary-foreground tracking-wider">
            {text.logo}
          </div>
          
          {/* Navigation */}
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

          {/* Mobile menu button - placeholder */}
          <button className="md:hidden text-primary-foreground">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}