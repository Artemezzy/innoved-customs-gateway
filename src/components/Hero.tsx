import { Button } from '@/components/ui/button';
import heroVideo from '@/assets/hero-bg-v2.mp4';
import { analytics } from '@/utils/analytics';

interface HeroProps {
  language: 'ru' | 'en';
}

const content = {
  ru: {
    title: 'ТАМОЖНЯ БЕЗ ГРАНИЦ:',
    subtitle: 'ВАШ ГРУЗ - НАША ЗАБОТА',
    button: 'Оформить заявку',
    stats: [
      { value: '200+', label: 'городов по всей России' },
      { value: '100+', label: 'завершённых сделок в месяц' },
      { value: '10 лет', label: 'на рынке ВЭД' }
    ]
  },
  en: {
    title: 'CUSTOMS WITHOUT BORDERS:',
    subtitle: 'YOUR CARGO - OUR CARE',
    button: 'Submit Request',
    stats: [
      { value: '200+', label: 'cities across Russia' },
      { value: '100+', label: 'completed deals per month' },
      { value: '10 years', label: 'in foreign trade' }
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
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-2 tracking-wide">
            {text.title}
          </h1>
          <p className="text-2xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-8 tracking-wide">
            {text.subtitle}
          </p>
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary-hover text-primary-foreground px-10 py-6 text-lg font-semibold shadow-hover mb-12"
            onClick={handleButtonClick}
          >
            {text.button}
          </Button>
        </div>

        {/* Statistics Block */}
        <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="inline-flex flex-col md:flex-row gap-4 md:gap-0 bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8">
            {text.stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center px-6 md:px-10">
                <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-2">
                  {stat.value}
                </span>
                <span className="text-sm md:text-base text-primary-foreground/80 text-center max-w-32">
                  {stat.label}
                </span>
                {index < text.stats.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-primary-foreground/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
