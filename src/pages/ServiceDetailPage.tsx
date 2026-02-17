import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useServiceDetail } from '@/hooks/useServiceDetail';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Phone } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
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
      analytics.pageView(`/services/${slug}`, service.seo[language].title);
      
      // Add Service Schema.org structured data
      const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": service.title[language],
        "description": service.seo[language].description,
        "url": `https://innovedbroker.ru/services/${slug}`,
        "provider": {
          "@type": "Organization",
          "name": language === 'ru' ? 'ИННОВЭД' : 'INNOVED',
          "url": "https://innovedbroker.ru",
          "logo": "https://innovedbroker.ru/logo.png",
          "telephone": "+7-933-188-10-09",
          "email": "info@innovedbroker.ru",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": language === 'ru' ? 'Москва' : 'Moscow',
            "addressCountry": "RU"
          }
        },
        "areaServed": {
          "@type": "Country",
          "name": language === 'ru' ? 'Россия' : 'Russia'
        },
        "serviceType": language === 'ru' ? 'Таможенное оформление' : 'Customs Clearance',
        "availableChannel": {
          "@type": "ServiceChannel",
          "serviceUrl": "https://innovedbroker.ru/contact",
          "servicePhone": "+7-933-188-10-09",
          "availableLanguage": ["Russian", "English"]
        }
      };

      // Remove existing Service schema script
      const existingServiceSchema = document.querySelector('script[data-schema="service"]');
      if (existingServiceSchema) {
        existingServiceSchema.remove();
      }

      // Add new Service schema script
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'service');
      script.textContent = JSON.stringify(serviceSchema);
      document.head.appendChild(script);

      // Cleanup on unmount
      return () => {
        const schemaScript = document.querySelector('script[data-schema="service"]');
        if (schemaScript) {
          schemaScript.remove();
        }
      };
    }
  }, [service, language, slug]);

  // Not found state
  if (!isFound || !service) {
    return (
      <>
        <SEOHead language={language} page="services" />
        <div className="min-h-screen bg-background">
        <PageHero title={text.notFound}>
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-4">
            {text.notFound}
          </h1>
          <p className="text-xl opacity-90">{text.notFoundText}</p>
        </PageHero>
        <div className="container mx-auto px-4 py-8">
          <Link to="/services">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {text.backToServices}
            </Button>
          </Link>
        </div>
        </div>
      </>
    );
  }

  const serviceTitle = service.title[language];
  const serviceContent = service.content[language];

  // Placeholder state for services without content
  if (!serviceContent) {
    return (
      <>
        <SEOHead 
          language={language} 
          page="services"
          customTitle={service.seo[language].title}
          customDescription={service.seo[language].description}
          customKeywords={service.seo[language].keywords}
          canonicalPath={`/services/${slug}`}
        />
        <div className="min-h-screen bg-background">
        {/* Hero */}
        <PageHero title={serviceTitle} />

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
      </>
    );
  }

  // Full content state
  return (
    <>
      <SEOHead 
        language={language} 
        page="services"
        customTitle={service.seo[language].title}
        customDescription={service.seo[language].description}
        customKeywords={service.seo[language].keywords}
        canonicalPath={`/services/${slug}`}
      />
      <div className="min-h-screen bg-background">
      {/* Hero */}
      <PageHero title={serviceTitle} />

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
                      <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
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
                      <div className="flex-shrink-0 w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-lg">
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
          <div className="bg-accent/5 rounded-xl p-8 text-center mt-12 border border-accent/20">
            <p className="text-lg text-foreground mb-6">
              {serviceContent.cta}
            </p>
            <Link to="/contact">
              <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Phone className="w-4 h-4" />
                {text.contactUs}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
