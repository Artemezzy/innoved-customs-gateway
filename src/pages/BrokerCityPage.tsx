import { useParams, Navigate } from 'react-router-dom';
import { PageHero } from '@/components/PageHero';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { cities } from '@/data/cities';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';

const content = {
  ru: {
    titlePrefix: 'Таможенный брокер',
    placeholder: 'Страница находится в разработке. Скоро здесь появится подробная информация об услугах таможенного оформления в городе',
  },
  en: {
    titlePrefix: 'Customs Broker',
    placeholder: 'This page is under development. Detailed information about customs clearance services in',
  },
};

export default function BrokerCityPage() {
  const { city } = useParams<{ city: string }>();
  const { language } = useLanguage();
  const t = content[language];

  const cityData = cities.find((c) => c.slug === city);

  useEffect(() => {
    if (cityData) {
      analytics.pageView(`/tamozhennyj-broker/${city}`, `${t.titlePrefix} ${cityData.name[language]}`);
    }
  }, [city, cityData, language, t.titlePrefix]);

  if (!cityData) return <Navigate to="/tamozhennyj-broker" replace />;

  const title = `${t.titlePrefix} ${cityData.name[language]}`;

  return (
    <>
      <SEOHead
        language={language}
        page="broker-city"
        customTitle={title}
        customDescription={`${title} — ${t.placeholder} ${cityData.name[language]}`}
      />
      <PageHero title={title} />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <p className="text-muted-foreground text-lg">
            {t.placeholder} {cityData.name[language]}.
          </p>
        </div>
      </section>
    </>
  );
}
