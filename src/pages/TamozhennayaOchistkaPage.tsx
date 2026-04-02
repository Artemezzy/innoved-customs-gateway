import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useServiceDetail } from '@/hooks/useServiceDetail';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { CheckCircle, Phone, ArrowLeft, ShieldCheck, Scale, Globe, Zap, ClipboardList, Search, FileText, ScanLine, PackageCheck } from 'lucide-react';
import { CustomsCalculator } from '@/components/CustomsCalculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { analytics } from '@/utils/analytics';
import shipBg from '@/assets/ship-bg.webp';

const pageText = {
  ru: {
    backToServices: 'Назад к услугам',
    contactUs: 'Оставить заявку',
    step: 'Шаг',
    otherServices: 'Другие услуги',
    whyItems: [
      { icon: ShieldCheck, title: 'Комплексный подход', desc: 'Закрываем весь процесс: от сбора документов до выпуска товара' },
      { icon: Scale, title: 'Знание законодательства', desc: 'Отслеживаем все изменения в таможенном регулировании' },
      { icon: Zap, title: 'Минимизация рисков', desc: 'Исключаем доначисления, штрафы и отказы в выпуске' },
      { icon: Globe, title: 'Удалённое оформление', desc: 'Работаем по всей России независимо от места нахождения груза' },
    ],
  },
  en: {
    backToServices: 'Back to services',
    contactUs: 'Submit a request',
    step: 'Step',
    otherServices: 'Other services',
    whyItems: [
      { icon: ShieldCheck, title: 'Comprehensive approach', desc: 'We cover the full process: from document collection to goods release' },
      { icon: Scale, title: 'Legal expertise', desc: 'We track all changes in customs regulation' },
      { icon: Zap, title: 'Risk minimization', desc: 'We eliminate additional charges, fines, and release refusals' },
      { icon: Globe, title: 'Remote processing', desc: 'We work across Russia regardless of cargo location' },
    ],
  },
};

const otherServices = {
  ru: [
    { slug: 'import', title: 'Таможенное оформление импорта' },
    { slug: 'export', title: 'Таможенное оформление экспорта' },
    { slug: 'certification', title: 'Сертификация и декларация соответствия' },
    { slug: 'hs-code', title: 'Определение кода ТН ВЭД' },
    { slug: 'rastamozhka-tovarov', title: 'Растаможка товаров' },
    { slug: 'rastamozhka-gruzov', title: 'Растаможка грузов' },
    { slug: 'ved-consulting', title: 'ВЭД-консалтинг' },
    { slug: 'translation', title: 'Перевод документов' },
  ],
  en: [
    { slug: 'import', title: 'Import Customs Clearance' },
    { slug: 'export', title: 'Export Customs Clearance' },
    { slug: 'certification', title: 'Certification' },
    { slug: 'hs-code', title: 'HS Code Classification' },
    { slug: 'rastamozhka-tovarov', title: 'Goods Customs Clearance' },
    { slug: 'rastamozhka-gruzov', title: 'Cargo Customs Clearance' },
    { slug: 'ved-consulting', title: 'Foreign Trade Consulting' },
    { slug: 'translation', title: 'Document Translation' },
  ],
};

const stepIcons = [
  { id: 'analysis', icon: ClipboardList },
  { id: 'classification', icon: Search },
  { id: 'declaration', icon: FileText },
  { id: 'control', icon: ScanLine },
  { id: 'release', icon: PackageCheck },
];

