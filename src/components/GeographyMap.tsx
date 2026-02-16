import { useState } from 'react';

interface GeographyMapProps {
  language: 'ru' | 'en';
}

const cities = [
  {
    id: 'vladivostok',
    name: { ru: 'Владивосток', en: 'Vladivostok' },
    // Approximate SVG coordinates on simplified Russia outline
    x: 870,
    y: 195,
  },
  {
    id: 'novorossiysk',
    name: { ru: 'Новороссийск', en: 'Novorossiysk' },
    x: 340,
    y: 280,
  },
  {
    id: 'novosibirsk',
    name: { ru: 'Новосибирск', en: 'Novosibirsk' },
    x: 590,
    y: 200,
  },
];

const sectionTitle = {
  ru: 'География присутствия',
  en: 'Our Presence',
};

export function GeographyMap({ language }: GeographyMapProps) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-10">
          {sectionTitle[language]}
        </h2>
        <div className="max-w-5xl mx-auto bg-card rounded-2xl shadow-card p-6 md:p-10 border border-border">
          <svg
            viewBox="0 0 1000 450"
            className="w-full h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background */}
            <rect width="1000" height="450" fill="hsl(210 40% 96.1%)" rx="12" />

            {/* Simplified Russia / Eurasia outline */}
            <path
              d="
                M 120,180 
                C 140,160 180,140 220,135
                C 260,130 300,145 320,150
                C 340,155 350,170 340,190
                C 330,210 310,230 290,250
                C 280,260 290,270 310,275
                C 330,280 350,290 340,310
                C 330,330 300,340 270,335
                C 240,330 220,310 200,300
                C 180,290 160,280 150,260
                C 140,240 130,220 120,200
                Z
              "
              fill="hsl(210 20% 88%)"
              stroke="hsl(210 20% 78%)"
              strokeWidth="1"
              opacity="0.5"
            />

            {/* Main Russia landmass - simplified */}
            <path
              d="
                M 200,120 
                L 250,100 L 320,90 L 400,85 L 480,80 L 560,78 L 640,82 
                L 720,90 L 780,100 L 830,110 L 870,130 L 900,150 
                L 920,170 L 930,190 L 920,210 L 900,230 L 870,240 
                L 830,235 L 800,225 L 770,220 L 740,225 L 710,230 
                L 680,225 L 650,220 L 620,225 L 590,230 L 560,235 
                L 530,240 L 500,245 L 470,250 L 440,255 L 410,260 
                L 380,265 L 350,268 L 330,272 L 310,268 L 290,260 
                L 270,250 L 250,235 L 235,220 L 225,200 L 218,180 
                L 210,160 L 205,140 L 200,120
              "
              fill="hsl(210 20% 92%)"
              stroke="hsl(210 20% 80%)"
              strokeWidth="1.5"
            />

            {/* Kazakhstan / Central Asia area */}
            <path
              d="
                M 380,265 L 420,280 L 470,290 L 520,295 L 560,290 
                L 580,280 L 590,265 L 590,250 L 580,240
              "
              fill="hsl(210 15% 94%)"
              stroke="hsl(210 20% 82%)"
              strokeWidth="1"
            />

            {/* China area */}
            <path
              d="
                M 590,265 L 630,280 L 680,300 L 740,320 L 800,330 
                L 850,325 L 880,310 L 890,280 L 880,250 L 860,240 
                L 830,235
              "
              fill="hsl(210 15% 94%)"
              stroke="hsl(210 20% 82%)"
              strokeWidth="1"
            />

            {/* Grid lines for infographic feel */}
            {[100, 200, 300, 400].map((y) => (
              <line
                key={`h-${y}`}
                x1="50"
                y1={y}
                x2="950"
                y2={y}
                stroke="hsl(210 20% 85%)"
                strokeWidth="0.5"
                strokeDasharray="4 4"
                opacity="0.4"
              />
            ))}
            {[200, 400, 600, 800].map((x) => (
              <line
                key={`v-${x}`}
                x1={x}
                y1="50"
                x2={x}
                y2="400"
                stroke="hsl(210 20% 85%)"
                strokeWidth="0.5"
                strokeDasharray="4 4"
                opacity="0.4"
              />
            ))}

            {/* Connecting routes (dashed lines between cities) */}
            <line
              x1={cities[1].x}
              y1={cities[1].y}
              x2={cities[2].x}
              y2={cities[2].y}
              stroke="hsl(29 85% 53%)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              opacity="0.4"
            />
            <line
              x1={cities[2].x}
              y1={cities[2].y}
              x2={cities[0].x}
              y2={cities[0].y}
              stroke="hsl(29 85% 53%)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              opacity="0.4"
            />
            <line
              x1={cities[1].x}
              y1={cities[1].y}
              x2={cities[0].x}
              y2={cities[0].y}
              stroke="hsl(29 85% 53%)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              opacity="0.3"
            />

            {/* City markers */}
            {cities.map((city) => {
              const isHovered = hoveredCity === city.id;
              return (
                <g
                  key={city.id}
                  onMouseEnter={() => setHoveredCity(city.id)}
                  onMouseLeave={() => setHoveredCity(null)}
                  className="cursor-pointer"
                >
                  {/* Pulse ring */}
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={isHovered ? 18 : 14}
                    fill="hsl(29 85% 53% / 0.15)"
                    className="transition-all duration-300"
                  >
                    <animate
                      attributeName="r"
                      values={isHovered ? '18;24;18' : '14;20;14'}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.3;0.1;0.3"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Pin body */}
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={isHovered ? 8 : 6}
                    fill="hsl(29 85% 53%)"
                    stroke="white"
                    strokeWidth="2.5"
                    className="transition-all duration-300"
                    style={{
                      filter: isHovered
                        ? 'drop-shadow(0 2px 6px hsl(29 85% 53% / 0.5))'
                        : 'drop-shadow(0 1px 3px hsl(29 85% 53% / 0.3))',
                    }}
                  />

                  {/* Inner dot */}
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={isHovered ? 3 : 2}
                    fill="white"
                    className="transition-all duration-300"
                  />

                  {/* City label */}
                  <text
                    x={city.x}
                    y={city.y - (isHovered ? 18 : 14)}
                    textAnchor="middle"
                    fill="hsl(222.2 84% 4.9%)"
                    fontSize={isHovered ? 14 : 12}
                    fontWeight={isHovered ? 700 : 600}
                    fontFamily="'Montserrat', sans-serif"
                    className="transition-all duration-300 select-none"
                  >
                    {city.name[language]}
                  </text>
                </g>
              );
            })}

            {/* Legend */}
            <g transform="translate(60, 380)">
              <circle cx="0" cy="0" r="5" fill="hsl(29 85% 53%)" stroke="white" strokeWidth="2" />
              <text x="14" y="4" fill="hsl(215.4 16.3% 46.9%)" fontSize="11" fontFamily="'Montserrat', sans-serif">
                {language === 'ru' ? '— Города присутствия' : '— Offices'}
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
