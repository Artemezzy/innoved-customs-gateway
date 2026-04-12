import { Link } from 'react-router-dom';
import { Language } from '@/contexts/LanguageContext';
import { CustomsCalculator } from '@/components/CustomsCalculator';
import { Button } from '@/components/ui/button';
import { CaseStudies } from '@/components/CaseStudies';
import { Phone, ShieldCheck, Globe, Ship, MapPin, FileText, Calculator, Award, ClipboardList, PackageCheck, Truck, Star } from 'lucide-react';
import { cities } from '@/data/cities';
import { customsOfficesByCity } from '@/data/customs-offices';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Autoplay from 'embla-carousel-autoplay';
import { useRef, useState } from 'react';
import certBkBest from '@/assets/cert-bk-best.webp';
import certGhv from '@/assets/cert-ghv.webp';
import gallery01 from '@/assets/gallery-01.png';
import gallery03 from '@/assets/gallery-03.png';
import victoriaPhoto from '@/assets/testimonial-victoria.webp';
import svetlanaPhoto from '@/assets/testimonial-svetlana.webp';
import bairPhoto from '@/assets/testimonial-bair.webp';
import alexanderPhoto from '@/assets/testimonial-alexander.webp';

const testimonials = [
  { name: { ru: 'Александр М.', en: 'Alexander M.' }, company: { ru: 'ООО "ТСЛОГИСТИКА"', en: 'TSLOGISTIKA LLC' }, text: { ru: 'Работаем с ИННОВЭД с лета 2025 года. Всегда быстрое оформление документов и профессиональный подход.', en: 'Working with INNOVAD since summer 2025. Always quick processing and professional approach.' }, initials: 'АМ', rating: 5, photo: alexanderPhoto },
  { name: { ru: 'Виктория С.', en: 'Victoria S.' }, company: { ru: 'ИП Староспичихина В.', en: 'IE Starospichihina V.' }, text: { ru: 'Очень удобно работать дистанционно — всё решается оперативно через мессенджеры.', en: 'Very convenient to work remotely — everything resolved via messengers.' }, initials: 'ВС', rating: 5, photo: victoriaPhoto },
  { name: { ru: 'Светлана К.', en: 'Светлана К.' }, company: { ru: 'ООО "Мебельный Мир"', en: 'Furniture World LLC' }, text: { ru: 'Грамотные специалисты, помогли с сертификацией и оформлением сложного груза.', en: 'Competent specialists, helped with certification and clearance of complex cargo.' }, initials: 'СК', rating: 5, photo: svetlanaPhoto },
  { name: { ru: 'Баир Д.', en: 'Bair D.' }, company: { ru: 'ООО "ВостокТрейд"', en: 'VostokTrade LLC' }, text: { ru: 'Надёжный партнёр для ВЭД. Быстро решают любые вопросы с таможней.', en: 'Reliable FTA partner. Quickly resolve any customs issues.' }, initials: 'БД', rating: 5, photo: bairPhoto },
];

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

const services = [
  { icon: Ship, text: { ru: 'Таможенное оформление экспорта при вывозе товаров с территории ЕАЭС', en: 'Export customs clearance for goods leaving the EAEU territory' } },
  { icon: PackageCheck, text: { ru: 'Таможенное оформление импорта при ввозе товаров с территории ЕАЭС', en: 'Import customs clearance for goods entering the EAEU territory' } },
  { icon: ClipboardList, text: { ru: 'Консультация по вопросам ВЭД', en: 'Foreign trade consulting' } },
  { icon: Calculator, text: { ru: 'Рассчёт таможенных платежей', en: 'Customs duty calculation' } },
  { icon: Award, text: { ru: 'Подготовка сертификатов и деклараций соответствия', en: 'Preparation of certificates and declarations of conformity' } },
  { icon: FileText, text: { ru: 'Подготовка товаросопроводительных документов', en: 'Preparation of shipping documents' } },
];

const cargoTypes = [
  'Продукты питания', 'Электроника', 'Мебель и фурнитура', 'Бытовая техника',
  'Промышленное оборудование', 'Станки', 'Сборные', 'Контейнерные',
  'Генеральные', 'Одежда', 'Автозапчасти',
];

const cargoTypesEn = [
  'Food products', 'Electronics', 'Furniture & fittings', 'Household appliances',
  'Industrial equipment', 'Machine tools', 'Consolidated', 'Containerized',
  'General cargo', 'Clothing', 'Auto parts',
];

