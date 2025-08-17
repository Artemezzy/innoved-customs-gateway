import { Button } from '@/components/ui/button';
import heroVideo from '@/assets/hero-bg-v2.mp4';

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
          className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-4 text-lg font-semibold shadow-hover transition-all duration-300 hover:scale-105 animate-float"
          onClick={() => window.open('https://t.me/innovedbroker', '_blank')}
        >
          {text.button}
        </Button>
      </div>
    </section>
  );
}