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
        title: 'Экспорт товаров из России с ИННОВЭД — электронное декларирование и валютный контроль',
        description: 'Полный комплекс услуг по экспорту товаров из России для бизнеса. Таможенное оформление, подтверждение 0% НДС и сопровождение валютного контроля от ИННОВЭД.',
        keywords: 'экспорт товаров, ВЭД-услуги, электронное декларирование, валютный контроль, таможенное оформление экспорта, нулевая ставка НДС, ИННОВЭД',
      },
      en: {
        title: 'Export of Goods from Russia with INNOVED — Electronic Declaration and Currency Control',
        description: 'Full range of export services for businesses in Russia. Customs clearance, 0% VAT confirmation and currency control support from INNOVED.',
        keywords: 'goods export, foreign trade services, electronic declaration, currency control, export customs clearance, zero VAT rate, INNOVED',
      },
    },
    content: {
      ru: {
        intro: 'Выход на зарубежные рынки требует безупречного оформления экспортных документов, точности кодов ТН ВЭД и уверенного взаимодействия с таможней. Ошибка в декларации может задержать поставку или повлечь валютные риски. ИННОВЭД предоставляет компаниям комплексную услугу экспорта товаров из России, охватывающую таможенное оформление, электронное декларирование, сопровождение валютного контроля и подтверждение нулевой ставки НДС.\n\nМы помогаем экспортёрам работать стабильно, автоматизируя все этапы внешнеэкономических операций и гарантируя предсказуемость сроков. Благодаря цифровым решениям и опыту работы с зарубежными контрагентами, ИННОВЭД снижает барьеры при выходе на внешние рынки и делает процесс полностью удобным для вашего бизнеса.',
        sections: [
          {
            title: 'Почему выбирают ИННОВЭД',
            items: [
              'Комплексное сопровождение экспорта — мы берём на себя всё: от анализа товарных кодов до подтверждения вывоза груза за пределы РФ.',
              'Бесшовная интеграция с бухгалтерией клиента — документы формируются в соответствии с вашими внутренними системами учёта, что ускоряет внутренние процессы.',
              'Конфиденциальность и юридическая чистота — все операции соответствуют требованиям валютного, налогового и таможенного законодательства.',
              'Гибкие экспортные решения — мы подстраиваем процесс под тип поставки: от мелкооптовых партий до регулярных контрактов с крупными объёмами.',
              'Гарантированная прозрачность отчётности — каждый этап виден онлайн, включая дату выпуска декларации и прохождение валютного контроля.',
            ],
          },
          {
            title: 'Как проходит экспорт товаров',
            steps: [
              {
                title: 'Предварительная консультация',
                text: 'Специалист оценивает специфику товаров и требования страны-получателя.',
              },
              {
                title: 'Подготовка экспортной декларации',
                text: 'Формируем корректный пакет документов с электронным декларированием через ФТС.',
              },
              {
                title: 'Проверка кодов и происхождения товара',
                text: 'Корректно подбираем ТН ВЭД, определяем льготы и тарифы.',
              },
              {
                title: 'Организация выпуска',
                text: 'Контролируем оформление, подтверждаем вывоз груза и получаем отметку таможни.',
              },
              {
                title: 'Валютный контроль и отчётность',
                text: 'Передаём данные для банка, обеспечивая соблюдение всех требований валютного законодательства.',
              },
            ],
          },
          {
            title: 'Что вы получаете',
            items: [
              'Ускорение выхода на зарубежный рынок без бюрократических сложностей.',
              'Снижение валютных и налоговых рисков при оформлении документов.',
              'Оптимизацию экспортных процессов за счёт автоматизации и цифровых интеграций.',
              'Поддержку специалиста по международной логистике и ВЭД-консалтингу.',
              'Гарантию корректного оформления подтверждения нулевой ставки НДС.',
            ],
          },
        ],
        cta: 'Отправьте заявку на оформление экспорта товаров в любое время — специалисты ИННОВЭД готовы подключиться 24/7.',
      },
      en: {
        intro: 'Entering foreign markets requires impeccable export documentation, accurate HS codes, and confident interaction with customs. A mistake in the declaration can delay shipment or entail currency risks. INNOVED provides companies with comprehensive export services from Russia, covering customs clearance, electronic declaration, currency control support, and zero VAT rate confirmation.\n\nWe help exporters work consistently by automating all stages of foreign trade operations and guaranteeing predictable timelines. Thanks to digital solutions and experience working with foreign counterparties, INNOVED reduces barriers to entering foreign markets and makes the process completely convenient for your business.',
        sections: [
          {
            title: 'Why Choose INNOVED',
            items: [
              'Comprehensive export support — we handle everything: from analyzing product codes to confirming cargo export outside the Russian Federation.',
              'Seamless integration with client accounting — documents are prepared in accordance with your internal accounting systems, speeding up internal processes.',
              'Confidentiality and legal compliance — all operations comply with currency, tax, and customs legislation requirements.',
              'Flexible export solutions — we adapt the process to the type of delivery: from small wholesale batches to regular contracts with large volumes.',
              'Guaranteed reporting transparency — every stage is visible online, including declaration release date and currency control passage.',
            ],
          },
          {
            title: 'How Goods Export Works',
            steps: [
              {
                title: 'Preliminary consultation',
                text: 'A specialist evaluates the specifics of goods and requirements of the destination country.',
              },
              {
                title: 'Export declaration preparation',
                text: 'We prepare the correct package of documents with electronic declaration through FCS.',
              },
              {
                title: 'Code and origin verification',
                text: 'We correctly select HS codes, determine benefits and tariffs.',
              },
              {
                title: 'Release organization',
                text: 'We control the processing, confirm cargo export and receive customs mark.',
              },
              {
                title: 'Currency control and reporting',
                text: 'We transfer data to the bank, ensuring compliance with all currency legislation requirements.',
              },
            ],
          },
          {
            title: 'What You Get',
            items: [
              'Accelerated entry into foreign markets without bureaucratic complications.',
              'Reduced currency and tax risks in document processing.',
              'Optimization of export processes through automation and digital integrations.',
              'Support from international logistics and foreign trade consulting specialists.',
              'Guarantee of correct zero VAT rate confirmation documentation.',
            ],
          },
        ],
        cta: 'Submit an export application at any time — INNOVED specialists are ready to connect 24/7.',
      },
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
