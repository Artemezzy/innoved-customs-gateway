import { useState, useCallback, useRef, useEffect } from 'react';
import { RussiaPresenceMap } from './RussiaPresenceMap';
import { CityInfoPanel } from './CityInfoPanel';
import { citiesConfig, fetchCityServices, type CityServicesData } from '@/data/cities-config';
import { useIsMobile } from '@/hooks/use-mobile';

interface ServicesPresenceSectionProps {
  language: 'ru' | 'en';
}

const sectionText = {
  ru: {
    title: 'География присутствия',
    hintDesktop: 'Наведите или нажмите на город, чтобы увидеть услуги в этом регионе',
    hintMobile: 'Нажмите на город, чтобы увидеть услуги в этом регионе',
  },
  en: {
    title: 'Our Presence',
    hintDesktop: 'Hover or click on a city to see services in that region',
    hintMobile: 'Tap on a city to see services in that region',
  },
};

export function ServicesPresenceSection({ language }: ServicesPresenceSectionProps) {
  const isMobile = useIsMobile();
  const text = sectionText[language];

  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [cityData, setCityData] = useState<CityServicesData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cache = useRef<Record<string, CityServicesData>>({});

  const loadCity = useCallback(
    async (slug: string) => {
      if (cache.current[slug]) {
        setCityData(cache.current[slug]);
        setError(null);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchCityServices(slug, language);
        cache.current[slug] = data;
        setCityData(data);
      } catch {
        setError('load_error');
        setCityData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [language],
  );

  // Invalidate cache when language changes
  useEffect(() => {
    cache.current = {};
    if (activeCity) loadCity(activeCity);
  }, [language, activeCity, loadCity]);

  const handleHover = useCallback(
    (slug: string | null) => {
      setHoveredCity(slug);
      if (activeCity) return; // don't override active selection on hover
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (slug) {
        debounceRef.current = setTimeout(() => loadCity(slug), 200);
      } else {
        setCityData(null);
      }
    },
    [activeCity, loadCity],
  );

  const handleSelect = useCallback(
    (slug: string) => {
      if (activeCity === slug) {
        // Deselect
        setActiveCity(null);
        setCityData(null);
        return;
      }
      setActiveCity(slug);
      loadCity(slug);
    },
    [activeCity, loadCity],
  );

  const displaySlug = activeCity || hoveredCity;

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
          {text.title}
        </h2>
        <p className="text-muted-foreground text-center mb-10 text-sm">
          {isMobile ? text.hintMobile : text.hintDesktop}
        </p>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 min-w-0">
            <RussiaPresenceMap
              cities={citiesConfig}
              activeCitySlug={activeCity}
              hoveredCitySlug={hoveredCity}
              onCityHover={handleHover}
              onCitySelect={handleSelect}
              language={language}
            />
          </div>

          <div className="w-full lg:w-auto">
            <CityInfoPanel
              data={cityData}
              isLoading={isLoading}
              error={error}
              language={language}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
