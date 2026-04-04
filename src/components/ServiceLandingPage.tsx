import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useServiceDetail } from '@/hooks/useServiceDetail';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { CheckCircle, Phone, ArrowLeft, ShieldCheck, Scale, Globe, Zap, Truck, Clock, ClipboardList, Search, FileText, ScanLine, PackageCheck } from 'lucide-react';
import { CustomsCalculator } from '@/components/CustomsCalculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { analytics } from '@/utils/analytics';
import shipBg from '@/assets/ship-bg.webp';
import type { LucideIcon } from 'lucide-react';

interface WhyItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface ServiceLandingPageProps {
  slug: string;
  whyItems: { ru: WhyItem[]; en: WhyItem[] };
  stepIcons?: { id: string; icon: LucideIcon }[];
}

const defaultStepIcons = [
  { id: 'step-0', icon: ClipboardList },
  { id: 'step-1', icon: Search },
  { id: 'step-2', icon: FileText },
  { id: 'step-3', icon: ScanLine },
  { id: 'step-4', icon: PackageCheck },
];

const texts = {
  ru: { backToServices: 'Назад к услугам', contactUs: 'Оставить заявку', otherServices: 'Другие услуги' },
  en: { backToServices: 'Back to services', contactUs: 'Submit a request', otherServices: 'Other services' },
};

const otherServices = {
  ru: [
    { slug: 'import', title: 'Таможенное оформление импорта' },
    { slug: 'export', title: 'Таможенное оформление экспорта' },
    { slug: 'certification', title: 'Сертификация и декларация соответствия' },
    { slug: 'hs-code', title: 'Определение кода ТН ВЭД' },
    { slug: 'rastamozhka-tovarov', title: 'Растаможка товаров' },
    { slug: 'rastamozhka-gruzov', title: 'Растаможка грузов' },
    { slug: 'tamozhennaya-ochistka', title: 'Таможенная очистка' },
    { slug: 'ved-consulting', title: 'ВЭД-консалтинг' },
  ],
  en: [
    { slug: 'import', title: 'Import Customs Clearance' },
    { slug: 'export', title: 'Export Customs Clearance' },
    { slug: 'certification', title: 'Certification' },
    { slug: 'hs-code', title: 'HS Code Classification' },
    { slug: 'rastamozhka-tovarov', title: 'Goods Customs Clearance' },
    { slug: 'rastamozhka-gruzov', title: 'Cargo Customs Clearance' },
    { slug: 'tamozhennaya-ochistka', title: 'Customs Clearance' },
    { slug: 'ved-consulting', title: 'Foreign Trade Consulting' },
  ],
};

