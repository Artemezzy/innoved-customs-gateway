import { useState } from 'react';

interface City {
  name: { ru: string; en: string };
  lat: number;
  lon: number;
}

interface RussiaMapProps {
  language: 'ru' | 'en';
}

const cities: City[] = [
  { name: { ru: 'Владивосток', en: 'Vladivostok' }, lat: 43.12, lon: 131.87 },
  { name: { ru: 'Новороссийск', en: 'Novorossiysk' }, lat: 44.72, lon: 37.77 },
  { name: { ru: 'Новосибирск', en: 'Novosibirsk' }, lat: 55.03, lon: 82.92 },
];

const content = {
  ru: {
    title: 'География работы',
    subtitle: 'Работаем по всей России — от Новороссийска до Владивостока',
  },
  en: {
    title: 'Our Coverage',
    subtitle: 'Operating across Russia — from Novorossiysk to Vladivostok',
  },
};

// Simple Mercator projection for Russia region
// Map bounds: lon 25-180, lat 40-78
const projectPoint = (lat: number, lon: number) => {
  const mapWidth = 900;
  const mapHeight = 450;
  const lonMin = 25;
  const lonMax = 180;
  const latMin = 40;
  const latMax = 78;

  const x = ((lon - lonMin) / (lonMax - lonMin)) * mapWidth;
  const y = ((latMax - lat) / (latMax - latMin)) * mapHeight;
  return { x, y };
};

// Simplified Russia outline path (approximate)
const russiaPath = `
M 68,180 L 72,170 L 80,165 L 85,155 L 78,148 L 72,140 L 65,138
L 58,142 L 52,148 L 48,155 L 42,158 L 38,165 L 35,172 L 30,178
L 28,185 L 32,192 L 38,198 L 42,205 L 48,210 L 55,215 L 62,218
L 68,222 L 75,225 L 82,228 L 88,225 L 95,220 L 102,215 L 108,210
L 115,205 L 122,200 L 128,195 L 135,190 L 142,185 L 148,180
L 155,175 L 162,172 L 168,168 L 175,165 L 182,160 L 188,155
L 195,152 L 202,148 L 208,145 L 215,142 L 222,138 L 228,135
L 235,132 L 242,128 L 248,125 L 255,122 L 262,118 L 268,115
L 275,112 L 282,108 L 288,105 L 295,102 L 302,98 L 308,95
L 315,92 L 322,88 L 328,85 L 335,82 L 342,78 L 348,75
L 355,72 L 362,68 L 368,65 L 375,62 L 382,58 L 388,55
L 395,52 L 402,50 L 410,48 L 418,45 L 425,42 L 432,40
L 440,38 L 448,36 L 455,35 L 462,34 L 470,33 L 478,32
L 485,32 L 492,33 L 500,35 L 508,38 L 515,40 L 522,42
L 528,45 L 535,48 L 542,52 L 548,55 L 555,58 L 562,62
L 568,68 L 575,72 L 582,78 L 588,82 L 595,88 L 602,92
L 608,98 L 615,102 L 622,108 L 628,112 L 635,118 L 642,122
L 648,128 L 655,132 L 662,138 L 668,142 L 675,148 L 682,155
L 688,162 L 695,168 L 702,175 L 708,182 L 715,188 L 722,195
L 728,202 L 735,208 L 742,215 L 748,222 L 755,228 L 762,235
L 768,242 L 772,248 L 778,255 L 782,262 L 788,268 L 792,272
L 798,278 L 802,282 L 808,285 L 812,288 L 818,290 L 825,292
L 832,290 L 838,285 L 842,280 L 848,275 L 852,270 L 858,265
L 862,260 L 865,255 L 868,250 L 870,245 L 872,240 L 875,235
L 878,230 L 880,225 L 882,220 L 885,215 L 888,210 L 890,205
L 892,200 L 890,195 L 885,190 L 878,185 L 872,182 L 865,178
L 858,175 L 852,172 L 845,168 L 838,165 L 832,162 L 825,160
L 818,158 L 812,155 L 805,152 L 798,150 L 792,148 L 785,145
L 778,142 L 772,140 L 765,138 L 758,135 L 752,132 L 745,130
L 738,128 L 732,125 L 725,122 L 718,120 L 712,118 L 705,115
L 698,112 L 692,108 L 685,105 L 678,102 L 672,98 L 665,95
L 658,92 L 652,88 L 645,85 L 638,82 L 632,78 L 625,75
L 618,72 L 612,68 L 605,65 L 598,62 L 592,60 L 585,58
L 578,55 L 572,52 L 565,50 L 558,48 L 552,45 L 545,42
L 538,40 L 532,38 L 525,35 L 518,33 L 512,32 L 505,30
L 498,28 L 492,27 L 485,26 L 478,25 L 470,24 L 462,23
L 455,22 L 448,22 L 440,22 L 432,22 L 425,23 L 418,24
L 410,25 L 402,26 L 395,28 L 388,30 L 382,32 L 375,35
L 368,38 L 362,42 L 355,45 L 348,48 L 342,52 L 335,55
L 328,58 L 322,62 L 315,65 L 308,68 L 302,72 L 295,75
L 288,78 L 282,82 L 275,85 L 268,88 L 262,92 L 255,95
L 248,98 L 242,102 L 235,105 L 228,108 L 222,112 L 215,115
L 208,118 L 202,120 L 195,122 L 188,125 L 182,128 L 175,130
L 168,132 L 162,135 L 155,138 L 148,140 L 142,142 L 135,145
L 128,148 L 122,150 L 115,152 L 108,155 L 102,158 L 95,160
L 88,162 L 82,165 L 75,168 L 68,172 L 62,175 L 58,178
Z
`;

