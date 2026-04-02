import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useServiceDetail } from '@/hooks/useServiceDetail';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { CheckCircle, Phone, ArrowLeft } from 'lucide-react';
import { CustomsCalculator } from '@/components/CustomsCalculator';
import { analytics } from '@/utils/analytics';
import shipBg from '@/assets/ship-bg.webp';

const pageText = {
  ru: {
    backToServices: 'Назад к услугам',
    contactUs: 'Оставить заявку',
    step: 'Шаг',
  },
  en: {
    backToServices: 'Back to services',
    contactUs: 'Submit a request',
    step: 'Step',
  },
};

export default function TamozhennayaOchistkaPage() {
  const { language } = useLanguage();
  const { service } = useServiceDetail('tamozhennaya-ochistka');
  const t = pageText[language];

  useEffect(() => {
    analytics.pageView('/tamozhennaya-ochistka', service?.seo[language].title || 'Таможенная очистка');
  }, [language, service]);

  if (!service) return null;

  const serviceContent = service.content[language];
  if (!serviceContent) return null;

  return (
    <>
      <SEOHead
        language={language}
        page="services"
        customTitle={service.seo[language].title}
        customDescription={service.seo[language].description}
        customKeywords={service.seo[language].keywords}
        canonicalPath="/services/tamozhennaya-ochistka"
      />
      <div className="min-h-screen bg-background">
        {/* Hero with ship background */}
        <section className="relative bg-foreground text-primary-foreground overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src={shipBg}
              alt=""
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/50" />
          </div>

          <div className="container mx-auto px-4 relative z-10 py-16 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left: Title + description + CTA */}
              <div className="flex flex-col justify-center space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold animate-fade-in">
                  {service.title[language]}
                </h1>
                <p className="text-lg md:text-xl opacity-90 leading-relaxed max-w-xl animate-fade-in">
                  {serviceContent.intro}
                </p>
                <div className="animate-fade-in">
                  <Link to="/contact">
                    <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground text-base px-8">
                      <Phone className="w-5 h-5" />
                      {t.contactUs}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right: Calculator */}
              <div className="lg:mt-0 mt-4">
                <div className="bg-background rounded-xl shadow-2xl overflow-hidden">
                  <CustomsCalculator language={language} compact />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content sections */}
        <div className="container mx-auto px-4 py-12">
          <Link to="/services">
            <Button variant="outline" className="gap-2 mb-8">
              <ArrowLeft className="w-4 h-4" />
              {t.backToServices}
            </Button>
          </Link>

          <div className="max-w-4xl mx-auto">
            {serviceContent.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  {section.title}
                </h2>

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
                          <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
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
              <p className="text-lg text-foreground mb-6">{serviceContent.cta}</p>
              <Link to="/contact">
                <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Phone className="w-4 h-4" />
                  {t.contactUs}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