export default function ServiceLandingPage({ slug, whyItems, stepIcons = defaultStepIcons }: ServiceLandingPageProps) {
  const { language } = useLanguage();
  const { service } = useServiceDetail(slug);
  const t = texts[language];
  const [activeTab, setActiveTab] = useState(stepIcons[0]?.id || 'step-0');

  useEffect(() => {
    analytics.pageView(`/services/${slug}`, service?.seo[language].title || slug);
  }, [language, service, slug]);

  if (!service) return null;
  const serviceContent = service.content[language];
  if (!serviceContent) return null;

  const stepsSection = serviceContent.sections.find(s => s.steps);
  const whatYouGetSection = serviceContent.sections.find(s => s.title.includes('получаете') || s.title.includes('What'));
  const why = whyItems[language];
  const filteredOtherServices = otherServices[language].filter(s => s.slug !== slug);

  return (
    <>
      <SEOHead
        language={language}
        page="services"
        customTitle={service.seo[language].title}
        customDescription={service.seo[language].description}
        customKeywords={service.seo[language].keywords}
        canonicalPath={`/services/${slug}`}
      />
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <img src={shipBg} alt="" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />

          <div className="relative z-10 container mx-auto px-4 pt-24 pb-12">
            <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-12">
              <div className="lg:w-3/5 flex flex-col items-start">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-primary-foreground leading-tight tracking-tight animate-fade-in">
                  {service.title[language]}
                </h1>
                <p className="mt-5 text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-xl animate-fade-in" style={{ animationDelay: '0.15s' }}>
                  {serviceContent.intro}
                </p>
                <Button size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-5 text-lg font-bold shadow-lg animate-fade-in" style={{ animationDelay: '0.3s' }} asChild>
                  <Link to="/contact"><Phone className="w-5 h-5" />{t.contactUs}</Link>
                </Button>
              </div>

              <div className="lg:w-2/5 w-full max-w-md lg:max-w-none">
                <div className="bg-black/40 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/10">
                  <CustomsCalculator language={language} compact />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <h3 className="sr-only">{language === 'ru' ? 'Преимущества работы с ИННОВЭД и этапы оказания услуги' : 'Benefits of working with INNOVED and service stages'}</h3>
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

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <Link to="/services">
            <Button variant="outline" className="gap-2 mb-8"><ArrowLeft className="w-4 h-4" />{t.backToServices}</Button>
          </Link>

          <div className="max-w-4xl mx-auto">
            {stepsSection && stepsSection.steps && (
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{service.title[language]}: {language === 'ru' ? 'этапы, преимущества и смежные услуги' : 'stages, benefits and related services'}</h2>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="hidden md:grid w-full h-auto p-2 bg-muted/50 rounded-xl mb-8" style={{ gridTemplateColumns: `repeat(${stepsSection.steps.length}, minmax(0, 1fr))` }}>
                    {stepsSection.steps.map((step, index) => {
                      const StepIcon = stepIcons[index]?.icon || ClipboardList;
                      const tabId = stepIcons[index]?.id || `step-${index}`;
                      return (
                        <TabsTrigger key={tabId} value={tabId} className="flex flex-col items-center gap-2 py-4 px-2 whitespace-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-300">
                          <div className="relative">
                            <StepIcon className="w-5 h-5" />
                            <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-accent/20 text-[10px] flex items-center justify-center font-bold">{index + 1}</span>
                          </div>
                          <span className="text-xs font-medium text-center leading-tight">{step.title}</span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  <TabsList className="md:hidden flex w-full overflow-x-auto gap-2 h-auto p-2 bg-muted/50 rounded-xl mb-8 scrollbar-hide">
                    {stepsSection.steps.map((step, index) => {
                      const StepIcon = stepIcons[index]?.icon || ClipboardList;
                      const tabId = stepIcons[index]?.id || `step-${index}`;
                      return (
                        <TabsTrigger key={tabId} value={tabId} className="flex-shrink-0 flex flex-col items-center gap-1 py-3 px-3 whitespace-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-300 min-w-[70px]">
                          <StepIcon className="w-4 h-4" />
                          <span className="text-[10px] font-medium text-center leading-tight">{step.title}</span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  {stepsSection.steps.map((step, index) => {
                    const StepIcon = stepIcons[index]?.icon || ClipboardList;
                    const tabId = stepIcons[index]?.id || `step-${index}`;
                    return (
                      <TabsContent key={tabId} value={tabId} className="mt-0 animate-fade-in">
                        <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-card">
                          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                            <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-accent/10 flex items-center justify-center">
                              <StepIcon className="w-8 h-8 md:w-10 md:h-10 text-accent" />
                            </div>
                            <div className="flex-1">
                              <p className="text-2xl md:text-3xl font-bold text-foreground mb-3">{step.title}</p>
                              <p className="text-foreground/80 leading-relaxed">{step.text}</p>
                            </div>
                          </div>
                          <div className="mt-8 pt-6 border-t border-border">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>{language === 'ru' ? 'Этап' : 'Step'} {index + 1} {language === 'ru' ? 'из' : 'of'} {stepsSection.steps!.length}</span>
                              <div className="flex gap-1">
                                {stepsSection.steps!.map((_, i) => (
                                  <button key={i} onClick={() => setActiveTab(stepIcons[i]?.id || `step-${i}`)} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === index ? 'bg-accent w-6' : i < index ? 'bg-accent/60' : 'bg-muted-foreground/30'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </div>
            )}

            {whatYouGetSection && whatYouGetSection.items && (
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{whatYouGetSection.title}</h2>
                <ul className="space-y-4">
                  {whatYouGetSection.items.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-accent/5 rounded-xl p-8 text-center mt-12 border border-accent/20">
              <p className="text-lg text-foreground mb-6">{serviceContent.cta}</p>
              <Link to="/contact">
                <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"><Phone className="w-4 h-4" />{t.contactUs}</Button>
              </Link>
            </div>

            <div className="mt-16 pt-8 border-t border-border">
              <h2 className="text-xl font-bold text-foreground mb-6">{t.otherServices}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {filteredOtherServices.map(s => (
                  <Button key={s.slug} variant="outline" className="justify-start text-sm h-auto py-2.5 px-4 whitespace-normal text-left hover:border-accent hover:text-accent" asChild>
                    <Link to={`/services/${s.slug}`}>{s.title}</Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
