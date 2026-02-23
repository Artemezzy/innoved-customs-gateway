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

  return (
    <p className="font-montserrat font-bold text-accent-foreground text-xl md:text-2xl mt-3 tracking-widest tabular-nums">
      {dd}:{hh}:{mm}:{ss}
    </p>
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
            <div className="w-full aspect-[2/1] rounded-2xl bg-accent flex flex-col items-center justify-center text-center px-6">
              <h3 className="font-montserrat font-bold text-accent-foreground text-2xl md:text-3xl lg:text-4xl leading-tight">
                -50% на первое оформление
                <br />
                по промокоду <span className="underline">NOW</span>
              </h3>
              <p className="font-montserrat text-accent-foreground/80 text-sm mt-2">
                особые условия
              </p>
              <CountdownTimer />
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
