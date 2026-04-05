import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { cities } from '@/data/cities';
import { QuickContactForm } from '@/components/QuickContactForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MapPin, ArrowRight, Phone, CheckCircle, ShieldCheck, Globe, Ship,
  ClipboardList, Search, FileText, ScanLine, PackageCheck, Scale, HelpCircle, Briefcase
} from 'lucide-react';
import { analytics } from '@/utils/analytics';
import heroBg from '@/assets/hero-bg.jpg';

const content = {
  ru: {
    heroTitle: 'ТАМОЖЕННЫЙ БРОКЕР',
    heroDesc: 'Таможенный брокер — это лицензированный специалист, который берёт на себя все вопросы взаимодействия с таможенными органами: подготовку документов, подачу деклараций, расчёт платежей и контроль выпуска грузов. Если вы импортируете или экспортируете товары, брокер экономит ваше время и защищает от штрафов и задержек.',
    whoTitle: 'Кто такой таможенный брокер',
    whoText: 'Таможенный брокер (таможенный представитель) — юридическое лицо, включённое в Реестр таможенных представителей и уполномоченное совершать таможенные операции от имени декларанта. Брокер несёт солидарную ответственность за правильность декларирования, соблюдение запретов и ограничений, полноту уплаты таможенных платежей. Работа с профессиональным брокером — это гарантия легального оформления, минимизации рисков и оптимизации расходов.',
    servicesTitle: 'Какие услуги оказывает таможенный брокер',
    services: [
      'Подготовка и подача таможенных деклараций',
      'Классификация товаров по ТН ВЭД',
      'Расчёт таможенных платежей и пошлин',
      'Получение разрешительных документов и сертификатов',
      'Консультации по вопросам ВЭД',
      'Представление интересов в таможенных органах',
      'Организация досмотра и экспертиз',
      'Сопровождение таможенного транзита',
    ],
    whenTitle: 'Когда нужен таможенный брокер',
    whenItems: [
      'Первый импорт или экспорт — нет опыта работы с таможней',
      'Сложные или подсанкционные товары — высокий риск ошибок',
      'Оптимизация таможенных платежей — выбор кода ТН ВЭД, льгот',
      'Таможенная проверка или корректировка стоимости',
      'Большие объёмы поставок — нужна автоматизация и скорость',
      'Удалённая работа — груз в одном городе, вы в другом',
    ],
    stepsTitle: 'Этапы работы с таможенным брокером',
    steps: [
      'Заявка и первичная консультация: обсуждаем задачу, считаем стоимость',
      'Анализ документов и товара: проверяем контракт, инвойсы, сертификаты',
      'Классификация по ТН ВЭД: подбираем оптимальный код товара',
      'Подготовка и подача декларации: формируем ДТ и подаём в таможню',
      'Таможенный контроль: сопровождаем проверку и досмотр',
      'Уплата платежей и выпуск: обеспечиваем оплату и получаем выпуск',
    ],
    geoTitle: 'География услуг',
    geoDesc: 'Мы оказываем услуги таможенного оформления в ключевых логистических центрах России. Выберите ваш город:',
    ctaTitle: 'Нужна помощь с таможенным оформлением?',
    ctaText: 'Оставьте заявку — мы перезвоним в течение 15 минут и бесплатно проконсультируем по вашему грузу.',
    ctaButton: 'Оставить заявку',
    step: 'Этап',
    of: 'из',
  },
  en: {
    heroTitle: 'CUSTOMS BROKER',
    heroDesc: 'A customs broker is a licensed specialist who handles all interactions with customs authorities: document preparation, declaration filing, duty calculation, and cargo release control. If you import or export goods, a broker saves your time and protects you from fines and delays.',
    whoTitle: 'What is a Customs Broker',
    whoText: 'A customs broker (customs representative) is a legal entity registered in the Customs Representatives Registry, authorized to perform customs operations on behalf of the declarant. The broker bears joint liability for correct declaration, compliance with prohibitions and restrictions, and full payment of customs duties. Working with a professional broker guarantees legal clearance, risk minimization, and cost optimization.',
    servicesTitle: 'Customs Broker Services',
    services: [
      'Preparation and filing of customs declarations',
      'Product classification by HS codes',
      'Calculation of customs duties and payments',
      'Obtaining permits and certificates',
      'Foreign trade consulting',
      'Representation before customs authorities',
      'Inspection and expertise coordination',
      'Customs transit support',
    ],
    whenTitle: 'When Do You Need a Customs Broker',
    whenItems: [
      'First import or export — no experience with customs',
      'Complex or regulated goods — high risk of errors',
      'Customs payment optimization — HS code selection, benefits',
      'Customs audit or value adjustment',
      'High shipment volumes — need automation and speed',
      'Remote processing — cargo in one city, you in another',
    ],
    stepsTitle: 'How We Work Together',
    steps: [
      'Request and initial consultation: discuss the task, calculate costs',
      'Document and product analysis: review contract, invoices, certificates',
      'HS code classification: select the optimal product code',
      'Declaration preparation and filing: create and submit customs declaration',
      'Customs control: accompany inspection and examination',
      'Payment and release: ensure duty payment and obtain release',
    ],
    geoTitle: 'Service Locations',
    geoDesc: 'We provide customs clearance services in key logistics hubs across Russia. Select your city:',
    ctaTitle: 'Need Help with Customs Clearance?',
    ctaText: "Submit a request — we'll call back within 15 minutes and provide a free consultation on your cargo.",
    ctaButton: 'Submit a request',
    step: 'Step',
    of: 'of',
  },
};

