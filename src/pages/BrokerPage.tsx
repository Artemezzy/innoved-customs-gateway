import { Link } from 'react-router-dom';
import { PageHero } from '@/components/PageHero';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { cities } from '@/data/cities';
import { MapPin, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';

const content = {
  ru: {
    title: 'Таможенный брокер',
    subtitle: 'Профессиональные услуги таможенного оформления по всей России',
    heading: 'Где мы оказываем услуги',
    description: 'Мы оказываем услуги таможенного оформления в ключевых логистических центрах России. Выберите ваш город, чтобы узнать подробности.',
    details: 'Подробнее',
  },
  en: {
    title: 'Customs Broker',
    subtitle: 'Professional customs clearance services across Russia',
    heading: 'Our Branches',
    description: 'We provide customs clearance services in key logistics hubs across Russia. Select your city to learn more.',
    details: 'Learn more',
  },
};

export default function BrokerPage() {
  const { language } = useLanguage();
  const t = content[language];

  useEffect(() => {
    analytics.pageView('/tamozhennyj-broker', 'Таможенный брокер');
  }, []);

  return (
    <>
      <SEOHead
        language={language}
        page="broker"
        customTitle={t.title}
        customDescription={t.subtitle}
      />
      <PageHero title={t.title} subtitle={t.subtitle} />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-montserrat font-bold text-foreground text-center mb-4">
            {t.heading}
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            {t.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {cities.map((city) => (
              <Link
                key={city.slug}
                to={`/tamozhennyj-broker/${city.slug}`}
                className="group relative flex items-center gap-4 p-6 rounded-2xl border border-border bg-card hover:border-accent hover:shadow-[var(--shadow-hover)] transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-montserrat font-bold text-foreground text-lg">
                    {city.name[language]}
                  </h3>
                  <span className="text-sm text-muted-foreground group-hover:text-accent transition-colors duration-300 flex items-center gap-1">
                    {t.details} <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
