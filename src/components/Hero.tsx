import { Button } from '@/components/ui/button';
import heroVideo from '@/assets/hero-bg-v2.mp4';
import { analytics } from '@/utils/analytics';
import { TypewriterText } from './TypewriterText';

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
      
      {/* Stats Bar */}
      <div className="absolute top-16 md:top-20 left-0 right-0 z-10">
        <div className="container mx-auto px-4">
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl py-6 px-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 lg:gap-20">
              {text.stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center animate-fade-in group relative" 
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Glow effect behind number */}
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative">
                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-2 tracking-wide drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <span className="bg-gradient-to-r from-white via-primary-foreground to-white/80 bg-clip-text text-transparent">
                        {stat.number}
                      </span>
                    </div>
                    <div className="text-[10px] md:text-xs text-primary-foreground/50 font-medium uppercase tracking-widest max-w-[140px] mx-auto leading-tight">
                      {stat.label}
                    </div>
                  </div>
                  
                  {/* Separator line (except last item) */}
                  {index < text.stats.length - 1 && (
                    <div className="hidden md:block absolute right-[-2.5rem] lg:right-[-3rem] top-1/2 -translate-y-1/2 h-12 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                  )}
                </div>
              ))}
            </div>
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