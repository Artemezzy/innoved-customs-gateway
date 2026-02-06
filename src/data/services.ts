import type { Locale } from '@/services/hygraph';

export interface ServiceContent {
  intro: string;
  sections: Array<{
    title: string;
    items?: string[];
    steps?: Array<{ title: string; text: string }>;
  }>;
  cta: string;
}

export interface ServiceSEO {
  title: string;
  description: string;
  keywords: string;
}

export interface ServiceData {
  slug: string;
  icon: string;
  title: Record<Locale, string>;
  seo: Record<Locale, ServiceSEO>;
  content: Record<Locale, ServiceContent | null>;
}

export const servicesData: ServiceData[] = [
  {
    slug: 'import',
    icon: 'Package',
    title: {
      ru: 'Оформление импорта',
      en: 'Import Registration',
    },
    seo: {
      ru: {
        title: 'Оформление импорта с ИННОВЭД — круглосуточное электронное декларирование по России',
        description: 'Комплексное оформление импорта для бизнеса по всей России. Электронное декларирование, автоматизация, выделенный менеджер и скорость от ИННОВЭД.',
        keywords: 'оформление импорта, таможенное оформление, ВЭД-услуги, электронное декларирование, импорт товаров, сертификация, ИННОВЭД',
      },
      en: {
        title: 'Import Registration with INNOVED — 24/7 Electronic Customs Clearance in Russia',
        description: 'Comprehensive import registration for businesses across Russia. Electronic declaration, automation, dedicated manager and speed from INNOVED.',
        keywords: 'import registration, customs clearance, foreign trade services, electronic declaration, import goods, certification, INNOVED',
      },
    },
    content: {
      ru: {
        intro: 'Грамотное оформление импорта — основа успешного ввоза товаров на территорию России. Одно неточное указание в декларации может обернуться задержкой груза, дополнительной проверкой или штрафами. ИННОВЭД берёт на себя всю рутину: от подготовки документов до выпуска товара, обеспечивая вам спокойствие и предсказуемость сроков.',
        sections: [
          {
            title: 'Почему выбирают ИННОВЭД',
            items: [
              'Электронное декларирование — мы работаем по защищённым каналам связи с таможенными органами, а значит, ваша декларация подаётся в режиме онлайн без потери времени.',
              'Работаем 24/7 — таможня не ждёт. Мы выстраиваем процесс так, чтобы отправить декларацию в наиболее оптимальное время.',
              'Любые посты по всей России — независимо от точки прибытия вашего груза, мы оформим его удалённо.',
              'Выделенный менеджер — один ответственный специалист ведёт вашу сделку от начала до конца, знает все детали и оперативно отвечает на вопросы.',
              'Автоматизация и контроль — собственные IT-решения позволяют снизить человеческий фактор, отслеживать статус груза и формировать отчётность в реальном времени.',
            ],
          },
          {
            title: 'Как проходит оформление импорта',
            steps: [
              {
                title: 'Получаем документы',
                text: 'Вы передаёте нам контракт, инвойсы, упаковочные листы, транспортные документы, сертификаты и иные документы при наличии.',
              },
              {
                title: 'Анализируем и готовим',
                text: 'Проверяем полноту сведений, определяем или проверяем код ТН ВЭД, рассчитываем платежи.',
              },
              {
                title: 'Подаём декларацию',
                text: 'Формируем электронную декларацию и направляем её в таможенный орган через защищённый канал.',
              },
              {
                title: 'Сопровождаем до выпуска',
                text: 'Отвечаем на запросы таможни, вносим корректировки, при необходимости — организуем досмотр и согласовываем его с вами.',
              },
              {
                title: 'Передаём документы',
                text: 'После выпуска вы получаете заверенные копии декларации и уведомление о готовности забрать груз.',
              },
            ],
          },
          {
            title: 'Что вы получаете',
            items: [
              'Прозрачные сроки — понятный график оформления, никаких «подождите ещё».',
              'Минимум рисков — грамотная подготовка документов исключает большинство доначислений и штрафов.',
              'Экономию времени — вы занимаетесь бизнесом, пока мы занимаемся таможней.',
              'Единое окно — весь импорт ведёт одна команда, без лишних согласований между подрядчиками.',
              'Отчётность — еженедельные сводки по статусу, платежам и срокам по каждой партии.',
            ],
          },
        ],
        cta: 'Готовы начать? Оставьте заявку, и менеджер свяжется с вами в течение 15 минут.',
      },
      en: {
        intro: 'Proper import registration is the foundation of successful goods import into Russia. A single inaccuracy in the declaration can result in cargo delays, additional inspections, or fines. INNOVED handles all the routine work: from document preparation to goods release, ensuring your peace of mind and predictable timelines.',
        sections: [
          {
            title: 'Why Choose INNOVED',
            items: [
              'Electronic declaration — we work through secure communication channels with customs authorities, meaning your declaration is submitted online without wasting time.',
              'We work 24/7 — customs doesn\'t wait. We organize the process to submit declarations at the optimal time.',
              'Any posts across Russia — regardless of your cargo arrival point, we\'ll process it remotely.',
              'Dedicated manager — one responsible specialist handles your transaction from start to finish, knows all the details, and promptly answers questions.',
              'Automation and control — our own IT solutions reduce human error, track cargo status, and generate reports in real-time.',
            ],
          },
          {
            title: 'How Import Registration Works',
            steps: [
              {
                title: 'We receive documents',
                text: 'You provide us with the contract, invoices, packing lists, transport documents, certificates, and other available documents.',
              },
              {
                title: 'We analyze and prepare',
                text: 'We check completeness of information, determine or verify the HS code, calculate payments.',
              },
              {
                title: 'We submit the declaration',
                text: 'We create the electronic declaration and send it to customs through a secure channel.',
              },
              {
                title: 'We accompany until release',
                text: 'We respond to customs requests, make corrections, and if necessary, organize inspection and coordinate it with you.',
              },
              {
                title: 'We deliver documents',
                text: 'After release, you receive certified copies of the declaration and notification that the cargo is ready for pickup.',
              },
            ],
          },
          {
            title: 'What You Get',
            items: [
              'Transparent timelines — a clear processing schedule, no more "please wait."',
              'Minimal risks — proper document preparation eliminates most additional charges and fines.',
              'Time savings — you focus on business while we handle customs.',
              'Single window — all imports are managed by one team, without unnecessary coordination between contractors.',
              'Reporting — weekly summaries on status, payments, and timelines for each shipment.',
            ],
          },
        ],
        cta: 'Ready to start? Leave a request and a manager will contact you within 15 minutes.',
      },
    },
  },
  {
    slug: 'export',
    icon: 'Plane',
    title: {
      ru: 'Оформление экспорта',
      en: 'Export Registration',
    },
    seo: {
      ru: {
        title: 'Оформление экспорта — ИННОВЭД',
        description: 'Профессиональное оформление экспорта товаров из России.',
        keywords: 'оформление экспорта, таможенное оформление, экспорт товаров',
      },
      en: {
        title: 'Export Registration — INNOVED',
        description: 'Professional export registration of goods from Russia.',
        keywords: 'export registration, customs clearance, goods export',
      },
    },
    content: {
      ru: null,
      en: null,
    },
  },
  {
    slug: 'hs-code',
    icon: 'FileSearch',
    title: {
      ru: 'Определение кода ТН ВЭД',
      en: 'HS Code Determination',
    },
    seo: {
      ru: {
        title: 'Определение кода ТН ВЭД — ИННОВЭД',
        description: 'Профессиональное определение кода ТН ВЭД для ваших товаров.',
        keywords: 'код ТН ВЭД, классификация товаров, таможенное оформление',
      },
      en: {
        title: 'HS Code Determination — INNOVED',
        description: 'Professional HS code determination for your goods.',
        keywords: 'HS code, goods classification, customs clearance',
      },
    },
    content: {
      ru: null,
      en: null,
    },
  },
  {
    slug: 'fts-registration',
    icon: 'UserPlus',
    title: {
      ru: 'Регистрация импортёра в ЛК ФТС',
      en: 'Importer Registration in FCS Personal Account',
    },
    seo: {
      ru: {
        title: 'Регистрация импортёра в ЛК ФТС — ИННОВЭД',
        description: 'Помощь в регистрации импортёра в личном кабинете ФТС.',
        keywords: 'регистрация ФТС, личный кабинет ФТС, импортёр',
      },
      en: {
        title: 'Importer Registration in FCS — INNOVED',
        description: 'Assistance with importer registration in FCS personal account.',
        keywords: 'FCS registration, FCS personal account, importer',
      },
    },
    content: {
      ru: null,
      en: null,
    },
  },
  {
    slug: 'certification',
    icon: 'Shield',
    title: {
      ru: 'Организация получения сертификатов и декларация соответствия',
      en: 'Organization of Certificates and Declaration of Conformity',
    },
    seo: {
      ru: {
        title: 'Сертификация и декларирование соответствия — ИННОВЭД',
        description: 'Организация получения сертификатов и деклараций соответствия.',
        keywords: 'сертификация, декларация соответствия, сертификат',
      },
      en: {
        title: 'Certification and Declaration of Conformity — INNOVED',
        description: 'Organization of certificates and declarations of conformity.',
        keywords: 'certification, declaration of conformity, certificate',
      },
    },
    content: {
      ru: null,
      en: null,
    },
  },
  {
    slug: 'customs-letters',
    icon: 'Mail',
    title: {
      ru: 'Подготовка писем в таможенные органы',
      en: 'Preparation of Letters to Customs Authorities',
    },
    seo: {
      ru: {
        title: 'Подготовка писем в таможенные органы — ИННОВЭД',
        description: 'Подготовка официальных писем и запросов в таможенные органы.',
        keywords: 'письма в таможню, запросы в ФТС, таможенные органы',
      },
      en: {
        title: 'Preparation of Letters to Customs — INNOVED',
        description: 'Preparation of official letters and requests to customs authorities.',
        keywords: 'letters to customs, FCS requests, customs authorities',
      },
    },
    content: {
      ru: null,
      en: null,
    },
  },
  {
    slug: 'inspection',
    icon: 'ScanLine',
    title: {
      ru: 'Организация досмотра товаров',
      en: 'Organization of Goods Inspection',
    },
    seo: {
      ru: {
        title: 'Организация досмотра товаров — ИННОВЭД',
        description: 'Профессиональная организация таможенного досмотра товаров.',
        keywords: 'досмотр товаров, таможенный досмотр, осмотр груза',
      },
      en: {
        title: 'Goods Inspection Organization — INNOVED',
        description: 'Professional organization of customs goods inspection.',
        keywords: 'goods inspection, customs inspection, cargo examination',
      },
    },
    content: {
      ru: null,
      en: null,
    },
  },
  {
    slug: 'translation',
    icon: 'Languages',
    title: {
      ru: 'Перевод документов',
      en: 'Document Translation',
    },
    seo: {
      ru: {
        title: 'Перевод документов — ИННОВЭД',
        description: 'Профессиональный перевод документов для таможенного оформления.',
        keywords: 'перевод документов, перевод для таможни, ВЭД',
      },
      en: {
        title: 'Document Translation — INNOVED',
        description: 'Professional document translation for customs clearance.',
        keywords: 'document translation, customs translation, foreign trade',
      },
    },
    content: {
      ru: null,
      en: null,
    },
  },
];

// Helper function to get service by slug
export const getServiceBySlug = (slug: string): ServiceData | undefined => {
  return servicesData.find((service) => service.slug === slug);
};

// Helper function to get all services for a locale
export const getServicesForLocale = (locale: Locale) => {
  return servicesData.map((service) => ({
    id: service.slug,
    slug: service.slug,
    title: service.title[locale],
    icon: service.icon,
    description: '',
    order: servicesData.indexOf(service),
    isActive: true,
  }));
};
