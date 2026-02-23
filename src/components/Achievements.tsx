import { useState, useEffect, useRef } from 'react';
import { FileText, Users, Package } from 'lucide-react';

interface AchievementsProps {
  language: 'ru' | 'en';
}

const content = {
  ru: {
    title: 'Наши достижения',
    stats: [
      { number: 12400, suffix: '+', label: 'оформленных деклараций за 2025 год', icon: FileText },
      { number: 115, suffix: '+', label: 'постоянных заказчиков', icon: Users },
      { number: 80, suffix: '+', label: 'товарных групп', icon: Package }
    ]
  },
  en: {
    title: 'Our Achievements',
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

interface StatItemProps {
  number: number;
  suffix: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  delay: number;
}

function StatItem({ number, suffix, label, icon: Icon, delay }: StatItemProps) {
  const { count, ref } = useCountUp(number);

  return (
    <div
      ref={ref}
      className="flex items-center gap-5 animate-fade-in group"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/25 transition-colors border border-white/20">
        <Icon className="w-7 h-7 text-white" />
      </div>
      
      {/* Content */}
      <div>
        <div className="text-4xl md:text-5xl font-montserrat font-bold text-white tracking-tight">
          {count}
          <span className="text-white/70">{suffix}</span>
        </div>
        <p className="text-white/60 text-sm md:text-base font-medium mt-1">
          {label}
        </p>
      </div>
    </div>
  );
}

export function Achievements({ language }: AchievementsProps) {
  const text = content[language];

  return (
    <section className="relative py-20 overflow-hidden bg-primary">
      {/* Triangle pattern background */}
      <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
        {/* Large triangles - top left area */}
        <polygon points="0,0 120,0 60,100" className="fill-white/5" />
        <polygon points="80,20 200,0 140,120" className="fill-white/8" />
        <polygon points="0,80 100,60 50,180" className="fill-white/4" />
        <polygon points="150,80 250,40 200,160" className="fill-white/6" />
        
        {/* Medium triangles - scattered */}
        <polygon points="300,100 380,60 340,180" className="fill-white/5" />
        <polygon points="10,200 90,180 50,280" className="fill-white/7" />
        <polygon points="200,200 280,160 240,280" className="fill-white/4" />
        
        {/* Large triangles - bottom right area */}
        <polygon points="100%,100% -120,0 -60,-100" transform="translate(0,0)" className="fill-white/6" style={{ transform: 'translate(100%, 100%) scale(-1, -1)' }} />
        <polygon points="85%,90% 95%,70% 100%,95%" className="fill-white/5" />
        <polygon points="75%,85% 90%,75% 82%,100%" className="fill-white/7" />
        <polygon points="90%,60% 100%,50% 95%,80%" className="fill-white/4" />
        <polygon points="70%,70% 85%,60% 78%,90%" className="fill-white/6" />
        
        {/* Additional scattered triangles */}
        <polygon points="50%,20% 60%,10% 55%,35%" className="fill-white/3" />
        <polygon points="40%,60% 55%,50% 48%,75%" className="fill-white/4" />
        <polygon points="60%,40% 75%,30% 68%,55%" className="fill-white/5" />
      </svg>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left side - Title */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-white leading-tight">
              {text.title}
            </h2>
          </div>
          
          {/* Right side - Stats */}
          <div className="lg:w-1/2 space-y-8">
            {text.stats.map((stat, index) => (
              <StatItem
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
      </div>
    </section>
  );
}
