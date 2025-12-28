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

      {/* Featured Image */}
      {item.image?.url && (
        <section className="bg-background pt-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <img 
                src={item.image.url} 
                alt={item.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <article className="max-w-4xl mx-auto">
            {(() => {
              const rawContent = typeof item.content === 'string' ? item.content : item.content?.text || '';
              // Handle both literal \n and actual newlines
              const normalizedContent = rawContent.replace(/\\n/g, '\n');
              const paragraphs = normalizedContent.split(/\n\n+/).filter(p => p.trim());
              
              return paragraphs.map((paragraph, index) => {
                const trimmed = paragraph.trim();
                
                if (trimmed.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold text-foreground mt-8 mb-4">
                      {trimmed.replace('## ', '')}
                    </h2>
                  );
                }
                if (trimmed.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl font-semibold text-foreground mt-6 mb-3">
                      {trimmed.replace('### ', '')}
                    </h3>
                  );
                }
                if (trimmed.startsWith('- ')) {
                  const items = trimmed.split('\n').filter(line => line.trim().startsWith('- '));
                  return (
                    <ul key={index} className="list-disc list-inside text-muted-foreground space-y-2 my-4">
                      {items.map((listItem, i) => (
                        <li key={i}>{listItem.replace(/^-\s*/, '')}</li>
                      ))}
                    </ul>
                  );
                }
                
                // Split by single newlines for line breaks within paragraphs
                const lines = trimmed.split('\n');
                return (
                  <p key={index} className="text-muted-foreground leading-relaxed mb-4 text-lg">
                    {lines.map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < lines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                );
              });
            })()}
          </article>
        </div>
      </section>
    </>
  );
}
