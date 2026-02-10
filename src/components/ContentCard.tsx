import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ContentCardProps {
  title: string;
  date: string;
  slug: string;
  type: 'blog' | 'news';
  imageUrl?: string;
  category?: string;
  categoryLabel?: string;
  language: 'ru' | 'en';
}

export function ContentCard({
  title,
  date,
  slug,
  type,
  imageUrl,
  category,
  categoryLabel,
  language
}: ContentCardProps) {
  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
      day: 'numeric',
      month: 'short'
    });
  };

  const linkPath = type === 'blog' ? `/blog/${slug}` : `/news/${slug}`;

  return (
    <Link
      to={linkPath}
      className="group relative block w-full h-[550px] md:h-[600px] rounded-2xl overflow-hidden"
    >
      {/* Background Image or Branded Fallback */}
      {imageUrl ? (
        <img
          src={`${imageUrl}?width=800&quality=80`}
          alt={title}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-primary-glow">
          {/* Triangle Pattern - Brand Identity */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
              <polygon points="0,0 100,0 50,86.6" fill="currentColor" className="text-primary-foreground" opacity="0.3" />
              <polygon points="100,0 200,0 150,86.6" fill="currentColor" className="text-primary-foreground" opacity="0.2" />
              <polygon points="200,0 300,0 250,86.6" fill="currentColor" className="text-primary-foreground" opacity="0.4" />
              <polygon points="300,0 400,0 350,86.6" fill="currentColor" className="text-primary-foreground" opacity="0.2" />
              <polygon points="50,86.6 150,86.6 100,173.2" fill="currentColor" className="text-primary-foreground" opacity="0.3" />
              <polygon points="150,86.6 250,86.6 200,173.2" fill="currentColor" className="text-primary-foreground" opacity="0.5" />
              <polygon points="250,86.6 350,86.6 300,173.2" fill="currentColor" className="text-primary-foreground" opacity="0.2" />
              <polygon points="0,173.2 100,173.2 50,259.8" fill="currentColor" className="text-primary-foreground" opacity="0.4" />
              <polygon points="100,173.2 200,173.2 150,259.8" fill="currentColor" className="text-primary-foreground" opacity="0.2" />
              <polygon points="200,173.2 300,173.2 250,259.8" fill="currentColor" className="text-primary-foreground" opacity="0.3" />
              <polygon points="300,173.2 400,173.2 350,259.8" fill="currentColor" className="text-primary-foreground" opacity="0.5" />
              <polygon points="50,259.8 150,259.8 100,346.4" fill="currentColor" className="text-primary-foreground" opacity="0.3" />
              <polygon points="150,259.8 250,259.8 200,346.4" fill="currentColor" className="text-primary-foreground" opacity="0.4" />
              <polygon points="250,259.8 350,259.8 300,346.4" fill="currentColor" className="text-primary-foreground" opacity="0.2" />
            </svg>
          </div>
          {/* Logo/Brand mark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-foreground/30 text-7xl md:text-8xl font-bold tracking-tight">
            ИННОВЭД
          </div>
        </div>
      )}

      {/* Gradient Overlay - Enhanced on Hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-all duration-300 group-hover:from-black/95 group-hover:via-black/50" />

      {/* Category Badge */}
      {categoryLabel && (
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/20">
            {categoryLabel}
          </Badge>
        </div>
      )}

      {/* Date Badge */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 text-white/80 text-sm bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
        <CalendarDays className="w-3.5 h-3.5" />
        <span>{formatDate(date)}</span>
      </div>

      {/* Title at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <h3 className="text-xl md:text-2xl font-bold text-white line-clamp-3 transition-all duration-300 group-hover:text-primary-foreground">
          {title}
        </h3>
        
        {/* Read More indicator - appears on hover */}
        <div className="flex items-center gap-2 mt-3 text-white/70 text-sm opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <span>{language === 'ru' ? 'Читать статью' : 'Read article'}</span>
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}