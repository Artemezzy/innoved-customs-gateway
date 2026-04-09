import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useServiceDetail } from '@/hooks/useServiceDetail';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Phone, ArrowLeft, ShieldCheck, Scale, Globe, Zap, FileText, Search, ClipboardList, PackageCheck, Import, Upload, RefreshCw } from 'lucide-react';
import { CustomsCalculator } from '@/components/CustomsCalculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CaseStudies } from '@/components/CaseStudies';
import { Contact } from '@/components/Contact';
import { analytics } from '@/utils/analytics';
import shipBg from '@/assets/ship-bg.webp';

const whyItems = {
  ru: [
    { icon: ShieldCheck, title: 'Комплексный подход', desc: 'Закрываем весь процесс: от сбора документов до выпуска товара' },
    { icon: Scale, title: 'Знание законодательства', desc: 'Отслеживаем все изменения в таможенном регулировании' },
    { icon: Zap, title: 'Минимизация рисков', desc: 'Исключаем доначисления, штрафы и отказы в выпуске' },
    { icon: Globe, title: 'Удалённое оформление', desc: 'Работаем по всей России независимо от места нахождения груза' },
  ],
  en: [
    { icon: ShieldCheck, title: 'Comprehensive approach', desc: 'We cover the full process: from document collection to goods release' },
    { icon: Scale, title: 'Legal expertise', desc: 'We track all changes in customs regulation' },
    { icon: Zap, title: 'Risk minimization', desc: 'We eliminate additional charges, fines, and release refusals' },
    { icon: Globe, title: 'Remote processing', desc: 'We work across Russia regardless of cargo location' },
  ],
};

const procedures = {
  ru: [
    { icon: Import, title: 'Импорт', text: 'При ввозе товаров на территорию ЕАЭС мы берём на себя полный цикл таможенного оформления: от проверки документов до выпуска груза в свободное обращение.' },
    { icon: Upload, title: 'Экспорт', text: 'При вывозе товаров с территории ЕАЭС обеспечиваем корректное декларирование, валютный контроль и соблюдение экспортных ограничений.' },
    { icon: RefreshCw, title: 'Сложные режимы: транзит, переработка, временный ввоз', text: 'Оформляем грузы в специальных таможенных режимах с учётом всех особенностей законодательства и сроков.' },
  ],
  en: [
    { icon: Import, title: 'Import', text: 'When importing goods into the EAEU, we handle the full customs clearance cycle: from document review to release of goods into free circulation.' },
    { icon: Upload, title: 'Export', text: 'When exporting goods from the EAEU, we ensure correct declaration, currency control, and compliance with export restrictions.' },
    { icon: RefreshCw, title: 'Complex regimes: transit, processing, temporary import', text: 'We process goods under special customs regimes considering all legal specifics and deadlines.' },
  ],
};

const steps = {
  ru: [
    { id: 'docs', icon: ClipboardList, title: 'Подготовка и проверка документов до прибытия груза', text: 'На этом предварительном этапе специалисты тщательно анализируют внешнеторговый контракт, инвойсы и транспортные накладные, чтобы исключить малейшие неточности. Заблаговременный аудит документации позволяет вовремя запросить недостающие бумаги у поставщика и избежать дорогостоящих простоев груза на терминале.' },
    { id: 'classify', icon: Search, title: 'Классификация товаров по ТН ВЭД и сертификация', text: 'Каждому наименованию продукции подбирается точный код товарной номенклатуры, от которого напрямую зависят итоговые ставки пошлин и меры государственного контроля. Параллельно оформляются необходимые декларации или сертификаты соответствия, подтверждающие качество и безопасность ввозимого груза для потребителей.' },
    { id: 'declare', icon: FileText, title: 'Подача таможенной декларации (ДТ)', text: 'Сформированный массив данных о ввозимой или вывозимой коммерческой партии переводится в электронный формат и официально направляется в информационную систему таможенного органа. После регистрации инспектор проводит строгий документальный контроль, сверяя заявленные декларантом сведения с приложенным пакетом подтверждающих документов.' },
    { id: 'release', icon: PackageCheck, title: 'Уплата платежей и выпуск груза', text: 'Финальная стадия включает точный расчет и списание с единого лицевого счета участника ВЭД всех применимых таможенных пошлин, налогов и сборов. После успешного зачисления средств и завершения проверок декларации присваивается статус разрешенного выпуска, что дает законное право забрать товар.' },
  ],
  en: [
    { id: 'docs', icon: ClipboardList, title: 'Document preparation and review before cargo arrival', text: 'At this preliminary stage, specialists thoroughly analyze the foreign trade contract, invoices, and transport documents to eliminate any inaccuracies. Early documentation audit allows timely requests for missing papers from the supplier and avoids costly cargo delays at the terminal.' },
    { id: 'classify', icon: Search, title: 'Goods classification by HS code and certification', text: 'Each product is assigned a precise commodity nomenclature code, which directly determines final duty rates and government control measures. Simultaneously, necessary declarations or certificates of conformity are prepared, confirming the quality and safety of imported goods.' },
    { id: 'declare', icon: FileText, title: 'Customs declaration submission', text: 'The compiled data on the imported or exported commercial shipment is converted to electronic format and officially submitted to the customs authority information system. After registration, the inspector conducts strict documentary control.' },
    { id: 'release', icon: PackageCheck, title: 'Payment and cargo release', text: 'The final stage includes accurate calculation and deduction of all applicable customs duties, taxes and fees from the participant\'s single personal account. After successful crediting of funds and completion of inspections, the declaration is assigned release status.' },
  ],
};

