import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';
import { blogPosts, blogCategories } from '@/data/blog-posts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  },
  zh: {
    title: '博客',
    subtitle: '关于清关和外贸的有用材料',
    readMore: '阅读更多'
  }
};

export default function BlogPage() {
  const { language } = useLanguage();
  const text = content[language];

  useEffect(() => {
    analytics.pageView('/blog', 'ИННОВЭД - Блог');
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : language === 'zh' ? 'zh-CN' : 'en-US', {
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
                    {post.title[language]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt[language]}
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
        </div>
      </section>
    </>
  );
}
