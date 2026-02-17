interface PageHeroProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHero({ title, subtitle, children }: PageHeroProps) {
  return (
    <section className="relative bg-foreground text-primary-foreground py-20 overflow-hidden">
      {/* Triangle pattern background */}
      <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
        <polygon points="0,0 120,0 60,100" className="fill-white/5" />
        <polygon points="80,20 200,0 140,120" className="fill-white/8" />
        <polygon points="0,80 100,60 50,180" className="fill-white/4" />
        <polygon points="150,80 250,40 200,160" className="fill-white/6" />
        <polygon points="300,100 380,60 340,180" className="fill-white/5" />
        <polygon points="10,200 90,180 50,280" className="fill-white/7" />
        <polygon points="200,200 280,160 240,280" className="fill-white/4" />
        <polygon points="85%,90% 95%,70% 100%,95%" className="fill-white/5" />
        <polygon points="75%,85% 90%,75% 82%,100%" className="fill-white/7" />
        <polygon points="90%,60% 100%,50% 95%,80%" className="fill-white/4" />
        <polygon points="70%,70% 85%,60% 78%,90%" className="fill-white/6" />
        <polygon points="50%,20% 60%,10% 55%,35%" className="fill-white/3" />
        <polygon points="40%,60% 55%,50% 48%,75%" className="fill-white/4" />
        <polygon points="60%,40% 75%,30% 68%,55%" className="fill-white/5" />
      </svg>

      <div className="container mx-auto px-4 text-center relative z-10">
        {children ? (
          children
        ) : (
          <>
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-4 animate-fade-in">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl opacity-90 animate-fade-in max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
