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

// Detailed Russia contour paths for viewBox 0 0 1000 600
// Main Russia outline — clockwise from Kola Peninsula (Murmansk area)
const RUSSIA_MAIN =
  // Kola Peninsula (northwest)
  'M 215,135 L 205,128 L 190,130 L 178,138 L 170,150 L 165,165 ' +
  // Finnish border south to Gulf of Finland
  'L 162,180 L 158,195 L 160,210 L 165,225 L 172,238 L 178,248 L 185,258 L 190,268 ' +
  // St Petersburg area, west to Baltic border
  'L 182,275 L 175,282 L 168,288 ' +
  // Baltic states border (Latvia, Estonia)
  'L 162,298 L 158,310 L 155,320 ' +
  // Belarus border
  'L 158,332 L 162,342 L 168,352 ' +
  // Ukraine border going south
  'L 175,362 L 182,372 L 190,382 L 198,390 L 205,398 ' +
  // Sea of Azov approach
  'L 212,408 L 218,415 L 225,420 ' +
  // Crimea peninsula
  'L 218,428 L 210,435 L 205,442 L 210,448 L 218,450 L 228,446 L 235,440 ' +
  // East along Azov / Caucasus
  'L 242,438 L 250,442 L 258,448 L 268,454 ' +
  // Caucasus mountains (Georgia/Azerbaijan border)
  'L 275,460 L 282,465 L 290,462 L 298,458 ' +
  // Caspian coast (Dagestan)
  'L 305,450 L 310,440 L 312,430 L 315,420 ' +
  // Kazakhstan border going east
  'L 322,415 L 335,410 L 350,405 L 365,402 L 380,400 ' +
  'L 395,398 L 410,395 L 425,392 L 440,390 ' +
  'L 455,392 L 468,395 L 480,398 ' +
  // Southern Siberia / Kazakhstan-Russia border
  'L 495,400 L 508,405 L 520,408 ' +
  // Altai / Mongolia border
  'L 535,412 L 548,418 L 558,422 L 568,428 ' +
  // Tuva / Mongolia border
  'L 580,432 L 592,435 L 605,432 L 618,428 ' +
  // Buryatia / Mongolia border
  'L 632,425 L 648,420 L 662,418 L 675,415 ' +
  // Zabaykalsk area / China border
  'L 690,412 L 705,408 L 718,405 L 730,410 ' +
  // Amur River / China border
  'L 742,415 L 755,420 L 768,425 L 780,430 ' +
  'L 792,432 L 805,428 L 818,425 ' +
  // Khabarovsk / Ussuri area
  'L 830,420 L 842,418 L 855,415 L 865,420 ' +
  // Primorsky Krai / Vladivostok
  'L 875,425 L 882,430 L 888,435 L 892,428 ' +
  // Coast north from Vladivostok
  'L 890,418 L 886,405 L 882,392 L 880,378 ' +
  // Tatar Strait / Sea of Okhotsk coast
  'L 878,362 L 880,348 L 884,335 L 888,320 ' +
  // Toward Kamchatka
  'L 892,305 L 898,290 L 905,278 L 912,268 ' +
  // Kamchatka Peninsula
  'L 922,258 L 932,250 L 942,248 L 952,252 L 958,262 ' +
  'L 962,275 L 964,290 L 960,305 L 955,318 L 948,328 ' +
  'L 940,322 L 935,312 L 930,305 ' +
  // Back to Sea of Okhotsk mainland
  'L 920,298 L 910,292 L 902,285 ' +
  // Northern Sea of Okhotsk coast
  'L 892,272 L 882,258 L 872,248 L 862,240 ' +
  // Magadan coast
  'L 850,230 L 838,222 L 828,215 ' +
  // Chukotka
  'L 840,205 L 855,195 L 870,188 L 885,182 ' +
  'L 898,178 L 910,180 L 920,185 L 930,182 L 940,175 ' +
  'L 948,168 L 955,158 L 960,148 L 958,138 L 950,130 ' +
  // Arctic coast east — Chukotka to Wrangel
  'L 938,125 L 925,120 L 912,118 L 900,115 ' +
  // East Siberian Sea coast
  'L 885,112 L 870,108 L 855,105 L 840,100 ' +
  'L 825,96 L 810,92 L 795,88 ' +
  // Laptev Sea coast — Yakutia
  'L 778,85 L 760,82 L 742,80 ' +
  // Taimyr Peninsula
  'L 725,78 L 710,72 L 698,65 L 688,58 L 680,52 ' +
  'L 672,48 L 665,52 L 658,60 L 650,68 ' +
  'L 642,75 L 632,80 ' +
  // Kara Sea coast
  'L 618,82 L 605,78 L 592,75 L 580,72 ' +
  'L 565,70 L 550,68 L 535,67 L 520,68 ' +
  // Yamal Peninsula
  'L 505,65 L 492,60 L 485,54 L 480,48 ' +
  'L 478,55 L 475,62 L 472,68 ' +
  // Ob Gulf
  'L 465,72 L 458,68 L 452,62 L 448,56 ' +
  'L 445,62 L 442,70 L 438,76 ' +
  // Western Kara Sea coast
  'L 430,80 L 420,82 L 408,85 L 395,88 ' +
  // Novaya Zemlya gap — Barents Sea
  'L 380,90 L 365,92 L 350,96 L 338,100 ' +
  // Pechora Sea coast
  'L 325,105 L 312,110 L 300,115 ' +
  // Kanin Peninsula / White Sea
  'L 288,118 L 278,122 L 270,128 ' +
  // White Sea inlet
  'L 262,135 L 255,142 L 248,150 L 242,158 ' +
  'L 248,162 L 255,158 L 262,152 L 268,145 ' +
  // Back along Kola Peninsula
  'L 258,138 L 248,132 L 240,128 L 232,125 ' +
  'L 225,128 L 218,132 L 215,135 Z';

// Kaliningrad exclave (separate polygon)
const KALININGRAD_PATH =
  'M 118,305 L 122,300 L 128,298 L 134,300 L 136,306 L 132,312 L 126,314 L 120,310 Z';

// Sakhalin island
const SAKHALIN_PATH =
  'M 925,340 L 928,330 L 932,320 L 935,310 L 936,300 ' +
  'L 935,290 L 932,282 L 930,288 L 928,298 L 926,308 ' +
  'L 924,318 L 922,330 L 923,338 L 925,340 Z';

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
      {/* Russia main contour */}
      <path
        d={RUSSIA_MAIN}
        className="fill-primary/10 stroke-primary/30"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      {/* Kaliningrad exclave */}
      <path
        d={KALININGRAD_PATH}
        className="fill-primary/10 stroke-primary/30"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      {/* Sakhalin island */}
      <path
        d={SAKHALIN_PATH}
        className="fill-primary/10 stroke-primary/30"
        strokeWidth={1.5}
        strokeLinejoin="round"
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
