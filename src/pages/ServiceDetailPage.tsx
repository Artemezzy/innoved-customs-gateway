import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useServiceDetail } from '@/hooks/useServiceDetail';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Phone } from 'lucide-react';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';

const content = {
  ru: {
    backToServices: 'Назад к услугам',
    placeholderTitle: 'Подробное описание скоро будет добавлено',
    placeholderText: 'Мы работаем над наполнением этой страницы. Для получения информации об услуге свяжитесь с нами.',
    contactUs: 'Связаться с нами',
    notFound: 'Услуга не найдена',
    notFoundText: 'К сожалению, запрашиваемая услуга не найдена.',
    step: 'Шаг',
  },
  en: {
    backToServices: 'Back to services',
    placeholderTitle: 'Detailed description coming soon',
    placeholderText: 'We are working on filling this page. For information about the service, please contact us.',
    contactUs: 'Contact us',
    notFound: 'Service not found',
    notFoundText: 'Unfortunately, the requested service was not found.',
    step: 'Step',
  },
};

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { service, isFound, hasContent } = useServiceDetail(slug || '');
  const text = content[language];

  useEffect(() => {
    if (service) {
      const seo = service.seo[language];
      document.title = seo.title;
      
      // Update meta tags
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', seo.description);
      }
      
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', seo.keywords);
      }
      
      analytics.pageView(`/services/${slug}`, seo.title);
    }
  }, [service, language, slug]);

  // Not found state
  if (!isFound || !service) {
    return (
      <div className="min-h-screen bg-background">
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {text.notFound}
            </h1>
            <p className="text-xl opacity-90">{text.notFoundText}</p>
          </div>
        </section>
        <div className="container mx-auto px-4 py-8">
          <Link to="/services">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {text.backToServices}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const serviceTitle = service.title[language];
  const serviceContent = service.content[language];

  // Placeholder state for services without content
  if (!serviceContent) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              {serviceTitle}
            </h1>
          </div>
        </section>

        {/* Back button and placeholder content */}
        <div className="container mx-auto px-4 py-8">
          <Link to="/services">
            <Button variant="outline" className="gap-2 mb-8">
              <ArrowLeft className="w-4 h-4" />
              {text.backToServices}
            </Button>
          </Link>

          <div className="max-w-3xl mx-auto text-center py-16">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {text.placeholderTitle}
            </h2>
            <p className="text-muted-foreground mb-8">
              {text.placeholderText}
            </p>
            <Link to="/contact">
              <Button size="lg" className="gap-2">
                <Phone className="w-4 h-4" />
                {text.contactUs}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Full content state
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            {serviceTitle}
          </h1>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Link to="/services">
          <Button variant="outline" className="gap-2 mb-8">
            <ArrowLeft className="w-4 h-4" />
            {text.backToServices}
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Intro */}
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
            {serviceContent.intro}
          </p>

          {/* Sections */}
          {serviceContent.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                {section.title}
              </h2>

              {/* Items list */}
              {section.items && (
                <ul className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex gap-3">
                      <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Steps */}
              {section.steps && (
                <div className="space-y-6">
                  {section.steps.map((step, stepIndex) => (
                    <div 
                      key={stepIndex} 
                      className="flex gap-4 p-6 bg-card rounded-lg border border-border"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                        {stepIndex + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground">{step.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* CTA */}
          <div className="bg-primary/5 rounded-xl p-8 text-center mt-12">
            <p className="text-lg text-foreground mb-6">
              {serviceContent.cta}
            </p>
            <Link to="/contact">
              <Button size="lg" className="gap-2">
                <Phone className="w-4 h-4" />
                {text.contactUs}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