const whyItems = {
  ru: [
    { icon: ShieldCheck, title: 'Белый импорт', desc: 'Работаем только в правовом поле' },
    { icon: Globe, title: 'Удалённое оформление', desc: 'Из любого города России' },
    { icon: Ship, title: 'Все виды грузов', desc: 'Контейнерные, сборные, негабаритные' },
    { icon: Scale, title: 'Оптимизация платежей', desc: 'Легальное снижение расходов' },
  ],
  en: [
    { icon: ShieldCheck, title: 'White import', desc: 'Fully legal framework only' },
    { icon: Globe, title: 'Remote processing', desc: 'From any city in Russia' },
    { icon: Ship, title: 'All cargo types', desc: 'Container, consolidated, oversized' },
    { icon: Scale, title: 'Payment optimization', desc: 'Legal cost reduction' },
  ],
};

const stepIcons = [
  { id: 'request', icon: ClipboardList },
  { id: 'analysis', icon: Search },
  { id: 'classify', icon: FileText },
  { id: 'declare', icon: ScanLine },
  { id: 'control', icon: PackageCheck },
  { id: 'release', icon: ShieldCheck },
];

const cityRegions = {
  ru: [
    { name: 'Центральная Россия', slugs: ['moskva', 'nizhny-novgorod', 'voronezh', 'yaroslavl'] },
    { name: 'Северо-Запад', slugs: ['sankt-peterburg'] },
    { name: 'Юг России', slugs: ['krasnodar', 'novorossiysk', 'rostov-na-donu', 'volgograd', 'makhachkala'] },
    { name: 'Поволжье', slugs: ['kazan', 'samara', 'saratov', 'tolyatti', 'ulyanovsk', 'izhevsk'] },
    { name: 'Урал', slugs: ['ekaterinburg', 'chelyabinsk', 'tyumen'] },
    { name: 'Сибирь', slugs: ['novosibirsk', 'omsk', 'krasnoyarsk', 'barnaul', 'irkutsk'] },
    { name: 'Дальний Восток', slugs: ['vladivostok', 'khabarovsk', 'nakhodka', 'zabaykalsk'] },
  ],
  en: [
    { name: 'Central Russia', slugs: ['moskva', 'nizhny-novgorod', 'voronezh', 'yaroslavl'] },
    { name: 'Northwest', slugs: ['sankt-peterburg'] },
    { name: 'Southern Russia', slugs: ['krasnodar', 'novorossiysk', 'rostov-na-donu', 'volgograd', 'makhachkala'] },
    { name: 'Volga Region', slugs: ['kazan', 'samara', 'saratov', 'tolyatti', 'ulyanovsk', 'izhevsk'] },
    { name: 'Ural', slugs: ['ekaterinburg', 'chelyabinsk', 'tyumen'] },
    { name: 'Siberia', slugs: ['novosibirsk', 'omsk', 'krasnoyarsk', 'barnaul', 'irkutsk'] },
    { name: 'Far East', slugs: ['vladivostok', 'khabarovsk', 'nakhodka', 'zabaykalsk'] },
  ],
};