const faqItems = {
  ru: [
    { q: 'Какие документы нужны при таможенной очистки?', a: 'Базовый пакет документов всегда включает внешнеторговый контракт, коммерческий инвойс, упаковочный лист и транспортную накладную, а необходимость разрешительных сертификатов зависит от характеристик конкретного груза.' },
    { q: 'Как безошибочно определить классификационный код ТН ВЭД?', a: 'Правильный код ТН ВЭД подбирается на основе подробного технического описания, химического состава и области применения продукции с обязательной проверкой по базе предварительных решений таможни.' },
    { q: 'Сколько времени занимает процесс проверки декларации?', a: 'Стандартный выпуск электронной декларации занимает от пары часов до одного рабочего дня, но выявление ошибок или назначение физического досмотра могут увеличить этот срок.' },
    { q: 'Можно ли оформлять груз на любом удобном таможенном посту?', a: 'Большинство товаров декларируется удаленно в центрах электронного декларирования (ЦЭД), но подакцизные, растительные или животные грузы требуют оформления на специализированных постах.' },
  ],
  en: [
    { q: 'What documents are needed for customs clearance?', a: 'The basic document package always includes a foreign trade contract, commercial invoice, packing list, and transport waybill. The need for permits and certificates depends on the specific cargo characteristics.' },
    { q: 'How to correctly determine the HS code?', a: 'The correct HS code is selected based on a detailed technical description, chemical composition, and product application area, with mandatory verification against the customs preliminary decisions database.' },
    { q: 'How long does declaration processing take?', a: 'Standard electronic declaration release takes from a couple of hours to one business day, but errors or physical inspection assignments can increase this timeframe.' },
    { q: 'Can goods be declared at any customs post?', a: 'Most goods are declared remotely at electronic declaration centers (EDC), but excisable, plant, or animal goods require processing at specialized posts.' },
  ],
};

const texts = {
  ru: {
    backToServices: 'Назад к услугам',
    contactUs: 'Оставить заявку',
    block1Title: 'Что такое таможенная очистка и почему важен профессиональный подход',
    block1Text: 'Таможенная очистка — это строго регламентированный комплекс обязательных процедур, без которых невозможно законное перемещение коммерческих грузов и транспортных средств через государственную границу. Этот процесс выступает ключевым этапом внешнеэкономической деятельности, гарантируя, что международные логистические операции проходят исключительно в рамках правового поля.',
    block1Text2: 'Для успешного прохождения всех этапов контроля участник внешнеэкономической деятельности обязан предоставить инспекторам исчерпывающий пакет сопроводительной документации. От точности и полноты предоставленных данных напрямую зависит скорость легализации продукции и её выпуск в свободное обращение.',
    proceduresTitle: 'С какими таможенными процедурами мы работаем',
    stepsTitle: 'Пошаговый алгоритм: как проходит таможенное оформление',
    casesTitle: 'Наш опыт и гарантии',
    casesSubtitle: 'Выполненные кейсы',
    faqTitle: 'Ответы на частые вопросы импортёров',
    contactTitle: 'Свяжитесь с нами',
  },
  en: {
    backToServices: 'Back to services',
    contactUs: 'Submit a request',
    block1Title: 'What is customs clearance and why a professional approach matters',
    block1Text: 'Customs clearance is a strictly regulated set of mandatory procedures without which legal movement of commercial goods across the state border is impossible. This process is a key stage of foreign economic activity, ensuring that international logistics operations proceed exclusively within the legal framework.',
    block1Text2: 'To successfully pass all control stages, the foreign trade participant must provide inspectors with a comprehensive package of accompanying documentation. The speed of product legalization and its release into free circulation directly depends on the accuracy and completeness of the data provided.',
    proceduresTitle: 'Customs procedures we handle',
    stepsTitle: 'Step-by-step algorithm: how customs processing works',
    casesTitle: 'Our experience and guarantees',
    casesSubtitle: 'Completed cases',
    faqTitle: 'Frequently asked questions from importers',
    contactTitle: 'Contact us',
  },
};

