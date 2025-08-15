import { Button } from '@/components/ui/button';
import portVideo from '@/assets/port-activity.jpg';

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
        loop
        muted
        playsInline
        poster={portVideo}
      >
        <source src="https://player.vimeo.com/external/371433846.sd.mp4?s=236fb8a2b0e3e01b66b3a4a99cb5e32ab7d94860&profile_id=164" type="video/mp4" />
        {/* Fallback to image if video fails */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${portVideo})` }}
        />
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