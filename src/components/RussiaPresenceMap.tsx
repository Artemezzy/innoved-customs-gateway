import { useCallback } from 'react';
import type { CityConfig } from '@/data/cities-config';

interface RussiaPresenceMapProps {
  cities: CityConfig[];
  activeCitySlug: string | null;
  hoveredCitySlug: string | null;
  onCityHover: (slug: string | null) => void;
  onCitySelect: (slug: string) => void;
  language: 'ru' | 'en';
}

// Simplified Russia contour path for viewBox 0 0 1000 600
const RUSSIA_PATH =
  'M55,310 L50,290 L40,285 L38,270 L55,260 L60,250 L80,255 L95,240 L100,230 ' +
  'L110,225 L130,230 L140,220 L155,215 L160,200 L175,195 L185,185 L195,180 ' +
  'L200,170 L210,160 L225,155 L235,150 L230,140 L215,135 L210,125 L220,115 ' +
  'L240,110 L255,115 L265,120 L275,130 L285,135 L295,125 L310,130 L320,140 ' +
  'L330,135 L340,140 L350,145 L365,140 L375,150 L390,155 L400,150 L420,155 ' +
  'L430,160 L440,155 L455,160 L470,155 L480,165 L495,170 L510,165 L520,160 ' +
  'L535,155 L545,150 L560,145 L575,140 L590,135 L605,130 L620,125 L635,120 ' +
  'L650,115 L665,105 L680,100 L695,95 L710,100 L720,110 L730,120 L745,115 ' +
  'L755,105 L770,100 L785,110 L795,120 L810,125 L825,130 L840,140 L855,150 ' +
  'L865,160 L875,170 L885,180 L895,190 L905,200 L920,210 L935,220 L945,235 ' +
  'L955,250 L960,265 L965,280 L960,295 L950,310 L940,320 L930,335 L920,340 ' +
  'L910,350 L900,360 L890,365 L880,370 L870,375 L855,380 L840,375 L825,370 ' +
  'L810,375 L800,380 L790,390 L780,395 L770,400 L755,395 L740,390 L725,385 ' +
  'L710,390 L700,395 L690,400 L675,395 L665,390 L650,385 L635,390 L620,395 ' +
  'L605,390 L590,385 L575,380 L560,375 L545,380 L530,385 L515,380 L500,375 ' +
  'L485,370 L470,365 L455,370 L440,375 L425,370 L410,365 L395,360 L380,355 ' +
  'L365,360 L350,365 L340,370 L325,375 L310,380 L295,385 L280,390 L265,395 ' +
  'L250,400 L240,410 L225,420 L215,425 L205,430 L195,435 L185,440 L175,435 ' +
  'L165,425 L155,420 L145,415 L130,410 L120,405 L110,400 L100,395 L90,385 ' +
  'L80,375 L70,360 L60,345 L55,330 L55,310 Z';

export function RussiaPresenceMap({
  cities,
  activeCitySlug,
  hoveredCitySlug,
  onCityHover,
  onCitySelect,
  language,
}: RussiaPresenceMapProps) {
  const toSvgX = useCallback((x: number) => (x / 100) * 1000, []);
  const toSvgY = useCallback((y: number) => (y / 100) * 600, []);

  return (
    <svg
      viewBox="0 0 1000 600"
      className="w-full h-auto"
      role="img"
      aria-label={language === 'ru' ? 'Карта присутствия в России' : 'Russia presence map'}
    >
      {/* Russia contour */}
      <path
        d={RUSSIA_PATH}
        className="fill-primary/10 stroke-primary/30"
        strokeWidth={1.5}
      />

      {/* City markers */}
      {cities.map((city) => {
        const cx = toSvgX(city.x);
        const cy = toSvgY(city.y);
        const isActive = city.slug === activeCitySlug;
        const isHovered = city.slug === hoveredCitySlug;
        const isHighlighted = isActive || isHovered;

        return (
          <g
            key={city.slug}
            onMouseEnter={() => onCityHover(city.slug)}
            onMouseLeave={() => onCityHover(null)}
            onClick={() => onCitySelect(city.slug)}
            className="cursor-pointer"
          >
            {/* Glow ring for active/hovered */}
            {isHighlighted && (
              <circle
                cx={cx}
                cy={cy}
                r={14}
                className={isActive ? 'fill-primary/20' : 'fill-accent/15'}
                style={{ transition: 'all 0.2s ease' }}
              />
            )}

            {/* Main dot */}
            <circle
              cx={cx}
              cy={cy}
              r={isHighlighted ? 7 : 5}
              className={
                isActive
                  ? 'fill-primary stroke-primary-foreground'
                  : isHovered
                    ? 'fill-primary stroke-primary/50'
                    : 'fill-accent stroke-accent-foreground/30'
              }
              strokeWidth={isActive ? 2 : 1}
              style={{ transition: 'all 0.2s ease' }}
            />

            {/* Tooltip on hover */}
            {isHighlighted && (
              <g>
                <rect
                  x={cx - (language === 'ru' ? city.name : city.nameEn).length * 4 - 8}
                  y={cy - 30}
                  width={(language === 'ru' ? city.name : city.nameEn).length * 8 + 16}
                  height={22}
                  rx={4}
                  className="fill-popover stroke-border"
                  strokeWidth={0.5}
                />
                <text
                  x={cx}
                  y={cy - 15}
                  textAnchor="middle"
                  className="fill-popover-foreground text-[11px] font-medium"
                  style={{ pointerEvents: 'none' }}
                >
                  {language === 'ru' ? city.name : city.nameEn}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
