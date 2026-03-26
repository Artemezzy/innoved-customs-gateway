import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Language } from '@/contexts/LanguageContext';
import caseZapchasti from '@/assets/case-zapchasti.webp';

interface CaseItem {
  image: string;
  imageAlt: string;
  link: string;
  magnetText: { ru: string; en: string };
  title: { ru: string; en: string };
}

const cases: CaseItem[] = [
  {
    image: caseZapchasti,
    imageAlt: 'Таможенное оформление автозапчастей — кейс ИННОВЭД',
    link: '/rastamojka-zapchastey',
    title: {
      ru: 'Растаможка автозапчастей',
      en: 'Auto Parts Customs Clearance',
    },
    magnetText: {
      ru: '«Сократили срок таможенного оформления автозапчастей с 5–7 до 2 дней и снизили дополнительные расходы на 18% для оптового поставщика. Настроим такую же схему под ваши поставки.»',
      en: '"We reduced auto parts customs clearance from 5–7 to 2 days and cut additional costs by 18% for a wholesale supplier. We\'ll set up the same process for your shipments."',
    },
  },
];

const sectionTitle = {
  ru: 'Наши кейсы',
  en: 'Our Cases',
};

const readMore = {
  ru: 'Подробнее →',
  en: 'Read more →',
};

interface CaseStudiesProps {
  language: Language;
}

export function CaseStudies({ language }: CaseStudiesProps) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? cases.length - 1 : c - 1));
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c === cases.length - 1 ? 0 : c + 1));
  }, []);

  const caseItem = cases[current];

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

          <Link
            to={caseItem.link}
            className="block rounded-2xl overflow-hidden bg-background border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left: image */}
              <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[320px] overflow-hidden">
                <img
                  src={caseItem.image}
                  alt={caseItem.imageAlt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Right: magnet text */}
              <div className="flex flex-col justify-center p-6 md:p-10">
                <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {sectionTitle[language]}
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 text-left" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {caseItem.title[language]}
                </h3>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
                  {caseItem.magnetText[language]}
                </p>
                <span className="text-primary font-semibold text-base hover:underline">
                  {readMore[language]}
                </span>
              </div>
            </div>
          </Link>

          {/* Dots */}
          {cases.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {cases.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
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
