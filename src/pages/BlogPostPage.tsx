import { useParams, Link, Navigate } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';
import { blogCategories } from '@/data/blog-posts';
import { useBlogPost } from '@/hooks/useBlogPosts';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const backText = {
  ru: 'Назад к блогу',
  en: 'Back to blog'
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  
  const { data: post, isLoading } = useBlogPost(language, slug || '');

  useEffect(() => {
    if (post) {
      analytics.pageView(`/blog/${slug}`, post.title);
    }
  }, [slug, post]);

  if (!isLoading && !post) {
    return <Navigate to="/blog" replace />;
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
              <Skeleton className="h-10 w-32 mb-4 bg-white/20" />
              <Skeleton className="h-6 w-48 mb-4 bg-white/20" />
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
              <Skeleton className="h-8 w-1/2 mt-8" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </section>
      </>
    );
  }

  if (!post) return null;

  return (
    <>
      <SEOHead language={language} page="home" />
      
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog">
              <Button variant="ghost" className="mb-4 text-primary-foreground hover:text-primary-foreground/80 hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {backText[language]}
              </Button>
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary" className="bg-white/20 text-primary-foreground">
                {blogCategories[post.category as keyof typeof blogCategories]?.[language] || post.category}
              </Badge>
              <div className="flex items-center text-sm opacity-90">
                <CalendarDays className="w-4 h-4 mr-1" />
                {formatDate(post.date)}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold animate-fade-in">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <article className="max-w-4xl mx-auto">
            {(() => {
              const content = (typeof post.content === 'string' ? post.content : post.content?.text || '')
                .replace(/\\n/g, '\n');
              const lines = content.split('\n').filter(line => line.trim());
              const elements: React.ReactNode[] = [];
              let listItems: string[] = [];

              const flushList = () => {
                if (listItems.length > 0) {
                  elements.push(
                    <ul key={`list-${elements.length}`} className="list-disc list-inside text-muted-foreground space-y-2 my-4 ml-4">
                      {listItems.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  );
                  listItems = [];
                }
              };

              lines.forEach((line, index) => {
                // Check if line starts with a bullet-like pattern
                const isBullet = /^[-•·]/.test(line.trim()) || 
                                 /^[а-яa-z]/.test(line.trim()) && lines[index - 1]?.includes(':');
                
                if (line.startsWith('## ')) {
                  flushList();
                  elements.push(
                    <h2 key={index} className="text-2xl font-bold text-foreground mt-8 mb-4">
                      {line.replace('## ', '')}
                    </h2>
                  );
                } else if (line.startsWith('### ')) {
                  flushList();
                  elements.push(
                    <h3 key={index} className="text-xl font-semibold text-foreground mt-6 mb-3">
                      {line.replace('### ', '')}
                    </h3>
                  );
                } else if (line.endsWith(':')) {
                  flushList();
                  elements.push(
                    <p key={index} className="text-foreground font-medium mt-6 mb-2">
                      {line}
                    </p>
                  );
                } else if (isBullet) {
                  listItems.push(line.replace(/^[-•·]\s*/, ''));
                } else {
                  flushList();
                  elements.push(
                    <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                      {line}
                    </p>
                  );
                }
              });

              flushList();
              return elements;
            })()}
          </article>
        </div>
      </section>
    </>
  );
}
