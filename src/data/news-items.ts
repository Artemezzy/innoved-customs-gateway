export interface NewsItem {
  slug: string;
  date: string;
  title: { ru: string; en: string };
  excerpt: { ru: string; en: string };
  content: { ru: string; en: string };
}

export const newsItems: NewsItem[] = [
  {
    slug: 'office-expansion-2024',
    date: '2024-12-12',
    title: {
      ru: 'ИННОВЭД расширяет географию присутствия',
      en: 'INNOVED Expands Geographic Presence'
    },
    excerpt: {
      ru: 'Открытие нового представительства в Владивостоке для улучшения обслуживания клиентов на Дальнем Востоке.',
      en: 'Opening a new representative office in Vladivostok to improve customer service in the Far East.'
    },
    content: {
      ru: `Компания ИННОВЭД рада объявить об открытии нового представительства во Владивостоке!

## Почему Владивосток?

Дальний Восток России — стратегически важный регион для внешнеэкономической деятельности, особенно в торговле со странами Азии. Открытие офиса во Владивостоке позволит нам:

- Сократить время обработки заявок для клиентов из региона
- Обеспечить личное присутствие на ключевых таможенных постах
- Расширить партнёрскую сеть с азиатскими компаниями

## Новые возможности для клиентов

Теперь наши клиенты на Дальнем Востоке получат:
- Круглосуточную поддержку в местном часовом поясе
- Ускоренное оформление грузов из Китая, Кореи и Японии
- Личные консультации в офисе

Мы продолжаем развиваться, чтобы предоставлять лучший сервис нашим клиентам по всей России!`,
      en: `INNOVED is pleased to announce the opening of a new representative office in Vladivostok!

## Why Vladivostok?

The Russian Far East is a strategically important region for foreign economic activity, especially in trade with Asian countries. Opening an office in Vladivostok will allow us to:

- Reduce processing time for clients from the region
- Ensure personal presence at key customs posts
- Expand partnership network with Asian companies

## New Opportunities for Clients

Now our Far East clients will receive:
- 24/7 support in the local time zone
- Accelerated clearance of cargo from China, Korea, and Japan
- Personal consultations at the office

We continue to grow to provide the best service to our clients across Russia!`
    }
  },
  {
    slug: 'partnership-with-logistics',
    date: '2024-12-01',
    title: {
      ru: 'Новое партнёрство с логистической компанией',
      en: 'New Partnership with Logistics Company'
    },
    excerpt: {
      ru: 'ИННОВЭД заключил стратегическое партнёрство для комплексного обслуживания клиентов.',
      en: 'INNOVED has entered into a strategic partnership for comprehensive customer service.'
    },
    content: {
      ru: `Мы рады сообщить о заключении стратегического партнёрства с ведущей логистической компанией!

## Преимущества для наших клиентов

Благодаря этому партнёрству мы теперь можем предложить:

### Комплексный сервис
- Таможенное оформление + доставка «под ключ»
- Единый договор на все услуги
- Один менеджер для решения всех вопросов

### Выгодные условия
- Специальные тарифы на перевозку для наших клиентов
- Приоритетная обработка грузов
- Расширенное страхование грузов

### Гибкость
- Мультимодальные перевозки
- Складское хранение
- Консолидация грузов

Обращайтесь к нам для получения комплексного решения по доставке и оформлению вашего груза!`,
      en: `We are pleased to announce a strategic partnership with a leading logistics company!

## Benefits for Our Clients

Thanks to this partnership, we can now offer:

### Comprehensive Service
- Customs clearance + turnkey delivery
- Single contract for all services
- One manager to solve all issues

### Favorable Terms
- Special transportation rates for our clients
- Priority cargo processing
- Extended cargo insurance

### Flexibility
- Multimodal transportation
- Warehouse storage
- Cargo consolidation

Contact us for a comprehensive solution for delivery and clearance of your cargo!`
    }
  },
  {
    slug: 'team-growth',
    date: '2024-11-20',
    title: {
      ru: 'Команда ИННОВЭД продолжает расти',
      en: 'INNOVED Team Continues to Grow'
    },
    excerpt: {
      ru: 'В нашу команду присоединились новые специалисты по таможенному оформлению.',
      en: 'New customs clearance specialists have joined our team.'
    },
    content: {
      ru: `Мы рады приветствовать новых членов команды ИННОВЭД!

## Укрепление экспертизы

В этом месяце к нам присоединились три опытных специалиста:

- **Специалист по ВЭД с Китаем** — 8 лет опыта работы с китайскими поставщиками
- **Эксперт по сертификации** — знание всех технических регламентов ЕАЭС
- **Специалист по транспортной логистике** — оптимизация маршрутов и снижение затрат

## Что это значит для клиентов?

- Ещё более быстрая обработка заявок
- Расширенная экспертиза в специфических направлениях
- Больше возможностей для комплексного обслуживания

Добро пожаловать в команду!`,
      en: `We are pleased to welcome new members to the INNOVED team!

## Strengthening Expertise

This month, three experienced specialists joined us:

- **China Trade Specialist** — 8 years of experience working with Chinese suppliers
- **Certification Expert** — knowledge of all EAEU technical regulations
- **Transport Logistics Specialist** — route optimization and cost reduction

## What Does This Mean for Clients?

- Even faster application processing
- Expanded expertise in specific areas
- More opportunities for comprehensive service

Welcome to the team!`
    }
  }
];