export default function TamozhennayaOchistkaPage() {
  const { language } = useLanguage();
  const { service } = useServiceDetail('tamozhennaya-ochistka');
  const t = texts[language];
  const why = whyItems[language];
  const procs = procedures[language];
  const stepsData = steps[language];
  const faq = faqItems[language];
  const [activeTab, setActiveTab] = useState(stepsData[0].id);

  useEffect(() => {
    analytics.pageView('/services/tamozhennaya-ochistka', service?.seo[language].title || 'Таможенная очистка');
  }, [language, service]);

  const pageTitle = language === 'ru'
    ? 'Таможенная очистка грузов без задержек и скрытых платежей'
    : 'Customs clearance without delays and hidden fees';

  return (
    <>
      <SEOHead
        language={language}
        page="services"
        customTitle={service?.seo[language].title}
        customDescription={service?.seo[language].description}
        customKeywords={service?.seo[language].keywords}
        canonicalPath="/services/tamozhennaya-ochistka"
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
                  {pageTitle}
                </h1>
                <p className="mt-5 text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-xl animate-fade-in" style={{ animationDelay: '0.15s' }}>
                  {service?.content[language]?.intro}
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
          <Link to="/services">
            <Button variant="outline" className="gap-2 mb-8"><ArrowLeft className="w-4 h-4" />{t.backToServices}</Button>
          </Link>

          <div className="max-w-4xl mx-auto">
            {/* BLOCK 1 */}
            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-left">{t.block1Title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{t.block1Text}</p>
              <p className="text-muted-foreground leading-relaxed mb-12">{t.block1Text2}</p>

              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-left">{t.proceduresTitle}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {procs.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-3 text-left">{p.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* BLOCK 2 — Steps slider */}
            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-left">{t.stepsTitle}</h2>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="hidden md:grid w-full h-auto p-2 bg-muted/50 rounded-xl mb-8" style={{ gridTemplateColumns: `repeat(${stepsData.length}, minmax(0, 1fr))` }}>
                  {stepsData.map((step, index) => {
                    const StepIcon = step.icon;
                    return (
                      <TabsTrigger key={step.id} value={step.id} className="flex flex-col items-center gap-2 py-4 px-2 whitespace-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-300">
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
                  {stepsData.map((step, index) => {
                    const StepIcon = step.icon;
                    return (
                      <TabsTrigger key={step.id} value={step.id} className="flex-shrink-0 flex flex-col items-center gap-1 py-3 px-3 whitespace-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-300 min-w-[70px]">
                        <StepIcon className="w-4 h-4" />
                        <span className="text-[10px] font-medium text-center leading-tight">{step.title}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {stepsData.map((step, index) => {
                  const StepIcon = step.icon;
                  return (
                    <TabsContent key={step.id} value={step.id} className="mt-0 animate-fade-in">
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
                            <span>{language === 'ru' ? 'Этап' : 'Step'} {index + 1} {language === 'ru' ? 'из' : 'of'} {stepsData.length}</span>
                            <div className="flex gap-1">
                              {stepsData.map((_, i) => (
                                <button key={i} onClick={() => setActiveTab(stepsData[i].id)} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === index ? 'bg-accent w-6' : i < index ? 'bg-accent/60' : 'bg-muted-foreground/30'}`} />
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

            {/* BLOCK 3 — Cases */}
            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-left">{t.casesTitle}</h2>
              <h3 className="text-xl font-semibold text-muted-foreground mb-6 text-left">{t.casesSubtitle}</h3>
            </section>
          </div>
        </div>

        <CaseStudies language={language} />

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* BLOCK 4 — FAQ */}
            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-left">{t.faqTitle}</h2>
              <Accordion type="single" collapsible className="w-full">
                {faq.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left">
                      <h3 className="text-base font-semibold"><span>{item.q}</span></h3>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* BLOCK 5 — Contact */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-left">{t.contactTitle}</h2>
            </section>
          </div>
        </div>

        <Contact language={language} />
      </div>
    </>
  );
}