const cityPrepositional: Record<string, string> = {
  'barnaul': 'Барнауле', 'vladivostok': 'Владивостоке', 'volgograd': 'Волгограде',
  'voronezh': 'Воронеже', 'ekaterinburg': 'Екатеринбурге', 'izhevsk': 'Ижевске',
  'irkutsk': 'Иркутске', 'kazan': 'Казани', 'krasnodar': 'Краснодаре',
  'krasnoyarsk': 'Красноярске', 'makhachkala': 'Махачкале', 'moskva': 'Москве',
  'nakhodka': 'Находке', 'nizhny-novgorod': 'Нижнем Новгороде', 'novorossiysk': 'Новороссийске',
  'novosibirsk': 'Новосибирске', 'omsk': 'Омске', 'rostov-na-donu': 'Ростове-на-Дону',
  'samara': 'Самаре', 'sankt-peterburg': 'Санкт-Петербурге', 'saratov': 'Саратове',
  'tolyatti': 'Тольятти', 'tyumen': 'Тюмени', 'ulyanovsk': 'Ульяновске',
  'khabarovsk': 'Хабаровске', 'chelyabinsk': 'Челябинске', 'yaroslavl': 'Ярославле',
  'zabaykalsk': 'Забайкальске',
};

interface CityCustomLandingProps {
  language: Language;
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  citySlug: string;
}

