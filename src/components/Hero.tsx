import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';
import { analytics } from '@/utils/analytics';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { FileText, Users, Package } from 'lucide-react';

interface HeroProps {
  language: 'ru' | 'en';
}

const content = {
  ru: {
    title: 'ТАМОЖЕННОЕ ОФОРМЛЕНИЕ И СЕРТИФИКАЦИЯ',
    subtitle: 'ЛОГИСТИЧЕСКИЕ КОМПАНИИ И ПОСТАВЩИКИ ОФОРМЛЯЮТСЯ У НАС',
    button: 'Оставить заявку',
    reassurance: 'Перезвоним в течение 15 минут',
    stats: [
      { number: 12400, suffix: '+', label: 'оформленных деклараций за 2025 год', icon: FileText },
      { number: 115, suffix: '+', label: 'постоянных заказчиков', icon: Users },
      { number: 80, suffix: '+', label: 'товарных групп', icon: Package }
    ]
  },
  en: {
    title: 'CUSTOMS CLEARANCE AND CERTIFICATION',
    subtitle: 'LOGISTICS COMPANIES AND SUPPLIERS CHOOSE US',
    button: 'Submit Request',
    reassurance: "We'll call back within 15 minutes",
    stats: [
      { number: 12400, suffix: '+', label: 'declarations processed in 2025', icon: FileText },
      { number: 115, suffix: '+', label: 'regular customers', icon: Users },
      { number: 80, suffix: '+', label: 'product categories', icon: Package }
    ]
  }
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function useCountUp(target: number, duration = 2500) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(target * easeOutCubic(progress)));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return { count, ref };
}

interface StatCardProps {
  number: number;
  suffix: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  delay: number;
}

function StatCard({ number, suffix, label, icon: Icon, delay }: StatCardProps) {
  const { count, ref } = useCountUp(number);

  return (
    <div
      ref={ref}
      className="flex items-center gap-4 bg-black/30 backdrop-blur-md rounded-xl px-5 py-4 border border-white/15 animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="w-11 h-11 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-accent" />
      </div>
      <div>
        <div className="text-3xl font-montserrat font-bold text-primary-foreground tracking-tight leading-none">
          {count}<span className="text-primary-foreground/60">{suffix}</span>
        </div>
        <p className="text-primary-foreground/70 text-sm font-medium mt-0.5 leading-snug">
          {label}
        </p>
      </div>
    </div>
  );
}

export function Hero({ language }: HeroProps) {
  const text = content[language];
  const navigate = useNavigate();

  const handleButtonClick = () => {
    analytics.contactClick('contact-form');
    navigate('/contact');
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <img
        src={heroBg}
        alt="Контейнерный порт — таможенное оформление грузов"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Light overlay for text readability - not heavy darkening */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-12">
          {/* Left Column — Text & CTA */}
          <div className="lg:w-3/5 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-primary-foreground leading-tight tracking-tight animate-fade-in">
              {text.title}
            </h1>

            <p
              className="mt-5 text-lg sm:text-xl md:text-2xl text-primary-foreground/80 font-medium max-w-xl animate-fade-in"
              style={{ animationDelay: '0.15s' }}
            >
              {text.subtitle}
            </p>

            <Button
              size="lg"
              className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-5 text-lg font-bold shadow-lg animate-fade-in"
              style={{ animationDelay: '0.3s' }}
              onClick={handleButtonClick}
            >
              {text.button}
            </Button>

            <span
              className="mt-3 text-sm text-primary-foreground/50 animate-fade-in"
              style={{ animationDelay: '0.4s' }}
            >
              {text.reassurance}
            </span>
          </div>

          {/* Right Column — Achievement Stats */}
          <div className="lg:w-2/5 flex flex-col gap-4 w-full max-w-sm lg:max-w-none">
            {text.stats.map((stat, index) => (
              <StatCard
                key={index}
                number={stat.number}
                suffix={stat.suffix}
                label={stat.label}
                icon={stat.icon}
                delay={0.3 + index * 0.15}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
