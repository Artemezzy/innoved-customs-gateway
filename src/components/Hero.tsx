import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg-new.jpg';
import { analytics } from '@/utils/analytics';

interface HeroProps {
  language: 'ru' | 'en';
}

const content = {
  ru: {
    title: 'ТАМОЖНЯ БЕЗ ГРАНИЦ:',
    subtitle: 'ВАШ ГРУЗ - НАША ЗАБОТА',
    button: 'Оформить заявку'
  },
  en: {
    title: 'CUSTOMS WITHOUT BORDERS:',
    subtitle: 'YOUR CARGO - OUR CARE',
    button: 'Submit Request'
  }
};

export function Hero({ language }: HeroProps) {
  const text = content[language];

  const handleButtonClick = () => {
    analytics.contactClick('contact-form');
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-[60vh] md:h-[70vh] flex items-end overflow-hidden">
      {/* Background Image */}
      <img 
        src={heroBg} 
        alt="Container terminal"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(222,47%,11%)]/80 via-[hsl(222,47%,11%)]/40 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 w-full px-4 md:px-8 lg:px-16 pb-12 md:pb-16">
        <div className="max-w-4xl animate-fade-in">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 tracking-wide">
            {text.title}
          </h1>
          <p className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-6 tracking-wide">
            {text.subtitle}
          </p>
          <Button 
            size="lg"
            className="bg-olive hover:bg-olive-hover text-white px-8 py-5 text-base font-semibold rounded-md"
            onClick={handleButtonClick}
          >
            {text.button}
          </Button>
        </div>
      </div>
    </section>
  );
}
