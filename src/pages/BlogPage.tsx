import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';
import { blogCategories } from '@/data/blog-posts';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, ArrowRight } from 'lucide-react';

const content = {
  ru: {
    title: 'Блог',
    subtitle: 'Полезные материалы по таможенному оформлению и ВЭД',
    readMore: 'Читать далее'
  },
  en: {
    title: 'Blog',
    subtitle: 'Useful materials on customs clearance and foreign trade',
    readMore: 'Read more'
  }
};

export default function BlogPage() {
  const { language } = useLanguage();
  const text = content[language];
  
  const { data: blogPosts = [], isLoading } = useBlogPosts(language);

  useEffect(() => {
    analytics.pageView('/blog', 'ИННОВЭД - Блог');
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

      {/* Blog Posts */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Loading State */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader>
                    <Skeleton className="h-5 w-20 mb-2" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Blog Posts Grid */}
          {!isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post, index) => (
                <Card 
                  key={post.slug}
                  className="hover:shadow-hover transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">
                        {blogCategories[post.category as keyof typeof blogCategories]?.[language] || post.category}
                      </Badge>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <CalendarDays className="w-4 h-4 mr-1" />
                        {formatDate(post.date)}
                      </div>
                    </div>
                    <CardTitle className="text-xl line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      {text.readMore}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
