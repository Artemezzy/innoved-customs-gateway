import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';
import { analytics } from '@/utils/analytics';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { FileText, Users, Package } from 'lucide-react';
import { QuickContactForm } from '@/components/QuickContactForm';

interface HeroProps {
  language: 'ru' | 'en';
}

const content = {
  ru: {
    title: 'ТАМОЖЕННОЕ ОФОРМЛЕНИЕ БЕЗ ШТРАФОВ И ЗАДЕРЖЕК ЗА 1 ЧАС',
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
      className="flex items-center gap-3 bg-black/30 backdrop-blur-md rounded-xl px-4 py-3 border border-white/15 animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-accent" />
      </div>
      <div>
        <div className="text-2xl font-montserrat font-bold text-primary-foreground tracking-tight leading-none">
          {count}<span className="text-primary-foreground/60">{suffix}</span>
        </div>
        <p className="text-primary-foreground/70 text-xs font-medium mt-0.5 leading-snug">
          {label}
        </p>
      </div>
    </div>
  );
}

export function Hero({ language }: HeroProps) {
  const text = content[language];
  const navigate = useNavigate();

  const uspItems = language === 'ru'
    ? ['Бесплатная консультация', 'Оформление от 5 000 ₽', 'Расчёт платежей за один день']
    : ['Free consultation', 'Clearance from 5,000 ₽', 'Payment calculation in one day'];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <img
        src={heroBg}
        alt="Контейнерный порт — таможенное оформление грузов"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10" />

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

            {/* USP Tags */}
            <div className="flex flex-wrap gap-2 mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {uspItems.map((item, i) => (
                <span
                  key={i}
                  className="bg-white/15 backdrop-blur-sm border border-white/20 text-primary-foreground text-xs sm:text-sm font-medium px-4 py-2 rounded-lg"
                  style={{
                    transform: `rotate(${i === 0 ? '-1.5' : i === 1 ? '1' : '-0.5'}deg)`,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column — Quick Contact Form */}
          <div className="lg:w-2/5 w-full max-w-md lg:max-w-none animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="bg-black/40 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/10">
              <QuickContactForm language={language} />
            </div>
          </div>
        </div>

        {/* Achievement Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          {text.stats.map((stat, index) => (
            <StatCard
              key={index}
              number={stat.number}
              suffix={stat.suffix}
              label={stat.label}
              icon={stat.icon}
              delay={0.5 + index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
