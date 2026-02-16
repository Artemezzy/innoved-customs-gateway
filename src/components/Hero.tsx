import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';
import { analytics } from '@/utils/analytics';
import { TypewriterText } from './TypewriterText';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  language: 'ru' | 'en';
}

const content = {
  ru: {
    title: 'ИННОВЭД',
    subtitles: ['Таможенное оформление без скрытых платежей', 'В короткий срок с гарантией результата'],
    button: 'Оформить заявку'
  },
  en: {
    title: 'INNOVED',
    subtitles: ['Customs Clearance Without Hidden Fees', 'Quick Turnaround With Guaranteed Results'],
    button: 'Submit Request'
  }
};

export function Hero({ language }: HeroProps) {
  const text = content[language];
  const navigate = useNavigate();

  const handleButtonClick = () => {
    analytics.contactClick('contact-form');
    navigate('/contact');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <img 
        src={heroBg}
        alt="Контейнерный порт — таможенное оформление грузов"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Content */}
      <div className="relative z-10 text-center animate-fade-in">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-4 tracking-wider animate-glow">
          {text.title}
        </h1>
        <div className="mb-8 h-12 flex items-center justify-center">
          <TypewriterText 
            texts={text.subtitles}
            delay={2000}
            speed={80}
            pauseBetween={3000}
            className="text-xl md:text-2xl lg:text-3xl text-primary-foreground/70 font-montserrat font-medium tracking-wide"
          />
        </div>
        <Button 
          size="lg"
          className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-4 text-lg font-semibold shadow-hover"
          onClick={handleButtonClick}
        >
          {text.button}
        </Button>
      </div>
    </section>
  );
}