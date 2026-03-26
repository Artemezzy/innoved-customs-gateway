import { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Language } from '@/contexts/LanguageContext';
import caseTech from '@/assets/case-tech.webp';
import caseZapchasti from '@/assets/case-zapchasti.webp';
import caseDress from '@/assets/case-dress.webp';
import caseOborud from '@/assets/case-oborud.webp';

interface CaseItem {
  image: string;
  imageAlt: string;
  link: string;
  magnetText: { ru: string; en: string };
  title: { ru: string; en: string };
}

const cases: CaseItem[] = [
  {
    image: caseTech,
    imageAlt: 'Таможенное оформление бытовой техники — кейс ИННОВЭД',
    link: '/rastamojka-tehniki',
    title: { ru: 'Растаможка техники', en: 'Appliance Customs Clearance' },
    magnetText: {
      ru: '«Холодильники и стиральные машины уже проданы в розницу, а их партию держит таможня из\u2011за вопросов к EAC и маркировке? В нашем кейсе мы перевели клиента из режима постоянных блокировок в стабильные поставки без остановок, с прогнозируемыми сроками и понятными расходами. Посмотрите, как устроено решение.»',
      en: '"Refrigerators and washing machines already sold to retail, but customs is holding the shipment over EAC and labeling questions? In our case study, we moved the client from constant blocks to stable deliveries with predictable timelines and clear costs. See how the solution works."',
    },
  },
  {
    image: caseZapchasti,
    imageAlt: 'Таможенное оформление автозапчастей — кейс ИННОВЭД',
    link: '/rastamojka-zapchastey',
    title: { ru: 'Растаможка запчастей', en: 'Auto Parts Customs Clearance' },
    magnetText: {
      ru: '«Сократили срок таможенного оформления автозапчастей с 5–7 до 2 дней и снизили дополнительные расходы на 18% для оптового поставщика. Настроим такую же схему под ваши поставки.»',
      en: '"We reduced auto parts customs clearance from 5–7 to 2 days and cut additional costs by 18% for a wholesale supplier. We\'ll set up the same process for your shipments."',
    },
  },
  {
    image: caseDress,
    imageAlt: 'Таможенное оформление одежды из Турции — кейс ИННОВЭД',
    link: '/rastamojka-odejdi',
    title: { ru: 'Растаможка одежды из Турции', en: 'Turkish Clothing Customs Clearance' },
    magnetText: {
      ru: '«Другие брокеры отказывались растамаживать нашу партию одежды из Турции или предлагали завышенные тарифы. Мы приняли проект в исходном виде, оформили поставку за 3 дня и снизили стоимость услуг до 22% относительно их предложений. Узнайте, как мы можем оформить вашу турецкую одежду на таких же условиях.»',
      en: '"Other brokers refused to clear our Turkish clothing shipment or offered inflated tariffs. We accepted the project as-is, completed clearance in 3 days and reduced service costs by up to 22% compared to their quotes. Learn how we can handle your Turkish clothing on the same terms."',
    },
  },
  {
    image: caseOborud,
    imageAlt: 'Таможенное оформление технологического оборудования — кейс ИННОВЭД',
    link: '/rastamojka-oborudovaniya',
    title: { ru: 'Растаможка оборудования', en: 'Equipment Customs Clearance' },
    magnetText: {
      ru: '«Контрагенты не успевают, оборудование простаивает на СВХ, сроки проекта "плывут"? Мы показали, как превратить 10–14 дней ожидания в стабильные 1–2 дня выпуска. Ознакомьтесь с кейсом по технологическому оборудованию.»',
      en: '"Contractors falling behind, equipment stuck at temporary storage, project deadlines slipping? We showed how to turn 10–14 days of waiting into stable 1–2 day releases. See our industrial equipment case study."',
    },
  },
];

const sectionTitle = { ru: 'Наши кейсы', en: 'Our Cases' };
const readMore = { ru: 'Подробнее →', en: 'Read more →' };

const AUTO_INTERVAL = 7 * 60 * 1000; // 7 minutes
const FREEZE_DURATION = 15 * 1000;   // 15 seconds

interface CaseStudiesProps {
  language: Language;
}

export function CaseStudies({ language }: CaseStudiesProps) {
  const [current, setCurrent] = useState(0);
  const [frozen, setFrozen] = useState(false);
  const freezeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleUserInteraction = useCallback(() => {
    setFrozen(true);
    if (freezeTimer.current) clearTimeout(freezeTimer.current);
    freezeTimer.current = setTimeout(() => setFrozen(false), FREEZE_DURATION);
  }, []);

  const prev = useCallback(() => {
    handleUserInteraction();
    setCurrent((c) => (c === 0 ? cases.length - 1 : c - 1));
  }, [handleUserInteraction]);

  const next = useCallback(() => {
    handleUserInteraction();
    setCurrent((c) => (c === cases.length - 1 ? 0 : c + 1));
  }, [handleUserInteraction]);

  const goTo = useCallback((i: number) => {
    handleUserInteraction();
    setCurrent(i);
  }, [handleUserInteraction]);

  // Auto-play
  useEffect(() => {
    if (frozen || cases.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((c) => (c === cases.length - 1 ? 0 : c + 1));
    }, AUTO_INTERVAL);
    return () => clearInterval(id);
  }, [frozen]);

  // Cleanup freeze timer
  useEffect(() => {
    return () => { if (freezeTimer.current) clearTimeout(freezeTimer.current); };
  }, []);

  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Navigation arrows */}
          {cases.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-accent transition-colors"
                aria-label="Previous case"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-accent transition-colors"
                aria-label="Next case"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </>
          )}

          {/* Fixed-height card container */}
          <div className="rounded-2xl overflow-hidden bg-background border border-border shadow-sm hover:shadow-md transition-shadow">
            <Link to={cases[current].link} className="block">
              <div className="grid grid-cols-1 md:grid-cols-2 md:min-h-[400px]">
                {/* Left: image — fixed height */}
                <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[400px] overflow-hidden">
                  {cases.map((c, i) => (
                    <img
                      key={c.link}
                      src={c.image}
                      alt={c.imageAlt}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                        i === current ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
                </div>

                {/* Right: magnet text — fixed min-height */}
                <div className="relative min-h-[280px] md:min-h-[400px]">
                  {cases.map((c, i) => (
                    <div
                      key={c.link}
                      className={`absolute inset-0 flex flex-col justify-center p-6 md:p-10 transition-opacity duration-500 ${
                        i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {sectionTitle[language]}
                      </p>
                      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 text-left" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {c.title[language]}
                      </h3>
                      <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
                        {c.magnetText[language]}
                      </p>
                      <span className="text-primary font-semibold text-base hover:underline">
                        {readMore[language]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </div>

          {/* Dots */}
          {cases.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {cases.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === current ? 'bg-primary' : 'bg-border'
                  }`}
                  aria-label={`Case ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