export function RussiaMap({ language }: RussiaMapProps) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const text = content[language];

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4 animate-fade-in">
          {text.title}
        </h2>
        <p className="text-center text-muted-foreground mb-12 text-lg animate-fade-in">
          {text.subtitle}
        </p>

        <div className="max-w-5xl mx-auto">
          <svg
            viewBox="0 0 900 450"
            className="w-full h-auto"
            role="img"
            aria-label={text.title}
          >
            {/* Background */}
            <rect width="900" height="450" fill="hsl(var(--secondary))" rx="12" />

            {/* Russia landmass */}
            <path
              d={russiaPath}
              fill="hsl(var(--muted))"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              opacity="0.7"
            />

            {/* Connecting lines between cities */}
            {cities.map((city, i) => {
              const nextCity = cities[(i + 1) % cities.length];
              const p1 = projectPoint(city.lat, city.lon);
              const p2 = projectPoint(nextCity.lat, nextCity.lon);
              return (
                <line
                  key={`line-${i}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="hsl(var(--accent))"
                  strokeWidth="1"
                  strokeDasharray="6 4"
                  opacity="0.5"
                />
              );
            })}

            {/* City markers */}
            {cities.map((city) => {
              const pos = projectPoint(city.lat, city.lon);
              const isHovered = hoveredCity === city.name.en;
              const label = city.name[language];

              // Determine label position to avoid overlaps
              const labelX = city.lon > 100 ? pos.x - 10 : pos.x + 16;
              const textAnchor = city.lon > 100 ? 'end' : 'start';

              return (
                <g
                  key={city.name.en}
                  onMouseEnter={() => setHoveredCity(city.name.en)}
                  onMouseLeave={() => setHoveredCity(null)}
                  className="cursor-pointer"
                >
                  {/* Pulse ring */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered ? 18 : 14}
                    fill="hsl(var(--accent) / 0.15)"
                    className="transition-all duration-300"
                  >
                    <animate
                      attributeName="r"
                      from="10"
                      to="22"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.6"
                      to="0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Pin marker */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered ? 8 : 6}
                    fill="hsl(var(--accent))"
                    stroke="hsl(var(--accent-foreground))"
                    strokeWidth="2"
                    className="transition-all duration-300 drop-shadow-lg"
                  />

                  {/* Inner dot */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="2.5"
                    fill="hsl(var(--accent-foreground))"
                  />

                  {/* Label background */}
                  <rect
                    x={textAnchor === 'end' ? labelX - label.length * 7.5 - 8 : labelX - 4}
                    y={pos.y - 10}
                    width={label.length * 7.5 + 12}
                    height="22"
                    rx="4"
                    fill={isHovered ? 'hsl(var(--primary))' : 'hsl(var(--card))'}
                    stroke={isHovered ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                    strokeWidth="1"
                    opacity={isHovered ? 1 : 0.9}
                    className="transition-all duration-300"
                  />

                  {/* Label text */}
                  <text
                    x={textAnchor === 'end' ? labelX - 2 : labelX + label.length * 3.75 + 2}
                    y={pos.y + 4}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={isHovered ? '700' : '500'}
                    fontFamily="'Montserrat', sans-serif"
                    fill={isHovered ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))'}
                    className="transition-all duration-300 select-none"
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
