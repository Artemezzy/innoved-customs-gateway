import { Button } from '@/components/ui/button';
import heroVideo from '@/assets/hero-bg-v2.mp4';
import { analytics } from '@/utils/analytics';

interface HeroProps {
  language: 'ru' | 'en' | 'zh';
}

const content = {
  ru: {
    title: 'ИННОВЭД',
    button: 'Упростить логистику'
  },
  en: {
    title: 'INNOVED',
    button: 'Simplify Logistics'
  },
  zh: {
    title: 'INNOVED',
    button: '简化物流'
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video 
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={heroVideo} type="video/mp4" />
      </video>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Content */}
      <div className="relative z-10 text-center animate-fade-in">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-8 tracking-wider animate-glow">
          {text.title}
        </h1>
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