import { useParams, Navigate } from 'react-router-dom';
import { PageHero } from '@/components/PageHero';
import { SEOHead } from '@/components/SEOHead';
import { BrokerCityContent } from '@/components/BrokerCityContent';
import { useLanguage } from '@/contexts/LanguageContext';
import { cities } from '@/data/cities';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';

// City content imports
import { vladivostokContent } from '@/data/city-content/vladivostok';

const cityContentMap: Record<string, typeof vladivostokContent> = {
  vladivostok: vladivostokContent,
};

const fallback = {
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

  const cityData = cities.find((c) => c.slug === city);

  useEffect(() => {
    if (cityData) {
      const prefix = language === 'ru' ? 'Таможенный брокер' : 'Customs Broker';
      analytics.pageView(`/tamozhennyj-broker/${city}`, `${prefix} ${cityData.name[language]}`);
    }
  }, [city, cityData, language]);

  if (!cityData) return <Navigate to="/tamozhennyj-broker" replace />;

  const cityContent = city ? cityContentMap[city] : undefined;

  // Rich content page
  if (cityContent) {
    const t = cityContent[language];
    return (
      <>
        <SEOHead
          language={language}
          page="broker-city"
          customTitle={t.heroTitle}
          customDescription={t.seoDescription}
          canonicalPath={`/tamozhennyj-broker/${city}`}
        />
        <PageHero title={t.heroTitle} subtitle={t.heroSubtitle} />
        <BrokerCityContent data={t} />
      </>
    );
  }

  // Fallback stub
  const f = fallback[language];
  const title = `${f.titlePrefix} ${cityData.name[language]}`;

  return (
    <>
      <SEOHead
        language={language}
        page="broker-city"
        customTitle={title}
        customDescription={`${title} — ${f.placeholder} ${cityData.name[language]}`}
      />
      <PageHero title={title} />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <p className="text-muted-foreground text-lg">
            {f.placeholder} {cityData.name[language]}.
          </p>
        </div>
      </section>
    </>
  );
}
