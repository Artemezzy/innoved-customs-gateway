import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, Wallet, Send, Mail, Phone } from 'lucide-react';

interface BrokerServicesProps {
  language: 'ru' | 'en';
}

const content = {
  ru: {
    title: 'Услуги таможенного брокера',
    subtitle: 'Точная стоимость услуг зависит от сложности оформления',
    advantage1: 'От 1 часа',
    advantage2: 'От 7 500 ₽',
    consultation: 'Проконсультируем быстро и бесплатно',
    cta: 'Заказать услугу',
    services: [
      {
        image: '/gallery/broker-consult.webp',
        title: 'Консультация по ВЭД',
        time: 'от 15 минут',
        price: 'бесплатно',
        slug: 'ved-consulting',
      },
      {
        image: '/gallery/broker-dt.webp',
        title: 'Оформление таможенной декларации',
        time: 'от 1 часа',
        price: 'от 7 500 ₽',
        slug: 'import',
      },
      {
        image: '/gallery/broker-ved.webp',
        title: 'Определение кода ТН ВЭД',
        time: 'от 5 минут',
        price: 'от 500 ₽',
        slug: 'hs-code',
      },
      {
        image: '/gallery/broker-check.webp',
        title: 'Организация таможенного досмотра',
        time: 'от 4 часов',
        price: 'от 10 000 ₽',
        slug: 'inspection',
      },
    ],
  },
  en: {
    title: 'Customs Broker Services',
    subtitle: 'The exact cost depends on the complexity of clearance',
    advantage1: 'From 1 hour',
    advantage2: 'From 7,500 ₽',
    consultation: 'We provide fast and free consultation',
    cta: 'Order Service',
    services: [
      {
        image: '/gallery/broker-consult.webp',
        title: 'Foreign Trade Consulting',
        time: 'from 15 min',
        price: 'free',
        slug: 'ved-consulting',
      },
      {
        image: '/gallery/broker-dt.webp',
        title: 'Customs Declaration Processing',
        time: 'from 1 hour',
        price: 'from 7,500 ₽',
        slug: 'import',
      },
      {
        image: '/gallery/broker-ved.webp',
        title: 'HS Code Determination',
        time: 'from 5 min',
        price: 'from 500 ₽',
        slug: 'hs-code',
      },
      {
        image: '/gallery/broker-check.webp',
        title: 'Customs Inspection Organization',
        time: 'from 4 hours',
        price: 'from 10,000 ₽',
        slug: 'inspection',
      },
    ],
  },
};

export function BrokerServices({ language }: BrokerServicesProps) {
  const t = content[language];

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Top row: left info + right image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left — text block */}
          <div className="bg-muted rounded-2xl p-8 md:p-10 flex flex-col justify-between">
            <div>
              <h2 className="font-montserrat font-bold text-2xl md:text-3xl lg:text-4xl text-foreground">
                {t.title}
              </h2>
              <p className="mt-3 text-muted-foreground text-sm md:text-base">
                {t.subtitle}
              </p>

              {/* Advantages */}
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2 bg-background rounded-xl px-4 py-3 border border-border">
                  <Clock className="w-5 h-5 text-accent shrink-0" />
                  <span className="font-semibold text-foreground text-sm md:text-base">{t.advantage1}</span>
                </div>
                <div className="flex items-center gap-2 bg-background rounded-xl px-4 py-3 border border-border">
                  <Wallet className="w-5 h-5 text-accent shrink-0" />
                  <span className="font-semibold text-foreground text-sm md:text-base">{t.advantage2}</span>
                </div>
              </div>

              <p className="mt-5 text-muted-foreground text-sm">
                {t.consultation}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-10 py-6 text-base md:text-lg"
              >
                <Link to="/contact">{t.cta}</Link>
              </Button>

              <a
                href="https://t.me/innovedbroker"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-5 h-5" />
              </a>

              <div className="flex flex-col text-sm">
                <a href="mailto:info@innovedbroker.ru" className="flex items-center gap-1.5 text-foreground hover:text-accent transition-colors">
                  <Mail className="w-4 h-4 text-accent shrink-0" />
                  <span>info@innovedbroker.ru</span>
                </a>
                <a href="tel:+79331881009" className="flex items-center gap-1.5 text-foreground hover:text-accent transition-colors mt-1">
                  <Phone className="w-4 h-4 text-accent shrink-0" />
                  <span>+7 933 188 10 09</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right — document image */}
          <div className="rounded-2xl overflow-hidden">
            <img
              src="/gallery/broker-doc.webp"
              alt={language === 'ru' ? 'Таможенная декларация' : 'Customs declaration'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Bottom row: 4 service cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {t.services.map((service) => (
            <Link
              key={service.slug}
              to={`/services/${service.slug}`}
              className="group bg-muted rounded-2xl p-4 md:p-5 flex flex-col items-center text-center hover:shadow-lg transition-shadow border border-transparent hover:border-accent/30"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 mb-4 rounded-xl overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="font-montserrat font-semibold text-foreground text-sm md:text-base leading-tight min-h-[2.5rem]">
                {service.title}
              </h3>
              <div className="mt-3 flex items-center gap-1.5 text-muted-foreground text-xs md:text-sm">
                <Clock className="w-4 h-4 text-accent shrink-0" />
                <span>{service.time}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 text-muted-foreground text-xs md:text-sm">
                <Wallet className="w-4 h-4 text-accent shrink-0" />
                <span>{service.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
