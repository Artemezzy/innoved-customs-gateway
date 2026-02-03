import { useState, useEffect, useRef } from 'react';
import { FileText, Users, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
    <Card
      ref={ref}
      className="bg-card p-8 rounded-lg shadow-card text-center hover:shadow-hover transition-all duration-300 border-0 animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
        {count}
        <span>{suffix}</span>
      </div>
      <p className="text-muted-foreground">{label}</p>
    </Card>
  );
}

export function Achievements({ language }: AchievementsProps) {
  const text = content[language];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground text-center mb-12">
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
              delay={index * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