export default function TamozhennayaOchistkaPage() {
  const { language } = useLanguage();
  const { service } = useServiceDetail('tamozhennaya-ochistka');
  const t = pageText[language];
  const [activeTab, setActiveTab] = useState('analysis');

  useEffect(() => {
    analytics.pageView('/services/tamozhennaya-ochistka', service?.seo[language].title || 'Таможенная очистка');
  }, [language, service]);

  if (!service) return null;

  const serviceContent = service.content[language];
  if (!serviceContent) return null;

  const stepsSection = serviceContent.sections.find(s => s.steps);
  const whatYouGetSection = serviceContent.sections.find(s => s.title.includes('получаете') || s.title.includes('What'));

  return (
    <>
      <SEOHead
        language={language}
        page="services"
        customTitle={service.seo[language].title}
        customDescription={service.seo[language].description}
        customKeywords={service.seo[language].keywords}
        canonicalPath="/services/tamozhennaya-ochistka"
      />
      <div className="min-h-screen bg-background">
        {/* Hero — full-width like main hero */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <img
            src={shipBg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />

          <div className="relative z-10 container mx-auto px-4 pt-24 pb-12">
            <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-12">
              {/* Left: Title + description + CTA */}
              <div className="lg:w-3/5 flex flex-col items-start">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-primary-foreground leading-tight tracking-tight animate-fade-in">
                  {service.title[language]}
                </h1>
                <p
                  className="mt-5 text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-xl animate-fade-in"
                  style={{ animationDelay: '0.15s' }}
                >
                  {serviceContent.intro}
                </p>
                <Button
                  size="lg"
                  className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-5 text-lg font-bold shadow-lg animate-fade-in"
                  style={{ animationDelay: '0.3s' }}
                  asChild
                >
                  <Link to="/contact">
                    <Phone className="w-5 h-5" />
                    {t.contactUs}
                  </Link>
                </Button>
              </div>

              {/* Right: Calculator */}
              <div className="lg:w-2/5 w-full max-w-md lg:max-w-none">
                <div className="bg-black/40 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/10">
                  <CustomsCalculator language={language} compact />
                </div>
              </div>
            </div>

            {/* Why choose — 4 cards overlaid on the hero */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              {t.whyItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="bg-black/30 backdrop-blur-md rounded-xl border border-white/15 p-4 flex flex-col gap-3"
                  >
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
          <Link to="/services">
            <Button variant="outline" className="gap-2 mb-8">
              <ArrowLeft className="w-4 h-4" />
              {t.backToServices}
            </Button>
          </Link>

          <div className="max-w-4xl mx-auto">
            {/* Steps section — HowWeWork-style tabs */}
            {stepsSection && stepsSection.steps && (
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                  {stepsSection.title}
                </h2>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  {/* Desktop Tabs */}
                  <TabsList className="hidden md:grid w-full grid-cols-5 h-auto p-2 bg-muted/50 rounded-xl mb-8">
                    {stepsSection.steps.map((step, index) => (
                      <TabsTrigger
                        key={stepIcons[index]?.id || `step-${index}`}
                        value={stepIcons[index]?.id || `step-${index}`}
                        className="flex flex-col items-center gap-2 py-4 px-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-300"
                      >
                        <span className="text-xl">{stepIcons[index]?.iconLabel || `${index + 1}`}</span>
                        <span className="text-xs font-medium text-center leading-tight">{step.title}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Mobile Tabs */}
                  <TabsList className="md:hidden flex w-full overflow-x-auto gap-2 h-auto p-2 bg-muted/50 rounded-xl mb-8 scrollbar-hide">
                    {stepsSection.steps.map((step, index) => (
                      <TabsTrigger
                        key={stepIcons[index]?.id || `step-${index}`}
                        value={stepIcons[index]?.id || `step-${index}`}
                        className="flex-shrink-0 flex flex-col items-center gap-1 py-3 px-4 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-300"
                      >
                        <span className="text-lg">{stepIcons[index]?.iconLabel || `${index + 1}`}</span>
                        <span className="text-[10px] font-medium whitespace-nowrap">{step.title}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Content Area */}
                  {stepsSection.steps.map((step, index) => (
                    <TabsContent key={stepIcons[index]?.id || `step-${index}`} value={stepIcons[index]?.id || `step-${index}`} className="mt-0 animate-fade-in">
                      <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-card">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                          <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-accent/10 flex items-center justify-center">
                            <span className="text-3xl md:text-4xl">{stepIcons[index]?.iconLabel || `${index + 1}`}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                              {step.title}
                            </h3>
                            <p className="text-foreground/80 leading-relaxed">{step.text}</p>
                          </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-border">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{language === 'ru' ? 'Этап' : 'Step'} {index + 1} {language === 'ru' ? 'из' : 'of'} {stepsSection.steps!.length}</span>
                            <div className="flex gap-1">
                              {stepsSection.steps!.map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setActiveTab(stepIcons[i]?.id || `step-${i}`)}
                                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    i === index
                                      ? 'bg-accent w-6'
                                      : i < index
                                        ? 'bg-accent/60'
                                        : 'bg-muted-foreground/30'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}

            {/* What you get */}
            {whatYouGetSection && whatYouGetSection.items && (
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  {whatYouGetSection.title}
                </h2>
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

            {/* CTA */}
            <div className="bg-accent/5 rounded-xl p-8 text-center mt-12 border border-accent/20">
              <p className="text-lg text-foreground mb-6">{serviceContent.cta}</p>
              <Link to="/contact">
                <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Phone className="w-4 h-4" />
                  {t.contactUs}
                </Button>
              </Link>
            </div>

            {/* Other services footer */}
            <div className="mt-16 pt-8 border-t border-border">
              <h2 className="text-xl font-bold text-foreground mb-6">{t.otherServices}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {otherServices[language].map(s => (
                  <Link
                    key={s.slug}
                    to={`/services/${s.slug}`}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors duration-200 py-1"
                  >
                    → {s.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
