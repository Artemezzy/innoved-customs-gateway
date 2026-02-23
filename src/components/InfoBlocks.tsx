import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  '/gallery/slide-01.webp',
  '/gallery/slide-02.webp',
  '/gallery/slide-03.webp',
  '/gallery/slide-04.webp',
  '/gallery/slide-05.webp',
  '/gallery/slide-06.webp',
];

function CountdownTimer() {
  const TWO_HOURS = 2 * 60 * 60 * 1000;

  const getRemaining = () => {
    const now = Date.now();
    const cycle = now % TWO_HOURS;
    return TWO_HOURS - cycle;
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

  const units = [
    { value: dd, label: 'дней' },
    { value: hh, label: 'часов' },
    { value: mm, label: 'мин.' },
    { value: ss, label: 'сек.' },
  ];

  return (
    <div className="flex gap-3 mt-1">
      {units.map((u, i) => (
        <div key={i} className="flex flex-col items-center">
          <span className="font-montserrat font-bold text-accent-foreground text-xl md:text-2xl tabular-nums">
            {u.value}
          </span>
          <span className="font-montserrat text-accent-foreground/70 text-[10px] md:text-xs">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function InfoBlocks() {
  const [current, setCurrent] = useState(0);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext]);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            {/* Block 1 — promo banner */}
            <div className="w-full aspect-[2/1] rounded-2xl bg-accent flex flex-col items-start justify-between text-left px-6 py-5 md:px-8 md:py-6">
              <div>
                <h3 className="font-montserrat font-bold text-accent-foreground text-2xl md:text-3xl lg:text-4xl leading-tight">
                  -50% на первое оформление
                </h3>
                <p className="font-montserrat text-accent-foreground/80 text-sm mt-1">
                  особые условия · по промокоду NOW
                </p>
              </div>
              <div className="flex items-end gap-4">
                <p className="font-montserrat text-accent-foreground/80 text-xs leading-tight">
                  Дата окончания
                  <br />
                  программы
                </p>
                <CountdownTimer />
              </div>
              <a
                href="#contact"
                className="inline-block font-montserrat font-bold text-accent bg-accent-foreground hover:bg-accent-foreground/90 rounded-xl px-8 py-4 text-lg md:text-xl transition-colors"
              >
                Заказать
              </a>
            </div>
            {/* Blocks 2 & 3 — two squares */}
            <div className="grid grid-cols-2 gap-6">
              <div className="aspect-square rounded-2xl border border-border bg-card" />
              <div className="aspect-square rounded-2xl border border-border bg-card" />
            </div>
          </div>

          {/* Block 4 — image slideshow */}
          <div className="aspect-square rounded-2xl border border-border bg-card overflow-hidden relative group">
            {slides.map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  i === current ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            {/* Arrows */}
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background/90"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background/90"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