export default function BrokerPage() {
  const { language } = useLanguage();
  const t = content[language];
  const why = whyItems[language];
  const regions = cityRegions[language];
  const [activeTab, setActiveTab] = useState(stepIcons[0].id);

  useEffect(() => {
    analytics.pageView('/tamozhennyj-broker', 'Таможенный брокер');
  }, []);

  return (
    <>
      <SEOHead
        language={language}
        page="broker"
        canonicalPath="/tamozhennyj-broker"
      />

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <img src="/images/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />

          <div className="relative z-10 container mx-auto px-4 pt-24 pb-12">
            <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-12">
              <div className="lg:w-3/5 flex flex-col items-start">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-montserrat font-bold text-primary-foreground leading-tight tracking-tight uppercase animate-fade-in">
                  {t.heroTitle}
                </h1>
                <p className="mt-5 text-lg md:text-xl text-primary-foreground/85 leading-relaxed max-w-xl animate-fade-in" style={{ animationDelay: '0.15s' }}>
                  {t.heroDesc}
                </p>
                <Button size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-5 text-lg font-bold shadow-lg animate-fade-in" style={{ animationDelay: '0.3s' }} asChild>
                  <Link to="/contact"><Phone className="w-5 h-5" />{t.ctaButton}</Link>
                </Button>
              </div>

              <div className="lg:w-2/5 w-full max-w-md lg:max-w-none">
                <div className="bg-black/40 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/10">
                  <QuickContactForm language={language} serviceName="Таможенный брокер" />
                </div>
              </div>
            </div>

            {/* Why cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <h3 className="sr-only">{language === 'ru' ? 'Преимущества работы с таможенным брокером ИННОВЭД' : 'Benefits of working with INNOVED customs broker'}</h3>
              {why.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="bg-black/30 backdrop-blur-md rounded-xl border border-white/15 p-4 flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary-foreground mb-1">{item.title}</p>
                      <p className="text-xs text-primary-foreground/70 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">

            {/* Who is a broker */}
            <section className="mb-16">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground">{t.whoTitle}</h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed ml-16">{t.whoText}</p>
            </section>

            {/* Services */}
            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-8">{t.servicesTitle}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {t.services.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-accent/30 transition-colors">
                    <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* When needed */}
            <section className="mb-16">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground">{t.whenTitle}</h2>
                </div>
              </div>
              <div className="space-y-3 ml-16">
                {t.whenItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                    <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Steps as Tabs */}
            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{t.stepsTitle}</h2>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="hidden md:grid w-full h-auto p-2 bg-muted/50 rounded-xl mb-8" style={{ gridTemplateColumns: `repeat(${stepIcons.length}, minmax(0, 1fr))` }}>
                  {t.steps.map((item, index) => {
                    const StepIcon = stepIcons[index].icon;
                    const tabId = stepIcons[index].id;
                    return (
                      <TabsTrigger key={tabId} value={tabId} className="flex flex-col items-center gap-2 py-4 px-2 whitespace-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-300">
                        <div className="relative">
                          <StepIcon className="w-5 h-5" />
                          <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-accent/20 text-[10px] flex items-center justify-center font-bold">{index + 1}</span>
                        </div>
                        <span className="text-xs font-medium text-center leading-tight">{item.length > 40 ? item.split(':')[0] : item}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                <TabsList className="md:hidden flex w-full overflow-x-auto gap-2 h-auto p-2 bg-muted/50 rounded-xl mb-8 scrollbar-hide">
                  {t.steps.map((_, index) => {
                    const StepIcon = stepIcons[index].icon;
                    const tabId = stepIcons[index].id;
                    return (
                      <TabsTrigger key={tabId} value={tabId} className="flex-shrink-0 flex flex-col items-center gap-1 py-3 px-3 whitespace-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-300 min-w-[70px]">
                        <StepIcon className="w-4 h-4" />
                        <span className="text-[10px] font-medium text-center leading-tight">{index + 1}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {t.steps.map((item, index) => {
                  const StepIcon = stepIcons[index].icon;
                  const tabId = stepIcons[index].id;
                  return (
                    <TabsContent key={tabId} value={tabId} className="mt-0 animate-fade-in">
                      <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-card">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                          <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-accent/10 flex items-center justify-center">
                            <StepIcon className="w-8 h-8 md:w-10 md:h-10 text-accent" />
                          </div>
                          <div className="flex-1">
                            <p className="text-2xl md:text-3xl font-bold text-foreground mb-3">{t.step} {index + 1}</p>
                            <p className="text-foreground/80 leading-relaxed">{item}</p>
                          </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-border">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{t.step} {index + 1} {t.of} {t.steps.length}</span>
                            <div className="flex gap-1">
                              {t.steps.map((_, i) => (
                                <button key={i} onClick={() => setActiveTab(stepIcons[i].id)} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === index ? 'bg-accent w-6' : i < index ? 'bg-accent/60' : 'bg-muted-foreground/30'}`} />
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

            {/* Geography by regions */}
            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-4">{t.geoTitle}</h2>
              <p className="text-muted-foreground mb-8">{t.geoDesc}</p>
              <div className="space-y-8">
                {regions.map((region) => (
                  <div key={region.name}>
                    <h3 className="text-lg font-semibold text-foreground mb-3">{region.name}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {region.slugs.map((slug) => {
                        const city = cities.find(c => c.slug === slug);
                        if (!city) return null;
                        return (
                          <Button key={slug} variant="outline" className="justify-start text-sm h-auto py-2.5 px-4 whitespace-normal text-left hover:border-accent hover:text-accent gap-2" asChild>
                            <Link to={`/tamozhennyj-broker/${slug}`}>
                              <MapPin className="w-3.5 h-3.5 shrink-0" />
                              {city.name[language]}
                            </Link>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div className="bg-accent/5 rounded-xl p-8 text-center mb-16 border border-accent/20">
              <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-4">{t.ctaTitle}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">{t.ctaText}</p>
              <Link to="/contact">
                <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Phone className="w-4 h-4" />{t.ctaButton}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
