import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-bg.jpg';

interface HeroProps {
  language: 'ru' | 'en';
}

const content = {
  ru: {
    title: 'ИННОВЭД',
    button: 'Упростить логистику'
  },
  en: {
    title: 'INNOVVED',
    button: 'Simplify Logistics'
  }
};

export function Hero({ language }: HeroProps) {
  const text = content[language];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Content */}
      <div className="relative z-10 text-center animate-fade-in">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-8 tracking-wider animate-glow">
          {text.title}
        </h1>
        <Button 
          size="lg"
          className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-4 text-lg font-semibold shadow-hover transition-all duration-300 hover:scale-105 animate-float"
          onClick={() => window.open('https://t.me/innovedbroker', '_blank')}
        >
          {text.button}
        </Button>
      </div>
    </section>
  );
}