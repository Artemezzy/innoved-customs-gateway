import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Language } from '@/contexts/LanguageContext';

const slides = [
  { src: '/gallery/slide-01.webp', subtitle: { ru: 'в одежде и текстильной продукции', en: 'in clothing and textiles' } },
  { src: '/gallery/slide-02.webp', subtitle: { ru: 'в косметических товарах', en: 'in cosmetic products' } },
  { src: '/gallery/slide-03.webp', subtitle: { ru: 'в автозапчастях и комплектующих', en: 'in auto parts and components' } },
  { src: '/gallery/slide-04.webp', subtitle: { ru: 'в электронике и бытовой технике', en: 'in electronics and home appliances' } },
  { src: '/gallery/slide-05.webp', subtitle: { ru: 'в товарах химической отрасли', en: 'in chemical industry products' } },
];

const content = {
  ru: {
    promoTitle: '-50% на первое оформление',
    promoSubtitle: 'особые условия · по промокоду NOW',
    promoDateLabel: 'Дата окончания\nпрограммы',
    promoButton: 'Заказать',
    telegramTitle: 'Запустили\nтелеграм-канал',
    telegramDesc: 'Тут мы делимся лайф-хаками, экспертизой и другой полезной информацией',
    offerTitle: 'Актуализировали\nусловия',
    offerDesc: 'Самые лучшие цены на рынке и программа лояльности',
    slideHeading: 'У НАС БОЛЬШАЯ ЭКСПЕРТИЗА',
    timerDays: 'дней',
    timerHours: 'часов',
    timerMin: 'мин.',
    timerSec: 'сек.',
  },
  en: {
    promoTitle: '-50% on first order',
    promoSubtitle: 'special conditions · promo code NOW',
    promoDateLabel: 'Program\nend date',
    promoButton: 'Order now',
    telegramTitle: 'We launched\na Telegram channel',
    telegramDesc: 'Here we share life hacks, expertise and other useful information',
    offerTitle: 'Updated\nour terms',
    offerDesc: 'Best prices on the market and a loyalty program',
    slideHeading: 'WE HAVE GREAT EXPERTISE',
    timerDays: 'days',
    timerHours: 'hours',
    timerMin: 'min.',
    timerSec: 'sec.',
  },
};

function CountdownTimer({ language }: { language: Language }) {
  const getDuration = () => {
    const key = 'promo_timer';
    const stored = localStorage.getItem(key);
    if (stored) {
      const { start, duration } = JSON.parse(stored);
      const elapsed = Date.now() - start;
      if (elapsed < duration) return { start, duration };
    }
    const duration = (2 + Math.random()) * 60 * 60 * 1000; // 2–3 hours
    const entry = { start: Date.now(), duration };
    localStorage.setItem(key, JSON.stringify(entry));
    return entry;
  };

  const getRemaining = () => {
    const { start, duration } = getDuration();
    const left = duration - (Date.now() - start);
    return left > 0 ? left : (() => { localStorage.removeItem('promo_timer'); return getDuration().duration; })();
  };

  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const totalSec = Math.floor(remaining / 1000);
  const dd = String(Math.floor(totalSec / 86400)).padStart(2, '0');
  const hh = String(Math.floor((totalSec % 86400) / 3600)).padStart(2, '0');
  const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  const ss = String(totalSec % 60).padStart(2, '0');

  const t = content[language];
  const units = [
    { value: dd, label: t.timerDays },
    { value: hh, label: t.timerHours },
    { value: mm, label: t.timerMin },
    { value: ss, label: t.timerSec },
  ];

  return (
    <div className="flex gap-2 sm:gap-3 mt-1">
      {units.map((u, i) => (
        <div key={i} className="flex flex-col items-center">
          <span className="font-montserrat font-bold text-accent-foreground text-base sm:text-xl md:text-2xl tabular-nums">
            {u.value}
          </span>
          <span className="font-montserrat text-accent-foreground/70 text-[8px] sm:text-[10px] md:text-xs">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}

interface InfoBlocksProps {
  language: Language;
}

export function InfoBlocks({ language }: InfoBlocksProps) {
  const t = content[language];
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetAutoplay = useCallback((delay = 7000) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, delay);
  }, []);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
    resetAutoplay();
  }, [resetAutoplay]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    resetAutoplay();
  }, [resetAutoplay]);

  useEffect(() => {
    resetAutoplay(6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetAutoplay]);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            {/* Block 1 — promo banner */}
            <div className="w-full aspect-[3/2] sm:aspect-[2/1] rounded-2xl bg-accent flex flex-col items-start justify-between text-left px-5 py-4 md:px-8 md:py-6">
              <div>
                <h3 className="font-montserrat font-bold text-accent-foreground text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight">
                  {t.promoTitle}
                </h3>
                <p className="font-montserrat text-accent-foreground/80 text-xs sm:text-sm mt-1">
                  {t.promoSubtitle}
                </p>
              </div>
              <div className="flex items-end gap-3">
                <p className="font-montserrat text-accent-foreground/80 text-[10px] sm:text-xs leading-tight whitespace-pre-line">
                  {t.promoDateLabel}
                </p>
                <CountdownTimer language={language} />
              </div>
              <a
                href="/contact"
                className="inline-block font-montserrat font-bold text-accent bg-accent-foreground hover:bg-accent-foreground/90 rounded-xl px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg md:text-xl transition-colors"
              >
                {t.promoButton}
              </a>
            </div>
            {/* Blocks 2 & 3 — two squares */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <a
                href="https://t.me/innoved_broker"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square rounded-2xl overflow-hidden relative group block"
              >
                <img
                  src="/gallery/telegram-banner.webp"
                  alt="Телеграм-канал ИННОВЭД"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-10 flex flex-col justify-between h-full p-3 sm:p-4">
                  <h4 className="font-montserrat font-bold text-foreground text-sm sm:text-lg md:text-xl leading-tight pt-1 whitespace-pre-line">
                    {t.telegramTitle}
                  </h4>
                  <p className="font-montserrat text-foreground text-[10px] sm:text-xs md:text-sm leading-snug pb-1">
                    {t.telegramDesc}
                  </p>
                </div>
              </a>
              <a
                href="/files/innoved_commercial.pdf"
                download
                className="aspect-square rounded-2xl overflow-hidden relative group block"
              >
                <img
                  src="/gallery/offer-banner.webp"
                  alt="Коммерческое предложение ИННОВЭД"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-10 flex flex-col justify-between h-full p-3 sm:p-4">
                  <h4 className="font-montserrat font-bold text-foreground text-sm sm:text-lg md:text-xl leading-tight pt-1 whitespace-pre-line">
                    {t.offerTitle}
                  </h4>
                  <p className="font-montserrat text-foreground text-[10px] sm:text-xs md:text-sm leading-snug pb-1">
                    {t.offerDesc}
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Block 4 — image slideshow */}
          <div className="aspect-square rounded-2xl border border-border bg-card overflow-hidden relative group">
            {slides.map((slide, i) => (
              <div
                key={slide.src}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
                  i === current ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={slide.src}
                  alt={slide.subtitle[language]}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative z-10 flex flex-col items-start justify-start h-full p-6 md:p-8">
                  <h3 className="font-montserrat font-bold text-white text-2xl md:text-3xl lg:text-4xl leading-tight uppercase">
                    {t.slideHeading}
                  </h3>
                  <p className="font-montserrat text-white/90 text-base md:text-lg lg:text-xl mt-2">
                    {slide.subtitle[language]}
                  </p>
                </div>
              </div>
            ))}
            {/* Arrows */}
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 hover:bg-background/90"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 hover:bg-background/90"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
