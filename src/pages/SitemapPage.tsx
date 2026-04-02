import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useServices } from '@/hooks/useServices';
import { cities } from '@/data/cities';

export default function SitemapPage() {
  const { language } = useLanguage();
  const { data: services = [] } = useServices(language);

  const generalLinks = [
    { to: '/', label: language === 'ru' ? 'Главная' : 'Home' },
    { to: '/about', label: language === 'ru' ? 'О компании' : 'About' },
    { to: '/how-we-work', label: language === 'ru' ? 'Как мы работаем' : 'How We Work' },
    { to: '/contact', label: language === 'ru' ? 'Контакты' : 'Contact' },
    { to: '/blog', label: language === 'ru' ? 'Блог' : 'Blog' },
    { to: '/faq', label: 'FAQ' },
    { to: '/tamozhennyj-broker', label: language === 'ru' ? 'Таможенный брокер' : 'Customs Broker' },
    { to: '/rastamojka-zapchastey', label: language === 'ru' ? 'Растаможка запчастей' : 'Spare Parts Clearance' },
    { to: '/rastamojka-odejdi', label: language === 'ru' ? 'Растаможка одежды' : 'Clothing Clearance' },
    { to: '/rastamojka-oborudovaniya', label: language === 'ru' ? 'Растаможка оборудования' : 'Equipment Clearance' },
    { to: '/rastamojka-tehniki', label: language === 'ru' ? 'Растаможка техники' : 'Machinery Clearance' },
    { to: '/privacy', label: language === 'ru' ? 'Политика конфиденциальности' : 'Privacy Policy' },
    { to: '/terms', label: language === 'ru' ? 'Пользовательское соглашение' : 'Terms of Service' },
  ];

  return (
    <>
      <SEOHead
        language={language}
        page="sitemap"
        customMeta={{
          title: language === 'ru' ? 'Карта сайта — ИННОВЭД' : 'Sitemap — INNOVED',
          description: language === 'ru'
            ? 'Карта сайта ИННОВЭД — все страницы и разделы'
            : 'INNOVED sitemap — all pages and sections',
        }}
      />

      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-foreground mb-10">
            {language === 'ru' ? 'Карта сайта' : 'Sitemap'}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {/* Column 1: General */}
            <div>
              <h2 className="font-montserrat font-semibold text-lg text-foreground mb-4">
                {language === 'ru' ? 'Разделы' : 'Sections'}
              </h2>
              <ul className="space-y-2">
                {generalLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Services */}
            <div>
              <h2 className="font-montserrat font-semibold text-lg text-foreground mb-4">
                {language === 'ru' ? 'Услуги' : 'Services'}
              </h2>
              <ul className="space-y-2">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link
                      to={`/services/${s.slug}`}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Geography */}
            <div>
              <h2 className="font-montserrat font-semibold text-lg text-foreground mb-4">
                {language === 'ru' ? 'География' : 'Geography'}
              </h2>
              <ul className="space-y-2">
                {cities.map((city) => (
                  <li key={city.slug}>
                    <Link
                      to={`/tamozhennyj-broker/${city.slug}`}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                      {city.name[language]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
