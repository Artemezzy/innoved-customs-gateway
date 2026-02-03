import { useState, useEffect, useRef } from 'react';
import { FileText, Users, Package } from 'lucide-react';

interface AchievementsProps {
  language: 'ru' | 'en';
}

const content = {
  ru: {
    title: 'Наши достижения',
    stats: [
      { number: 2400, suffix: '+', label: 'оформленных деклараций за 2025 год', icon: FileText },
      { number: 115, suffix: '+', label: 'постоянных заказчиков', icon: Users },
      { number: 80, suffix: '+', label: 'товарных групп', icon: Package }
    ]
  },
  en: {
    title: 'Our Achievements',
    stats: [
      { number: 2400, suffix: '+', label: 'declarations processed in 2025', icon: FileText },
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
            const easedProgress = easeOutCubic(progress);
            setCount(Math.floor(target * easedProgress));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
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
      className="relative group animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Glass card */}
      <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
        {/* Icon with glow */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        {/* Number */}
        <div className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">
          {count}
          <span className="text-white/80">{suffix}</span>
        </div>
        
        {/* Label */}
        <p className="text-white/70 text-sm md:text-base font-medium leading-relaxed">
          {label}
        </p>
      </div>
    </div>
  );
}

export function Achievements({ language }: AchievementsProps) {
  const text = content[language];

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary via-primary-hover to-primary-glow">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-white/3 rounded-full" />
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
          {text.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {text.stats.map((stat, index) => (
            <StatCard
              key={index}
              number={stat.number}
              suffix={stat.suffix}
              label={stat.label}
              icon={stat.icon}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
