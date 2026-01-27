import { Button } from '@/components/ui/button';
import heroVideo from '@/assets/hero-bg-v2.mp4';
import { analytics } from '@/utils/analytics';
import { TypewriterText } from './TypewriterText';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  language: 'ru' | 'en';
}

const content = {
  ru: {
    title: 'ИННОВЭД',
    subtitles: ['Таможенное оформление под ключ', 'Таможенное оформление с нами'],
    button: 'Упростить логистику',
    stats: [
      { number: '200+', label: 'городов по всей России' },
      { number: '150+', label: 'завершенных сделок в месяц' },
      { number: '10 ЛЕТ', label: 'на рынке ВЭД' }
    ]
  },
  en: {
    title: 'INNOVED',
    subtitles: ['Comprehensive Customs Clearance', 'Customs Clearance With Us'],
    button: 'Simplify Logistics',
    stats: [
      { number: '200+', label: 'cities across Russia' },
      { number: '150+', label: 'deals completed monthly' },
      { number: '10 YEARS', label: 'in foreign trade' }
    ]
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
      
      {/* Stats Bar */}
      <div className="absolute top-24 md:top-28 left-0 right-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 lg:gap-24">
            {text.stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-1 tracking-wide">
                  {stat.number}
                </div>
                <div className="text-xs md:text-sm text-primary-foreground/60 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
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