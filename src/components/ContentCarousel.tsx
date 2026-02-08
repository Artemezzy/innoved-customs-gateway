import { useState, useCallback, useEffect, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContentCarouselProps {
  children: ReactNode[];
  itemsPerPage?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function ContentCarousel({
  children,
  itemsPerPage = 4,
  autoPlay = false,
  autoPlayInterval = 5000
}: ContentCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalItems = children.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToNext = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const goToPrev = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || totalPages <= 1) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, goToNext, totalPages]);

  // Calculate visible items
  const startIndex = currentPage * itemsPerPage;
  const visibleItems = children.slice(startIndex, startIndex + itemsPerPage);

  // Don't show navigation if only one page
  const showNavigation = totalPages > 1;

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      {showNavigation && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm border-border shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hidden lg:flex"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm border-border shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hidden lg:flex"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Content Grid - Desktop: 3 columns (wider cards), Tablet: 2, Mobile: 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {visibleItems.map((child, index) => (
          <div
            key={`${currentPage}-${index}`}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Mobile Navigation */}
      {showNavigation && (
        <div className="flex items-center justify-center gap-4 mt-8 lg:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrev}
            className="w-10 h-10 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          {/* Page Indicators */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentPage
                    ? 'bg-primary w-6'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            className="w-10 h-10 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Desktop Page Counter */}
      {showNavigation && (
        <div className="hidden lg:flex items-center justify-center gap-3 mt-8">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentPage
                  ? 'bg-primary scale-125 shadow-glow'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}