export function CityCustomLanding({ language, heroTitle, heroSubtitle, introText, citySlug }: CityCustomLandingProps) {
  const why = whyItems[language];
  const autoplayPlugin = useRef(Autoplay({ delay: 7000, stopOnInteraction: true, stopOnMouseEnter: true }));
  const [zoomedCert, setZoomedCert] = useState<string | null>(null);
  const otherCities = cities.filter(c => c.slug !== citySlug).slice(0, 15);
  const offices = customsOfficesByCity[citySlug] || [];
  const cityPrep = cityPrepositional[citySlug] || '';
  const ui = language === 'ru'
    ? { contactUs: 'Оставить заявку', otherCities: 'Услуги в других городах' }
    : { contactUs: 'Submit a request', otherCities: 'Services in other cities' };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <img src="/images/port-bg.webp" alt="" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        <div className="relative z-10 container mx-auto px-4 pt-24 pb-12">
          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-12">
            <div className="lg:w-3/5 flex flex-col items-start">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-primary-foreground leading-tight tracking-tight animate-fade-in">
                {heroTitle}
              </h1>
              <p className="mt-3 text-xl md:text-2xl text-primary-foreground/90 font-medium animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {heroSubtitle}
              </p>
              <p className="mt-5 text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-xl animate-fade-in" style={{ animationDelay: '0.15s' }}>
                {introText}
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
                    <p className="text-sm font-bold text-primary-foreground mb-1">{item.title}</p>
                    <p className="text-xs text-primary-foreground/70 leading-snug">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-10 text-left">
            {language === 'ru' ? 'Услуги компании ООО «ИННОВЭД»' : 'INNOVAD LLC Services'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="p-6 rounded-2xl border border-border bg-card hover:border-accent hover:shadow-lg transition-all duration-300 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <p className="text-foreground font-medium leading-snug">{s.text[language]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-10 text-left">
            {language === 'ru' ? 'Стоимость наших услуг' : 'Our Service Pricing'}
          </h2>
          <div className="flex flex-col md:flex-row gap-8 items-stretch">
            <div className="md:w-1/2">
              <img src={gallery01} alt={language === 'ru' ? `Таможенное оформление в ${cityPrep} — ИННОВЭД` : `Customs clearance — INNOVAD`} className="w-full rounded-2xl" loading="lazy" />
            </div>
            <div className="md:w-1/2 rounded-2xl bg-card border border-border p-8 flex flex-col justify-center">
              <p className="text-muted-foreground leading-relaxed mb-4">
                {language === 'ru'
                  ? `ООО «ИННОВЭД» — ваш надежный партнер в сфере таможенного оформления в ${cityPrep}. Мы предлагаем комплексные решения по подготовке и подаче всей необходимой документации, обеспечивая оперативное прохождение товаров через таможенный контроль без задержек. Наши специалисты обладают многолетним опытом в работе с самыми разными категориями грузов — от простых товарных партий до сложного технологического оборудования и многоартикульных поставок.`
                  : `INNOVAD LLC is your reliable partner in customs clearance. We offer comprehensive solutions for preparing and submitting all necessary documentation, ensuring fast passage of goods through customs control without delays.`}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {language === 'ru'
                  ? 'Мы ценим время и интересы наших клиентов, поэтому предлагаем прозрачные и гибкие тарифы, рассчитанные под конкретные задачи вашего бизнеса. При большом объеме поставок предоставляются индивидуальные условия, а также выгодные скидки на оформление деклараций. Для постоянных клиентов действует программа лояльности, которая позволяет получать дополнительные привилегии и экономить при регулярном сотрудничестве.'
                  : 'We value our clients\' time and interests, offering transparent and flexible tariffs tailored to your specific business needs. Volume discounts and loyalty programs are available for regular clients.'}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {language === 'ru'
                  ? 'Выбирая «ИННОВЭД», вы получаете гарантированное качество услуг, персональное сопровождение на каждом этапе взаимодействия и уверенность в том, что ваш груз пройдет все таможенные процедуры корректно и в срок. Доверьте нам решение формальных вопросов — и сосредоточьтесь на развитии вашего бизнеса, а мы обеспечим бесперебойное движение ваших товаров через границу.'
                  : 'By choosing INNOVAD, you get guaranteed service quality, personal support at every stage, and confidence that your cargo will pass all customs procedures correctly and on time.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {offices.length > 0 && (
        <section className="py-10 md:py-14 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-10 text-left">
              {language === 'ru' ? 'С какими таможнями мы работаем' : 'Customs offices we work with'}
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-6 py-4 text-sm font-semibold text-foreground">{language === 'ru' ? 'Код' : 'Code'}</th>
                    <th className="px-6 py-4 text-sm font-semibold text-foreground">{language === 'ru' ? 'Название' : 'Name'}</th>
                    <th className="px-6 py-4 text-sm font-semibold text-foreground">{language === 'ru' ? 'Город' : 'City'}</th>
                    <th className="px-6 py-4 text-sm font-semibold text-foreground">{language === 'ru' ? 'Адрес' : 'Address'}</th>
                  </tr>
                </thead>
                <tbody>
                  {offices.map((o, i) => (
                    <tr key={o.code} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/20'}>
                      <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{o.code}</td>
                      <td className="px-6 py-4 text-sm text-foreground font-medium">{o.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{o.city}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{o.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <section className="py-10 md:py-14 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-10 text-left">
            {language === 'ru' ? 'Виды грузов' : 'Cargo Types'}
          </h2>
          <div className="flex flex-col md:flex-row gap-8 items-stretch">
            <div className="md:w-1/2 rounded-2xl bg-card border border-border p-8 flex flex-col justify-center">
              <ul className="space-y-3">
                {(language === 'ru' ? cargoTypes : cargoTypesEn).map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Truck className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2">
              <img src={gallery03} alt={language === 'ru' ? 'Виды грузов для таможенного оформления' : 'Cargo types for customs clearance'} className="w-full rounded-2xl" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
              <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-6 text-left">
                {language === 'ru' ? 'Сертификаты' : 'Certificates'}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-border bg-card">
                  <img src={certBkBest} alt="Сертификат качества компании БК-БЕСТ ТЕК" className="w-36 h-auto rounded-lg shadow-sm cursor-pointer transition-transform duration-300 hover:scale-110" loading="lazy" onClick={() => setZoomedCert(certBkBest)} />
                  <p className="text-foreground font-medium text-center sm:text-left text-sm">
                    {language === 'ru' ? 'Сертификат качества компании БК-БЕСТ ТЕК' : 'Quality certificate of BK-BEST TEK company'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-border bg-card">
                  <img src={certGhv} alt="Сертификат качества компании GHV (Китай)" className="w-36 h-auto rounded-lg shadow-sm cursor-pointer transition-transform duration-300 hover:scale-110" loading="lazy" onClick={() => setZoomedCert(certGhv)} />
                  <p className="text-foreground font-medium text-center sm:text-left text-sm">
                    {language === 'ru' ? 'Сертификат качества компании GHV (Китай)' : 'Quality certificate of GHV company (China)'}
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-6 text-left">
                {language === 'ru' ? 'Отзывы клиентов' : 'Client Testimonials'}
              </h2>
              <Carousel opts={{ align: 'center', loop: true }} plugins={[autoplayPlugin.current]} className="w-full">
                <CarouselContent>
                  {testimonials.map((t, i) => (
                    <CarouselItem key={i}>
                      <Card className="bg-card shadow-sm border border-border">
                        <CardContent className="p-5">
                          <div className="flex gap-1 mb-3">
                            {Array.from({ length: t.rating }).map((_, j) => (
                              <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <blockquote className="text-sm text-foreground mb-4 leading-relaxed">
                            "{t.text[language]}"
                          </blockquote>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 bg-primary">
                              {t.photo && <AvatarImage src={t.photo} alt={t.name.ru} className="object-cover" />}
                              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">{t.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-foreground text-sm">{t.name[language]}</div>
                              <div className="text-xs text-muted-foreground">{t.company[language]}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-6 text-left">
            {language === 'ru' ? 'Наши кейсы' : 'Our Case Studies'}
          </h2>
          <CaseStudies language={language} />
        </div>
      </section>

      <section className="py-10 md:py-14 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-10 text-left">
            {ui.otherCities}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {otherCities.map(c => (
              <Button key={c.slug} variant="outline" className="text-sm h-auto py-3 px-4 whitespace-normal text-center hover:border-accent hover:text-accent" asChild>
                <Link to={`/tamozhennyj-broker/${c.slug}`}>{c.name[language]}</Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!zoomedCert} onOpenChange={() => setZoomedCert(null)}>
        <DialogContent className="max-w-2xl p-2 bg-background">
          {zoomedCert && <img src={zoomedCert} alt="Сертификат" className="w-full h-auto rounded-lg" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
