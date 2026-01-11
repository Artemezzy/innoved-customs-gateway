import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface StatsSectionProps {
  language: 'ru' | 'en';
}

const content = {
  ru: {
    slogan: 'С ИННОВЭД - таможенное оформление: быстро, надежно, удобно!',
    button: 'О компании',
    stats: [
      { value: '200+', label: 'городов по всей России' },
      { value: '100+', label: 'завершённых сделок в месяц' },
      { value: '10 лет', label: 'на рынке ВЭД' }
    ]
  },
  en: {
    slogan: 'With INNOVED - customs clearance: fast, reliable, convenient!',
    button: 'About Us',
    stats: [
      { value: '200+', label: 'cities across Russia' },
      { value: '100+', label: 'completed deals per month' },
      { value: '10 years', label: 'in foreign trade' }
    ]
  }
};

export function StatsSection({ language }: StatsSectionProps) {
  const text = content[language];

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left side - Slogan and Button */}
          <div className="flex flex-col items-start gap-4 lg:max-w-md">
            <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed">
              {text.slogan}
            </p>
            <Link to="/about">
              <Button 
                variant="default"
                className="bg-navy hover:bg-navy/90 text-white px-6 py-5 text-base font-semibold rounded-md"
              >
                {text.button}
              </Button>
            </Link>
          </div>

          {/* Right side - Statistics */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 md:gap-16">
            {text.stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-olive mb-1">
                  {stat.value}
                </span>
                <span className="text-sm md:text-base text-muted-foreground max-w-32">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
