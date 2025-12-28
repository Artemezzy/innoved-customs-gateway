import { useParams, Link, Navigate } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';
import { useNewsItem } from '@/hooks/useNewsItems';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const backText = {
  ru: 'Назад к новостям',
  en: 'Back to news'
};

export default function NewsItemPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  
  const { data: item, isLoading } = useNewsItem(language, slug || '');

  useEffect(() => {
    if (item) {
      analytics.pageView(`/news/${slug}`, item.title);
    }
  }, [slug, item]);

  if (!isLoading && !item) {
    return <Navigate to="/news" replace />;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <>
        <SEOHead language={language} page="home" />
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-10 w-40 mb-4 bg-white/20" />
              <Skeleton className="h-6 w-32 mb-4 bg-white/20" />
              <Skeleton className="h-12 w-full bg-white/20" />
            </div>
          </div>
        </section>
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        </section>
      </>
    );
  }

  if (!item) return null;

  return (
    <>
      <SEOHead language={language} page="home" />
      
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link to="/news">
              <Button variant="ghost" className="mb-4 text-primary-foreground hover:text-primary-foreground/80 hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {backText[language]}
              </Button>
            </Link>
            <div className="flex items-center text-sm opacity-90 mb-4">
              <CalendarDays className="w-4 h-4 mr-1" />
              {formatDate(item.date)}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold animate-fade-in">
              {item.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <article className="max-w-4xl mx-auto">
            {(typeof item.content === 'string' ? item.content : item.content?.text || '').split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-foreground mt-8 mb-4">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-semibold text-foreground mt-6 mb-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                return (
                  <ul key={index} className="list-disc list-inside text-muted-foreground space-y-2 my-4">
                    {items.map((listItem, i) => (
                      <li key={i}>{listItem.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={index} className="text-muted-foreground leading-relaxed mb-4 text-lg">
                  {paragraph}
                </p>
              );
            })}
          </article>
        </div>
      </section>
    </>
  );
}
