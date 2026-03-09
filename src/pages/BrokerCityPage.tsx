import { useParams, Navigate } from 'react-router-dom';
import { PageHero } from '@/components/PageHero';
import { SEOHead } from '@/components/SEOHead';
import { BrokerCityContent } from '@/components/BrokerCityContent';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useLanguage } from '@/contexts/LanguageContext';
import { cities } from '@/data/cities';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';

// City content imports
import { vladivostokContent } from '@/data/city-content/vladivostok';
import { irkutskContent } from '@/data/city-content/irkutsk';
import { novorossiyskContent } from '@/data/city-content/novorossiysk';
import { novosibirskContent } from '@/data/city-content/novosibirsk';
import { barnaulContent } from '@/data/city-content/barnaul';
import { ekaterinburgContent } from '@/data/city-content/ekaterinburg';
import { izhevskContent } from '@/data/city-content/izhevsk';
import { kazanContent } from '@/data/city-content/kazan';
import { krasnodarContent } from '@/data/city-content/krasnodar';
import { krasnoyarskContent } from '@/data/city-content/krasnoyarsk';
import { makhachkalaContent } from '@/data/city-content/makhachkala';
import { moscowContent } from '@/data/city-content/moscow';
import { volgogradContent } from '@/data/city-content/volgograd';
import { voronezhContent } from '@/data/city-content/voronezh';
import { zabaikalskContent } from '@/data/city-content/zabaikalsk';
import { yaroslavlContent } from '@/data/city-content/yaroslavl';
import { chelyabinskContent } from '@/data/city-content/chelyabinsk';
import { khabarovskContent } from '@/data/city-content/khabarovsk';
import { ulyanovskContent } from '@/data/city-content/ulyanovsk';
import { tyumenContent } from '@/data/city-content/tyumen';
import { tolyattiContent } from '@/data/city-content/tolyatti';
import { saratovContent } from '@/data/city-content/saratov';
import { saintPetersburgContent } from '@/data/city-content/saint-petersburg';
import { samaraContent } from '@/data/city-content/samara';
import { nakhodkaContent } from '@/data/city-content/nakhodka';
import { nizhnyNovgorodContent } from '@/data/city-content/nizhny-novgorod';
import { omskContent } from '@/data/city-content/omsk';
import { rostovContent } from '@/data/city-content/rostov';

const cityContentMap: Record<string, typeof vladivostokContent> = {
  vladivostok: vladivostokContent,
  irkutsk: irkutskContent,
  novorossiysk: novorossiyskContent,
  novosibirsk: novosibirskContent,
  barnaul: barnaulContent,
  ekaterinburg: ekaterinburgContent,
  izhevsk: izhevskContent,
  kazan: kazanContent,
  krasnodar: krasnodarContent,
  krasnoyarsk: krasnoyarskContent,
  makhachkala: makhachkalaContent,
  moskva: moscowContent,
  volgograd: volgogradContent,
  voronezh: voronezhContent,
  zabaykalsk: zabaikalskContent,
  yaroslavl: yaroslavlContent,
  chelyabinsk: chelyabinskContent,
  khabarovsk: khabarovskContent,
  ulyanovsk: ulyanovskContent,
  tyumen: tyumenContent,
  tolyatti: tolyattiContent,
  saratov: saratovContent,
  'sankt-peterburg': saintPetersburgContent,
  samara: samaraContent,
  nakhodka: nakhodkaContent,
  'nizhny-novgorod': nizhnyNovgorodContent,
  omsk: omskContent,
  'rostov-na-donu': rostovContent,
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
