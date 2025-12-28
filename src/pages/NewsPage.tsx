import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';
import { useNewsItems } from '@/hooks/useNewsItems';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, ArrowRight } from 'lucide-react';

const content = {
  ru: {
    title: 'Новости',
    subtitle: 'Новости и события компании ИННОВЭД',
    readMore: 'Читать далее'
  },
  en: {
    title: 'News',
    subtitle: 'News and events from INNOVED',
    readMore: 'Read more'
  }
};

export default function NewsPage() {
  const { language } = useLanguage();
  const text = content[language];
  
  const { data: newsItems = [], isLoading } = useNewsItems(language);

  useEffect(() => {
    analytics.pageView('/news', 'ИННОВЭД - Новости');
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <SEOHead language={language} page="home" />
      
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            {text.title}
          </h1>
          <p className="text-xl opacity-90 animate-fade-in">
            {text.subtitle}
          </p>
        </div>
      </section>

      {/* News Items */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Loading State */}
            {isLoading && (
              <>
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {/* News Items List */}
            {!isLoading && newsItems.map((item, index) => (
              <Card 
                key={item.slug}
                className="hover:shadow-hover transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center text-muted-foreground text-sm mb-2">
                    <CalendarDays className="w-4 h-4 mr-1" />
                    {formatDate(item.date)}
                  </div>
                  <CardTitle className="text-xl">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {item.excerpt}
                  </p>
                  <Link 
                    to={`/news/${item.slug}`}
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    {text.readMore}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
