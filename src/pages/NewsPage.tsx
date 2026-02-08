import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';
import { useNewsItems } from '@/hooks/useNewsItems';
import { ContentCard } from '@/components/ContentCard';
import { ContentCarousel } from '@/components/ContentCarousel';
import { Skeleton } from '@/components/ui/skeleton';

const content = {
  ru: {
    title: 'Новости',
    subtitle: 'Новости и события компании ИННОВЭД'
  },
  en: {
    title: 'News',
    subtitle: 'News and events from INNOVED'
  }
};

export default function NewsPage() {
  const { language } = useLanguage();
  const text = content[language];
  
  const { data: newsItems = [], isLoading } = useNewsItems(language);

  // Sort by date descending (newest first - left side)
  const sortedNews = [...newsItems].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  useEffect(() => {
    analytics.pageView('/news', 'ИННОВЭД - Новости');
  }, []);

  return (
    <>
      <SEOHead language={language} page="news" />
      
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            {text.title}
          </h1>
          <p className="text-xl opacity-90 animate-fade-in">
            {text.subtitle}
          </p>
        </div>
      </section>

      {/* News Carousel */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-12">
          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[500px] rounded-2xl overflow-hidden">
                  <Skeleton className="w-full h-full" />
                </div>
              ))}
            </div>
          )}

          {/* News Carousel */}
          {!isLoading && sortedNews.length > 0 && (
            <ContentCarousel itemsPerPage={4}>
              {sortedNews.map((item) => (
                <ContentCard
                  key={item.slug}
                  title={item.title}
                  date={item.date}
                  slug={item.slug}
                  type="news"
                  imageUrl={item.image?.url}
                  language={language}
                />
              ))}
            </ContentCarousel>
          )}

          {/* Empty State */}
          {!isLoading && sortedNews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {language === 'ru' ? 'Новости скоро появятся' : 'News coming soon'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}