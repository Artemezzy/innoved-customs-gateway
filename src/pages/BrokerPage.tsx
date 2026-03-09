import { Link } from 'react-router-dom';
import { PageHero } from '@/components/PageHero';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { cities } from '@/data/cities';
import { MapPin, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';

const content = {
  ru: {
    title: 'Таможенный брокер',
    subtitle: 'Профессиональные услуги таможенного оформления по всей России',
    heading: 'Где мы оказываем услуги',
    description: 'Мы оказываем услуги таможенного оформления в ключевых логистических центрах России. Выберите ваш город, чтобы узнать подробности.',
    details: 'Подробнее',
  },
  en: {
    title: 'Customs Broker',
    subtitle: 'Professional customs clearance services across Russia',
    heading: 'Where We Provide Services',
    description: 'We provide customs clearance services in key logistics hubs across Russia. Select your city to learn more.',
    details: 'Learn more',
  },
};

const BrokerPage = () => {
  const { language } = useLanguage();
  const text = content[language];

  useEffect(() => {
    analytics.pageView('broker-page');
  }, []);

  return (
    <>
      <SEOHead
        title={text.title}
        description={text.subtitle}
        keywords="таможенный брокер, таможенное оформление, услуги таможенного брокера"
      />
      <PageHero title={text.title} subtitle={text.subtitle} />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-primary-foreground mb-6">{text.heading}</h2>
          <p className="text-primary-foreground/80 mb-8">{text.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cities.map((city) => (
              <Link to={`/tamozhennyj-broker/${city.slug}`} key={city.slug} className="group relative block rounded-md overflow-hidden">
                <img
                  src={city.imageUrl}
                  alt={city.name}
                  className="object-cover w-full h-48 transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white mb-2">{city.name}</h3>
                    <div className="inline-flex items-center gap-2 text-accent font-medium hover:text-accent-foreground transition-colors duration-300">
                      {text.details}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default BrokerPage;
