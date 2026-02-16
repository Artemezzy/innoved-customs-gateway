import { useCallback, useEffect, useState, useRef } from 'react';
import type { CityConfig } from '@/data/cities-config';

interface RussiaPresenceMapProps {
  cities: CityConfig[];
  activeCitySlug: string | null;
  hoveredCitySlug: string | null;
  onCityHover: (slug: string | null) => void;
  onCitySelect: (slug: string) => void;
  language: 'ru' | 'en';
}

// Path to the external Russia outline SVG file.
// Replace this with the actual path after uploading the file.
const RUSSIA_SVG_PATH = '/assets/maps/russia-outline.svg';

export function RussiaPresenceMap({
  cities,
  activeCitySlug,
  hoveredCitySlug,
  onCityHover,
  onCitySelect,
  language,
}: RussiaPresenceMapProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [viewBox, setViewBox] = useState<string>('0 0 1000 600');
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch and parse the external SVG file
  useEffect(() => {
    fetch(RUSSIA_SVG_PATH)
      .then((res) => {
        if (!res.ok) throw new Error('SVG not found');
        return res.text();
      })
      .then((text) => {
        // Extract viewBox from the SVG
        const vbMatch = text.match(/viewBox=["']([^"']+)["']/);
        if (vbMatch) setViewBox(vbMatch[1]);

        // Extract inner content of the <svg> tag (everything between <svg ...> and </svg>)
        const innerMatch = text.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
        if (innerMatch) {
          setSvgContent(innerMatch[1]);
        }
      })
      .catch(() => {
        // SVG file not yet uploaded — show placeholder message
        setSvgContent(null);
      });
  }, []);

  // Parse viewBox to get width/height for coordinate mapping
  const vbParts = viewBox.split(/[\s,]+/).map(Number);
  const vbX = vbParts[0] || 0;
  const vbY = vbParts[1] || 0;
  const vbW = vbParts[2] || 1000;
  const vbH = vbParts[3] || 600;

  // Convert city's relative coordinates (0–100) to SVG viewBox coordinates
  const toSvgX = useCallback((x: number) => vbX + (x / 100) * vbW, [vbX, vbW]);
  const toSvgY = useCallback((y: number) => vbY + (y / 100) * vbH, [vbY, vbH]);

  // Scale marker sizes relative to viewBox (so they look consistent regardless of viewBox size)
  const markerR = vbW * 0.005;
  const markerRHover = vbW * 0.007;
  const glowR = vbW * 0.014;
  const tooltipFontSize = vbW * 0.011;
  const tooltipH = vbH * 0.038;
  const tooltipOffsetY = vbH * 0.05;

  return (
    <div ref={containerRef} className="w-full">
      {svgContent === null ? (
        // Placeholder while SVG file is not available
        <div className="w-full aspect-[5/3] bg-muted/50 rounded-lg flex items-center justify-center border border-dashed border-border">
          <p className="text-muted-foreground text-sm text-center px-4">
            {language === 'ru'
              ? 'Загрузите файл контура РФ в /public/assets/maps/russia-outline.svg'
              : 'Upload Russia outline SVG to /public/assets/maps/russia-outline.svg'}
          </p>
        </div>
      ) : (
        <svg
          viewBox={viewBox}
          className="w-full h-auto"
          role="img"
          aria-label={language === 'ru' ? 'Карта присутствия в России' : 'Russia presence map'}
        >
          {/* Injected Russia outline SVG content — styled via CSS class overrides */}
          <g
            className="russia-outline-layer"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />

          {/* City markers overlaid on top of the map */}
          {cities.map((city) => {
            const cx = toSvgX(city.x);
            const cy = toSvgY(city.y);
            const isActive = city.slug === activeCitySlug;
            const isHovered = city.slug === hoveredCitySlug;
            const isHighlighted = isActive || isHovered;
            const label = language === 'ru' ? city.name : city.nameEn;

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
                    r={glowR}
                    className={isActive ? 'fill-primary/20' : 'fill-accent/15'}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                )}

                {/* Main dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHighlighted ? markerRHover : markerR}
                  className={
                    isActive
                      ? 'fill-primary stroke-primary-foreground'
                      : isHovered
                        ? 'fill-primary stroke-primary/50'
                        : 'fill-accent stroke-accent-foreground/30'
                  }
                  strokeWidth={isActive ? vbW * 0.002 : vbW * 0.001}
                  style={{ transition: 'all 0.2s ease' }}
                />

                {/* Tooltip on hover */}
                {isHighlighted && (
                  <g style={{ pointerEvents: 'none' }}>
                    <rect
                      x={cx - label.length * tooltipFontSize * 0.35 - tooltipFontSize * 0.5}
                      y={cy - tooltipOffsetY}
                      width={label.length * tooltipFontSize * 0.7 + tooltipFontSize}
                      height={tooltipH}
                      rx={vbW * 0.004}
                      className="fill-popover stroke-border"
                      strokeWidth={vbW * 0.0005}
                    />
                    <text
                      x={cx}
                      y={cy - tooltipOffsetY + tooltipH * 0.68}
                      textAnchor="middle"
                      className="fill-popover-foreground font-medium"
                      style={{ fontSize: tooltipFontSize }}
                    >
                      {label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
