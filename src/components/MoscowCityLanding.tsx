import { Link } from 'react-router-dom';
import { Language } from '@/contexts/LanguageContext';
import { CustomsCalculator } from '@/components/CustomsCalculator';
import { Button } from '@/components/ui/button';
import { Testimonials } from '@/components/Testimonials';
import { CaseStudies } from '@/components/CaseStudies';
import { Phone, ShieldCheck, Globe, Ship, MapPin, FileText, Calculator, Award, ClipboardList, PackageCheck, Truck } from 'lucide-react';
import { cities } from '@/data/cities';
import certBkBest from '@/assets/cert-bk-best.webp';
import certGhv from '@/assets/cert-ghv.webp';
import gallery01 from '@/assets/gallery-01.png';
import gallery03 from '@/assets/gallery-03.png';

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

const customsOffices = [
  { code: '10132000', name: 'Московская таможня', city: 'Москва', address: 'Георгиевский проспект, д. 9' },
  { code: '10001000', name: 'Внуковская таможня', city: 'Москва', address: '1-й Рейсовый пр-д, д. 2, стр. 1' },
  { code: '10002000', name: 'Домодедовская таможня', city: 'Домодедово', address: 'Территория аэропорта Домодедово, владение 1' },
  { code: '10005000', name: 'Шереметьевская таможня', city: 'Химки (Шереметьево)', address: 'Территория международного аэропорта Шереметьево, владение 1' },
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

interface MoscowCityLandingProps {
  language: Language;
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
}

export function MoscowCityLanding({ language, heroTitle, heroSubtitle, introText }: MoscowCityLandingProps) {
  const why = whyItems[language];
  const otherCities = cities.filter(c => c.slug !== 'moskva').slice(0, 15);
  const ui = language === 'ru'
    ? { contactUs: 'Оставить заявку', otherCities: 'Услуги в других городах' }
    : { contactUs: 'Submit a request', otherCities: 'Services in other cities' };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
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

      {/* Services */}
      <section className="py-16 md:py-20 bg-background">
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

      {/* Pricing */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-10 text-left">
            {language === 'ru' ? 'Стоимость наших услуг' : 'Our Service Pricing'}
          </h2>
          <div className="flex flex-col md:flex-row gap-8 items-stretch">
            <div className="md:w-1/2">
              <img src={gallery01} alt={language === 'ru' ? 'Таможенное оформление в Москве — ИННОВЭД' : 'Customs clearance in Moscow — INNOVAD'} className="w-full h-full object-cover rounded-2xl" loading="lazy" />
            </div>
            <div className="md:w-1/2 rounded-2xl bg-card border border-border p-8 flex flex-col justify-center">
              <p className="text-muted-foreground leading-relaxed mb-4">
                {language === 'ru'
                  ? 'ООО «ИННОВЭД» — ваш надежный партнер в сфере таможенного оформления в Москве. Мы предлагаем комплексные решения по подготовке и подаче всей необходимой документации, обеспечивая оперативное прохождение товаров через таможенный контроль без задержек. Наши специалисты обладают многолетним опытом в работе с самыми разными категориями грузов — от простых товарных партий до сложного технологического оборудования и многоартикульных поставок.'
                  : 'INNOVAD LLC is your reliable partner in customs clearance in Moscow. We offer comprehensive solutions for preparing and submitting all necessary documentation, ensuring fast passage of goods through customs control without delays.'}
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

      {/* Customs offices table */}
      <section className="py-16 md:py-20 bg-background">
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
                {customsOffices.map((o, i) => (
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

      {/* Cargo types */}
      <section className="py-16 md:py-20 bg-muted/30">
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
              <img src={gallery03} alt={language === 'ru' ? 'Виды грузов для таможенного оформления' : 'Cargo types for customs clearance'} className="w-full h-full object-cover rounded-2xl" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Certificates */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-10 text-left">
            {language === 'ru' ? 'Сертификаты' : 'Certificates'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border border-border bg-card">
              <img src={certBkBest} alt="Сертификат качества компании БК-БЕСТ ТЕК" className="w-48 h-auto rounded-lg shadow-sm" loading="lazy" />
              <p className="text-foreground font-medium text-center sm:text-left">
                {language === 'ru' ? 'Сертификат качества компании БК-БЕСТ ТЕК' : 'Quality certificate of BK-BEST TEK company'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border border-border bg-card">
              <img src={certGhv} alt="Сертификат качества компании GHV (Китай)" className="w-48 h-auto rounded-lg shadow-sm" loading="lazy" />
              <p className="text-foreground font-medium text-center sm:text-left">
                {language === 'ru' ? 'Сертификат качества компании GHV (Китай)' : 'Quality certificate of GHV company (China)'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials language={language} />

      {/* Case Studies */}
      <CaseStudies language={language} />

      {/* Other cities */}
      <section className="py-16 md:py-20 bg-background">
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
    </div>
  );
}
