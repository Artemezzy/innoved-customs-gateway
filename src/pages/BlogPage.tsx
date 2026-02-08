import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';
import { blogCategories } from '@/data/blog-posts';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { ContentCard } from '@/components/ContentCard';
import { ContentCarousel } from '@/components/ContentCarousel';
import { Skeleton } from '@/components/ui/skeleton';

const content = {
  ru: {
    title: 'Блог',
    subtitle: 'Полезные материалы по таможенному оформлению и ВЭД'
  },
  en: {
    title: 'Blog',
    subtitle: 'Useful materials on customs clearance and foreign trade'
  }
};

export default function BlogPage() {
  const { language } = useLanguage();
  const text = content[language];
  
  const { data: blogPosts = [], isLoading } = useBlogPosts(language);

  // Sort by date descending (newest first - left side)
  const sortedPosts = [...blogPosts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  useEffect(() => {
    analytics.pageView('/blog', 'ИННОВЭД - Блог');
  }, []);

  return (
    <>
      <SEOHead language={language} page="blog" />
      
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

      {/* Blog Posts Carousel */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-12">
          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[550px] md:h-[600px] rounded-2xl overflow-hidden">
                  <Skeleton className="w-full h-full" />
                </div>
              ))}
            </div>
          )}

          {/* Blog Posts Carousel */}
          {!isLoading && sortedPosts.length > 0 && (
            <ContentCarousel itemsPerPage={3}>
              {sortedPosts.map((post) => (
                <ContentCard
                  key={post.slug}
                  title={post.title}
                  date={post.date}
                  slug={post.slug}
                  type="blog"
                  imageUrl={post.image?.url}
                  category={post.category}
                  categoryLabel={blogCategories[post.category as keyof typeof blogCategories]?.[language] || post.category}
                  language={language}
                />
              ))}
            </ContentCarousel>
          )}

          {/* Empty State */}
          {!isLoading && sortedPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {language === 'ru' ? 'Статьи скоро появятся' : 'Articles coming soon'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}