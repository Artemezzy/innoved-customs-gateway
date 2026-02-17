import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';
import { useNewsItems } from '@/hooks/useNewsItems';
import { ContentCard } from '@/components/ContentCard';
import { ContentCarousel } from '@/components/ContentCarousel';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHero } from '@/components/PageHero';

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

  const sortedNews = [...newsItems].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  useEffect(() => {
    analytics.pageView('/news', 'ИННОВЭД - Новости');
  }, []);

  return (
    <>
      <SEOHead language={language} page="news" />
      <PageHero title={text.title} subtitle={text.subtitle} />

      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-12">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[550px] md:h-[600px] rounded-2xl overflow-hidden">
                  <Skeleton className="w-full h-full" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && sortedNews.length > 0 && (
            <ContentCarousel itemsPerPage={3}>
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
