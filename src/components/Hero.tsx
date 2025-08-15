import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-bg.jpg';
import portVideo from '@/assets/port-video-placeholder.jpg';

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
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster={portVideo}
        >
          <source src="https://videos.pexels.com/video-files/8473765/8473765-hd_1920_1080_25fps.mp4" type="video/mp4" />
          {/* Fallback image if video fails to load */}
          <img 
            src={heroImage} 
            alt="Port logistics background" 
            className="w-full h-full object-cover"
          />
        </video>
      </div>
      
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