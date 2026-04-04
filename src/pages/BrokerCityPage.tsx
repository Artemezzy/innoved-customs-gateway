import { useParams, Navigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { cities } from '@/data/cities';
import { analytics } from '@/utils/analytics';
import { CustomsCalculator } from '@/components/CustomsCalculator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Ship, Globe, Briefcase, Phone, ArrowRight, ClipboardList, Search, FileText, ScanLine, PackageCheck, ShieldCheck, MapPin } from 'lucide-react';

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

const whyItems = {
  ru: [
    { icon: ShieldCheck, title: 'Белый импорт', desc: 'Работаем только в правовом поле' },
    { icon: Globe, title: 'Удалённое оформление', desc: 'Из любого города России' },
    { icon: Ship, title: 'Все виды грузов', desc: 'Контейнерные, сборные, негабаритные' },
    { icon: MapPin, title: 'Знание региона', desc: 'Специфика местной логистики' },
  ],
  en: [
    { icon: ShieldCheck, title: 'White import', desc: 'Fully legal framework only' },
    { icon: Globe, title: 'Remote processing', desc: 'From any city in Russia' },
    { icon: Ship, title: 'All cargo types', desc: 'Container, consolidated, oversized' },
    { icon: MapPin, title: 'Regional expertise', desc: 'Local logistics specifics' },
  ],
};

const stepIcons = [
  { id: 'request', icon: ClipboardList },
  { id: 'analysis', icon: Search },
  { id: 'docs', icon: FileText },
  { id: 'declare', icon: ScanLine },
  { id: 'control', icon: PackageCheck },
  { id: 'release', icon: ShieldCheck },
  { id: 'delivery', icon: Ship },
  { id: 'recommend', icon: Globe },
];

const texts = {
  ru: { contactUs: 'Оставить заявку', otherCities: 'Другие города', step: 'Этап', of: 'из' },
  en: { contactUs: 'Submit a request', otherCities: 'Other cities', step: 'Step', of: 'of' },
};

const fallback = {
  ru: { titlePrefix: 'Таможенный брокер', placeholder: 'Страница находится в разработке. Скоро здесь появится подробная информация об услугах таможенного оформления в городе' },
  en: { titlePrefix: 'Customs Broker', placeholder: 'This page is under development. Detailed information about customs clearance services in' },
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

  if (!cityContent) {
    const f = fallback[language];
    const title = `${f.titlePrefix} ${cityData.name[language]}`;
    return (
      <>
        <SEOHead language={language} page="broker-city" customTitle={title} customDescription={`${title} — ${f.placeholder} ${cityData.name[language]}`} />
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h1 className="text-3xl font-montserrat font-bold text-foreground mb-4">{title}</h1>
            <p className="text-muted-foreground text-lg">{f.placeholder} {cityData.name[language]}.</p>
          </div>
        </section>
      </>
    );
  }

  const t = cityContent[language];
  const ui = texts[language];

  return (
    <>
      <SEOHead
        language={language}
        page="broker-city"
        customTitle={t.heroTitle}
        customDescription={t.seoDescription}
        customKeywords={(t as any).seoKeywords}
        canonicalPath={`/tamozhennyj-broker/${city}`}
      />
      <CityLanding data={t} language={language} ui={ui} citySlug={city!} />
    </>
  );
}

interface CityLandingData {
  heroTitle: string;
  heroSubtitle: string;
  intro: { title: string; text: string };
  logistics: { title: string; text: string };
  services: { title: string; items: string[] };
  remote: { title: string; text: string };
  cases: { title: string; items: string[] };
  steps: { title: string; items: string[] };
  important: { title: string; items: string[] };
  cta: { title: string; text: string; button: string };
}

function CityLanding({ data, language, ui, citySlug }: { data: CityLandingData; language: 'ru' | 'en'; ui: typeof texts.ru; citySlug: string }) {
  const why = whyItems[language];
  const [activeTab, setActiveTab] = useState(stepIcons[0].id);
  const visibleStepIcons = stepIcons.slice(0, data.steps.items.length);
  const otherCities = cities.filter(c => c.slug !== citySlug).slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero with port background */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <img src="/images/port-bg.webp" alt="" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />

        <div className="relative z-10 container mx-auto px-4 pt-24 pb-12">
          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-12">
            <div className="lg:w-3/5 flex flex-col items-start">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-primary-foreground leading-tight tracking-tight animate-fade-in">
                {data.heroTitle}
              </h1>
              <p className="mt-3 text-xl md:text-2xl text-primary-foreground/90 font-medium animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {data.heroSubtitle}
              </p>
              <p className="mt-5 text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-xl animate-fade-in" style={{ animationDelay: '0.15s' }}>
                {data.intro.text}
              </p>
              <Button size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-5 text-lg font-bold shadow-lg animate-fade-in" style={{ animationDelay: '0.3s' }} asChild>
                <Link to="/contact"><Phone className="w-5 h-5" />{ui.contactUs}</Link>
              </Button>
            </div>

            <div className="lg:w-2/5 w-full max-w-md lg:max-w-none">
              <div className="bg-black/40 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/10">
                <CustomsCalculator language={language} compact />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            {why.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-black/30 backdrop-blur-md rounded-xl border border-white/15 p-4 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-primary-foreground mb-1">{item.title}</h3>
                    <p className="text-xs text-primary-foreground/70 leading-snug">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content sections */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          {/* Logistics */}
          <section className="mb-16">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Ship className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground">{data.logistics.title}</h2>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed ml-16">{data.logistics.text}</p>
          </section>

          {/* Services */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-8">{data.services.title}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.services.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-accent/30 transition-colors">
                  <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Remote */}
          <section className="mb-16">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground">{data.remote.title}</h2>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed ml-16">{data.remote.text}</p>
          </section>

          {/* Cases */}
          <section className="mb-16">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground">{data.cases.title}</h2>
            </div>
            <div className="space-y-4">
              {data.cases.items.map((item, i) => (
                <div key={i} className="p-5 rounded-xl border border-border bg-card">
                  <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Steps as Tabs */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{data.steps.title}</h2>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="hidden md:grid w-full h-auto p-2 bg-muted/50 rounded-xl mb-8" style={{ gridTemplateColumns: `repeat(${visibleStepIcons.length}, minmax(0, 1fr))` }}>
                {data.steps.items.map((item, index) => {
                  const StepIcon = visibleStepIcons[index]?.icon || ClipboardList;
                  const tabId = visibleStepIcons[index]?.id || `step-${index}`;
                  return (
                    <TabsTrigger key={tabId} value={tabId} className="flex flex-col items-center gap-2 py-4 px-2 whitespace-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-300">
                      <div className="relative">
                        <StepIcon className="w-5 h-5" />
                        <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-accent/20 text-[10px] flex items-center justify-center font-bold">{index + 1}</span>
                      </div>
                      <span className="text-xs font-medium text-center leading-tight">{item.length > 40 ? item.slice(0, 37) + '...' : item}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <TabsList className="md:hidden flex w-full overflow-x-auto gap-2 h-auto p-2 bg-muted/50 rounded-xl mb-8 scrollbar-hide">
                {data.steps.items.map((item, index) => {
                  const StepIcon = visibleStepIcons[index]?.icon || ClipboardList;
                  const tabId = visibleStepIcons[index]?.id || `step-${index}`;
                  return (
                    <TabsTrigger key={tabId} value={tabId} className="flex-shrink-0 flex flex-col items-center gap-1 py-3 px-3 whitespace-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-300 min-w-[70px]">
                      <StepIcon className="w-4 h-4" />
                      <span className="text-[10px] font-medium text-center leading-tight">{index + 1}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {data.steps.items.map((item, index) => {
                const StepIcon = visibleStepIcons[index]?.icon || ClipboardList;
                const tabId = visibleStepIcons[index]?.id || `step-${index}`;
                return (
                  <TabsContent key={tabId} value={tabId} className="mt-0 animate-fade-in">
                    <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-card">
                      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                        <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-accent/10 flex items-center justify-center">
                          <StepIcon className="w-8 h-8 md:w-10 md:h-10 text-accent" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{ui.step} {index + 1}</h3>
                          <p className="text-foreground/80 leading-relaxed">{item}</p>
                        </div>
                      </div>
                      <div className="mt-8 pt-6 border-t border-border">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{ui.step} {index + 1} {ui.of} {data.steps.items.length}</span>
                          <div className="flex gap-1">
                            {data.steps.items.map((_, i) => (
                              <button key={i} onClick={() => setActiveTab(visibleStepIcons[i]?.id || `step-${i}`)} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === index ? 'bg-accent w-6' : i < index ? 'bg-accent/60' : 'bg-muted-foreground/30'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </section>

          {/* Important */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-8">{data.important.title}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.important.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                  <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-accent/5 rounded-xl p-8 text-center mb-16 border border-accent/20">
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-4">{data.cta.title}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">{data.cta.text}</p>
            <Link to="/contact">
              <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Phone className="w-4 h-4" />{data.cta.button}
              </Button>
            </Link>
          </div>

          {/* Other cities */}
          <div className="pt-8 border-t border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">{ui.otherCities}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {otherCities.map(c => (
                <Button key={c.slug} variant="outline" className="justify-start text-sm h-auto py-2.5 px-4 whitespace-normal text-left hover:border-accent hover:text-accent" asChild>
                  <Link to={`/tamozhennyj-broker/${c.slug}`}>{c.name[language]}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
