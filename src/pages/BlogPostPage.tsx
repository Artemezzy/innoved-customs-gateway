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
        <SEOHead language={language} page="blog" customTitle={`Загрузка... | ИННОВЭД`} />
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
      <SEOHead 
        language={language} 
        page="blog" 
        customTitle={`${post.title} | ИННОВЭД`}
        customDescription={post.excerpt}
        canonicalPath={`/blog/${post.slug}`}
      />
      
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
          <article className="max-w-4xl mx-auto prose prose-lg max-w-none
            prose-headings:text-foreground prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
            prose-ul:text-muted-foreground prose-ol:text-muted-foreground
            prose-li:my-1
            prose-strong:text-foreground
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          ">
            {(() => {
              const content = typeof post.content === 'string' 
                ? post.content 
                : post.content;
              
              if (content?.html) {
                return <div dangerouslySetInnerHTML={{ __html: content.html }} />;
              }
              
              return (
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {content?.text || ''}
                </p>
              );
            })()}
          </article>
        </div>
      </section>
    </>
  );
}
