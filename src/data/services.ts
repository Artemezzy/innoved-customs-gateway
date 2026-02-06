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
        title: 'Определение кода ТН ВЭД ЕАЭС — уточнение классификации товаров с ИННОВЭД',
        description: 'Профессиональное определение кода ТН ВЭД для импорта и экспорта. Анализ номенклатуры, оформление экспертного заключения и сопровождение внешнеэкономической документации.',
        keywords: 'код ТН ВЭД, классификация товаров ЕАЭС, экспертное определение ТН ВЭД, таможенная номенклатура, обоснование кода, расчёт пошлины, ИННОВЭД',
      },
      en: {
        title: 'EAEU HS Code Determination — Product Classification with INNOVED',
        description: 'Professional HS code determination for import and export. Nomenclature analysis, expert opinion preparation and foreign trade documentation support.',
        keywords: 'HS code, EAEU product classification, expert HS code determination, customs nomenclature, code justification, duty calculation, INNOVED',
      },
    },
    content: {
      ru: {
        intro: 'Корректное определение кода ТН ВЭД — один из самых ответственных этапов внешнеэкономической деятельности. От него зависит размер пошлин, необходимость сертификации, скорость таможенного оформления и даже финансовые риски компании. Ошибка в выборе классификации может привести к задержке груза и штрафным санкциям.\n\nИННОВЭД помогает определить точные коды ТН ВЭД ЕАЭС для любых видов товаров, используя экспертный анализ описаний, техдокументации и судебную практику. Мы подбираем код с учётом специфики импорта, экспорта и применимых технических регламентов, чтобы ваш бизнес работал без сбоев и недоразумений с таможенными органами.',
        sections: [
          {
            title: 'Почему выбирают ИННОВЭД',
            items: [
              'Анализ по официальным методикам ЕАЭС — мы используем нормативную базу Комиссии ЕЭК и международную номенклатуру ГС.',
              'Опыт специалистов отраслевой классификации — команда охватывает технические направления: от электроники и текстиля до медоборудования и автокомпонентов.',
              'Сопровождение при запросах ФТС — при необходимости готовим обоснование классификации и пояснения для инспектора.',
              'Интеграция с сертификацией и декларированием — определённый код может быть сразу использован при подготовке документов в рамках ВЭД.',
              'Поддержка изменений в кодировке — мы следим за обновлениями номенклатуры и корректируем коды при изменении структуры ТН ВЭД.',
            ],
          },
          {
            title: 'Как проходит определение кода ТН ВЭД',
            steps: [
              {
                title: 'Приём заявки и описание товара',
                text: 'Клиент передаёт спецификацию, фото, характеристики или паспорт изделия.',
              },
              {
                title: 'Первичный анализ',
                text: 'Эксперт сопоставляет товар с позициями номенклатуры и уточняет критерии классификации.',
              },
              {
                title: 'Сравнение с аналогами и прецедентами',
                text: 'Используются открытые решения ФТС и международные базы данных.',
              },
              {
                title: 'Формирование заключения',
                text: 'Клиент получает отчёт с обоснованием выбранного кода и ссылками на нормативные акты ЕАЭС.',
              },
              {
                title: 'Оформление экспертного письма',
                text: 'При необходимости документ можно использовать при сертификации или подаче декларации.',
              },
            ],
          },
          {
            title: 'Что вы получаете',
            items: [
              'Корректные коды для расчёта пошлин и НДС при импорте и экспорте.',
              'Минимизацию рисков при проверках ФТС и валютного контроля.',
              'Готовность к интеграции с электронным декларированием.',
              'Поддержку при подготовке документов для сертификации и маркировки.',
              'Прозрачный отчёт, понятный бухгалтерии, юристам и логистам.',
            ],
          },
        ],
        cta: 'Заполните заявку на определение кода ТН ВЭД — специалисты ИННОВЭД помогут классифицировать ваш товар по действующей номенклатуре и подготовят обоснование для использования в документации.',
      },
      en: {
        intro: 'Correct HS code determination is one of the most critical stages of foreign trade activity. It determines the amount of duties, the need for certification, the speed of customs clearance, and even the financial risks of the company. An error in classification choice can lead to cargo delays and penalties.\n\nINNOVED helps determine accurate EAEU HS codes for all types of goods using expert analysis of descriptions, technical documentation, and judicial practice. We select codes considering the specifics of import, export, and applicable technical regulations so that your business operates without failures and misunderstandings with customs authorities.',
        sections: [
          {
            title: 'Why Choose INNOVED',
            items: [
              'Analysis according to official EAEU methodologies — we use the regulatory framework of the EEC Commission and the international HS nomenclature.',
              'Experience of industry classification specialists — the team covers technical areas: from electronics and textiles to medical equipment and automotive components.',
              'Support for FCS requests — if necessary, we prepare classification justification and explanations for the inspector.',
              'Integration with certification and declaration — the determined code can be immediately used when preparing documents within foreign trade.',
              'Support for coding changes — we monitor nomenclature updates and adjust codes when the HS code structure changes.',
            ],
          },
          {
            title: 'How HS Code Determination Works',
            steps: [
              {
                title: 'Application receipt and product description',
                text: 'The client provides specification, photos, characteristics, or product passport.',
              },
              {
                title: 'Primary analysis',
                text: 'The expert compares the product with nomenclature items and clarifies classification criteria.',
              },
              {
                title: 'Comparison with analogues and precedents',
                text: 'Open FCS decisions and international databases are used.',
              },
              {
                title: 'Conclusion preparation',
                text: 'The client receives a report with justification of the selected code and references to EAEU regulatory acts.',
              },
              {
                title: 'Expert letter preparation',
                text: 'If necessary, the document can be used for certification or declaration submission.',
              },
            ],
          },
          {
            title: 'What You Get',
            items: [
              'Correct codes for calculating duties and VAT on import and export.',
              'Minimizing risks during FCS inspections and currency control.',
              'Readiness for integration with electronic declaration.',
              'Support in preparing documents for certification and labeling.',
              'Transparent report understandable to accountants, lawyers, and logisticians.',
            ],
          },
        ],
        cta: 'Submit an application for HS code determination — INNOVED specialists will help classify your product according to the current nomenclature and prepare justification for use in documentation.',
      },
    },
  },
  {
    slug: 'ved-consulting',
    icon: 'UserPlus',
    title: {
      ru: 'ВЭД-консалтинг',
      en: 'Foreign Trade Consulting',
    },
    seo: {
      ru: {
        title: 'ВЭД-консалтинг для бизнеса — стратегия и сопровождение с ИННОВЭД',
        description: 'Консультации по внешнеэкономической деятельности. Анализ контрактов, оценка пошлин, оптимизация схем поставок и валютных операций с ИННОВЭД.',
        keywords: 'консультация ВЭД, оптимизация внешнеэкономической деятельности, анализ внешнеторговых контрактов, стратегическое сопровождение ВЭД, планирование импорта, экспортный консалтинг, ИННОВЭД',
      },
      en: {
        title: 'Foreign Trade Consulting for Business — Strategy and Support from INNOVED',
        description: 'Foreign trade consulting services. Contract analysis, duty assessment, supply chain optimization and currency operations with INNOVED.',
        keywords: 'foreign trade consulting, foreign economic activity optimization, trade contract analysis, strategic FEA support, import planning, export consulting, INNOVED',
      },
    },
    content: {
      ru: {
        intro: 'Внешнеэкономическая деятельность становится всё сложнее: постоянные изменения в тарифах, таможенных процедурах и международных соглашениях требуют точной стратегии и системного подхода. ИННОВЭД предоставляет профессиональный ВЭД-консалтинг — комплекс консультаций, направленных на повышение экономической эффективности и минимизацию рисков при импорте и экспорте.\n\nМы помогаем компаниям выстраивать оптимальные схемы поставок, документальное сопровождение и управленческую прозрачность внешнеторговых операций — от первой сделки до устойчивой системы международных поставок.',
        sections: [
          {
            title: 'Почему выбирают ИННОВЭД',
            items: [
              'Опыт работы с широким спектром отраслей — наша команда консультирует производителей, дистрибьюторов, торговые сети и маркетплейс-селлеров, выходящих на экспорт.',
              'Финансовая оптимизация ВЭД — подбираем выгодные направления регулирования, снижаем таможенные и логистические расходы, предлагаем схемы с учётом валютного законодательства.',
              'Анализ договорных отношений — проверяем внешнеторговые контракты на соответствие требованиям ЕАЭС и минимизируем юридические риски.',
              'Планирование таможенного бюджета — рассчитываем прогноз пошлин, сборов, акцизов и валютных расходов для конкретных категорий товаров.',
              'Консультирование при выходе на новые рынки — предоставляем информацию о сертификационных требованиях и особенностях национальных регламентов стран-партнёров.',
            ],
          },
          {
            title: 'Как проходит процесс консалтинга',
            steps: [
              {
                title: 'Выявление потребностей',
                text: 'Мы анализируем специфику компании, ассортимент товаров, географию поставок и задачи клиента.',
              },
              {
                title: 'Диагностика текущих процессов',
                text: 'Проверяем экономику поставок, контрактные условия и соответствие регламентам ЕАЭС.',
              },
              {
                title: 'Подготовка рекомендаций',
                text: 'Формируем персонализированные решения по оптимизации ВЭД-цепочек, документооборота и расчётов.',
              },
              {
                title: 'Согласование стратегии',
                text: 'Представляем варианты реализации с оценкой поля рисков и финансовых эффектов.',
              },
              {
                title: 'Сопровождение внедрения',
                text: 'Консультируем при переговорах, изменении схем логистики, регистрации участников и подключении к ЛК ФТС.',
              },
            ],
          },
          {
            title: 'Что вы получаете',
            items: [
              'Стратегию развития ВЭД с учётом особенностей вашего бизнеса.',
              'Экспертные расчёты себестоимости поставок и пошлин.',
              'Минимизацию ошибок при заключении внешнеторговых контрактов.',
              'Консультационную поддержку при взаимодействии с банками и партнёрами по странам ЕАЭС.',
              'Возможность управлять ВЭД-процессами прозрачно и прогнозируемо.',
            ],
          },
        ],
        cta: 'Заполните заявку на ВЭД-консалтинг — специалисты ИННОВЭД проведут анализ вашей деятельности и предложат решения для снижения издержек, оптимизации логистики и повышения эффективности экспорта или импорта.',
      },
      en: {
        intro: 'Foreign economic activity is becoming increasingly complex: constant changes in tariffs, customs procedures, and international agreements require a precise strategy and systematic approach. INNOVED provides professional foreign trade consulting — a set of consultations aimed at increasing economic efficiency and minimizing risks in import and export.\n\nWe help companies build optimal supply chains, document support, and management transparency of foreign trade operations — from the first deal to a sustainable international supply system.',
        sections: [
          {
            title: 'Why Choose INNOVED',
            items: [
              'Experience across a wide range of industries — our team consults manufacturers, distributors, retail chains, and marketplace sellers entering export.',
              'Financial optimization of foreign trade — we select beneficial regulatory directions, reduce customs and logistics costs, offer schemes considering currency legislation.',
              'Contract relationship analysis — we check foreign trade contracts for compliance with EAEU requirements and minimize legal risks.',
              'Customs budget planning — we calculate forecasts for duties, fees, excises, and currency expenses for specific product categories.',
              'Consulting when entering new markets — we provide information on certification requirements and features of national regulations of partner countries.',
            ],
          },
          {
            title: 'How the Consulting Process Works',
            steps: [
              {
                title: 'Identifying needs',
                text: 'We analyze the company specifics, product range, delivery geography, and client objectives.',
              },
              {
                title: 'Diagnosing current processes',
                text: 'We check supply economics, contract terms, and compliance with EAEU regulations.',
              },
              {
                title: 'Preparing recommendations',
                text: 'We form personalized solutions for optimizing FEA chains, document flow, and calculations.',
              },
              {
                title: 'Strategy approval',
                text: 'We present implementation options with risk field assessment and financial effects.',
              },
              {
                title: 'Implementation support',
                text: 'We consult during negotiations, logistics scheme changes, participant registration, and connection to the FCS Personal Account.',
              },
            ],
          },
          {
            title: 'What You Get',
            items: [
              'FEA development strategy tailored to your business specifics.',
              'Expert calculations of supply costs and duties.',
              'Minimization of errors when concluding foreign trade contracts.',
              'Consulting support when interacting with banks and partners in EAEU countries.',
              'Ability to manage FEA processes transparently and predictably.',
            ],
          },
        ],
        cta: 'Submit a request for foreign trade consulting — INNOVED specialists will analyze your activities and offer solutions to reduce costs, optimize logistics, and improve export or import efficiency.',
      },
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
        title: 'Сертификация и декларации для маркетплейсов и импорта — ИННОВЭД',
        description: 'Комплексное оформление сертификатов и деклараций по ТР ТС для импорта и маркетплейсов. Лабораторные испытания, онлайн-регистрация и консультации от ИННОВЭД.',
        keywords: 'сертификация маркетплейс, декларация ЕАЭС, сертификат продукции, технические регламенты, маркировка товара, регистрация сертификации, ИННОВЭД',
      },
      en: {
        title: 'Certification and Declarations for Marketplaces and Import — INNOVED',
        description: 'Comprehensive certification and declarations under TR CU for import and marketplaces. Laboratory testing, online registration and consultations from INNOVED.',
        keywords: 'marketplace certification, EAEU declaration, product certificate, technical regulations, product labeling, certification registration, INNOVED',
      },
    },
    content: {
      ru: {
        intro: 'Для ввоза, производства или экспорта товаров в России подтверждение соответствия требованиям технических регламентов — обязательное условие законного обращения продукции. Ошибка в выборе схемы сертификации или подаче документов может привести к блокировке продаж и потере времени. ИННОВЭД помогает компаниям быстро и корректно получить сертификаты соответствия, декларации ЕАЭС и техническую документацию, освобождая бизнес от бюрократических сложностей.\n\nМы обеспечиваем полный цикл — от анализа продукции и расчёта кодов ТН ВЭД до регистрации документов в официальных реестрах Росаккредитации.',
        sections: [
          {
            title: 'Почему выбирают ИННОВЭД',
            items: [
              'Комплексный подход — одно окно для всех процедур сертификации и декларирования.',
              'Проверенные испытательные лаборатории — гарантированный допуск протоколов и быстрое подтверждение соответствия.',
              'Точная идентификация кодов ТН ВЭД и ТР ТС — исключаем ошибки, приводящие к отзыву документов.',
              'Электронное оформление — все процессы выполняются удалённо с юридической силой электронных подписей.',
              'Консультации по интеграции с маркетплейсами — готовим пакеты документов, которые успешно проходят валидацию на площадках.',
            ],
          },
          {
            title: 'Как проходит процесс сертификации',
            steps: [
              {
                title: 'Определение категории товаров и требований',
                text: 'Анализируем назначение и технические характеристики продукции.',
              },
              {
                title: 'Выбор схемы подтверждения соответствия',
                text: 'Помогаем определить — сертификат, декларация, добровольная сертификация.',
              },
              {
                title: 'Формирование документации',
                text: 'Подготавливаем заявки, технические описания, инструкции и макеты маркировки.',
              },
              {
                title: 'Проведение испытаний',
                text: 'Координируем процесс тестирования образцов в аккредитованных лабораториях.',
              },
              {
                title: 'Регистрация документов',
                text: 'Декларация или сертификат вносится в реестр Росаккредитации с электронным подтверждением.',
              },
            ],
          },
          {
            title: 'Основные ТР ТС, с которыми мы работаем',
            items: [
              'ТР ТС 004/2011 — О безопасности низковольтного оборудования.',
              'ТР ТС 010/2011 — О безопасности машин и оборудования.',
              'ТР ТС 020/2011 — Электромагнитная совместимость технических средств.',
              'ТР ТС 007/2011 — Продукция для детей и подростков.',
              'ТР ТС 017/2011 — Лёгкая промышленность.',
              'ТР ТС 021/2011 — Пищевая продукция.',
              'ТР ТС 008/2011 — Игрушки.',
              'ТР ТС 009/2011 — Парфюмерно-косметическая продукция.',
              'ТР ТС 025/2012 — Мебельная продукция.',
            ],
          },
          {
            title: 'Что вы получаете',
            items: [
              'Документы, принимаемые всеми маркетплейсами России и ЕАЭС.',
              'Согласованную упаковку и маркировку в соответствии с ТР ТС.',
              'Экономию времени — оформление и регистрация полностью онлайн.',
              'Индивидуальное сопровождение с консультацией по требованиям торговых площадок.',
              'Актуальные шаблоны и инструкции для размещения товаров в карточках.',
            ],
          },
        ],
        cta: 'Подайте заявку на организацию получения сертификатов и деклараций соответствия — специалисты ИННОВЭД помогут определить нужные ТР ТС, оформить документы и внести их в реестр.',
      },
      en: {
        intro: 'For importing, manufacturing, or exporting goods in Russia, confirming compliance with technical regulations is a mandatory condition for legal product circulation. An error in choosing a certification scheme or submitting documents can lead to sales blocking and time loss. INNOVED helps companies quickly and correctly obtain conformity certificates, EAEU declarations, and technical documentation, freeing business from bureaucratic complexities.\n\nWe provide a full cycle — from product analysis and HS code calculation to document registration in official Rosaccreditation registries.',
        sections: [
          {
            title: 'Why Choose INNOVED',
            items: [
              'Comprehensive approach — one window for all certification and declaration procedures.',
              'Verified testing laboratories — guaranteed protocol acceptance and fast conformity confirmation.',
              'Accurate identification of HS codes and TR CU — we eliminate errors leading to document withdrawal.',
              'Electronic processing — all processes are performed remotely with the legal force of electronic signatures.',
              'Marketplace integration consultations — we prepare document packages that successfully pass validation on platforms.',
            ],
          },
          {
            title: 'How the Certification Process Works',
            steps: [
              {
                title: 'Determining product category and requirements',
                text: 'We analyze the purpose and technical characteristics of the product.',
              },
              {
                title: 'Choosing conformity confirmation scheme',
                text: 'We help determine — certificate, declaration, voluntary certification.',
              },
              {
                title: 'Documentation preparation',
                text: 'We prepare applications, technical descriptions, instructions, and labeling layouts.',
              },
              {
                title: 'Conducting tests',
                text: 'We coordinate the sample testing process in accredited laboratories.',
              },
              {
                title: 'Document registration',
                text: 'The declaration or certificate is entered into the Rosaccreditation registry with electronic confirmation.',
              },
            ],
          },
          {
            title: 'Main TR CU We Work With',
            items: [
              'TR CU 004/2011 — On the safety of low voltage equipment.',
              'TR CU 010/2011 — On the safety of machinery and equipment.',
              'TR CU 020/2011 — Electromagnetic compatibility of technical means.',
              'TR CU 007/2011 — Products for children and adolescents.',
              'TR CU 017/2011 — Light industry.',
              'TR CU 021/2011 — Food products.',
              'TR CU 008/2011 — Toys.',
              'TR CU 009/2011 — Perfume and cosmetic products.',
              'TR CU 025/2012 — Furniture products.',
            ],
          },
          {
            title: 'What You Get',
            items: [
              'Documents accepted by all marketplaces in Russia and EAEU.',
              'Coordinated packaging and labeling in accordance with TR CU.',
              'Time savings — processing and registration completely online.',
              'Individual support with consultation on marketplace requirements.',
              'Current templates and instructions for placing products in listings.',
            ],
          },
        ],
        cta: 'Submit an application for organizing certificates and declarations of conformity — INNOVED specialists will help determine the necessary TR CU, prepare documents, and enter them in the registry.',
      },
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
        title: 'Подготовка писем в таможенные органы с ИННОВЭД — юридическое сопровождение ВЭД',
        description: 'Разработка и оформление писем, запросов и объяснений в ФТС России. Юридическая точность, аргументированность и сопровождение до результата от ИННОВЭД.',
        keywords: 'письмо в таможню, запрос в ФТС, объяснение инспектору, официальное обращение в таможенные органы, подготовка ответа ФТС, юридическая поддержка ВЭД, ИННОВЭД',
      },
      en: {
        title: 'Preparation of Letters to Customs Authorities with INNOVED — Legal FTA Support',
        description: 'Development and preparation of letters, requests, and explanations to Russian FCS. Legal accuracy, argumentation, and support until resolution from INNOVED.',
        keywords: 'letter to customs, FCS request, explanation to inspector, official appeal to customs authorities, FCS response preparation, legal FTA support, INNOVED',
      },
    },
    content: {
      ru: {
        intro: 'Обращение в таможенные органы требует точного понимания законодательства, правил документооборота и формулировок, которые исключают двусмысленность. Ошибка в тексте письма может привести к отказу, дополнительным проверкам или задержке партии. ИННОВЭД готовит юридически корректные письма, запросы и пояснения в ФТС России и региональные таможни, помогая компаниям урегулировать спорные ситуации и защитить свои интересы в рамках ВЭД.\n\nУслуга востребована среди участников внешнеэкономической деятельности, которые хотят минимизировать риски и выстроить официальную коммуникацию с контролирующими органами грамотно и аргументированно.',
        sections: [
          {
            title: 'Почему выбирают ИННОВЭД',
            items: [
              'Профессиональная юридическая точность — все письма составляются с опорой на действующий Таможенный кодекс ЕАЭС и административные регламенты.',
              'Индивидуальный подход к задаче — мы подбираем оптимальную структуру документа в зависимости от цели: запрос, объяснение, возражение или ходатайство.',
              'Практика взаимодействия с ФТС — используются проверенные формулировки, которые соответствуют требованиям делового оборота и канцелярского делопроизводства.',
              'Анализ и минимизация рисков — каждый текст проходит внутреннюю проверку на логичность и правовую состоятельность.',
              'Сопровождение до результата — мы не просто готовим письмо, а отслеживаем его прохождение и при необходимости помогаем с дополнительными комментариями для инспектора.',
            ],
          },
          {
            title: 'Как проходит подготовка письма',
            steps: [
              {
                title: 'Анализ ситуации',
                text: 'Мы изучаем контекст, причину обращения и позицию клиента по конкретной поставке или проверке.',
              },
              {
                title: 'Получение исходных данных',
                text: 'Клиент предоставляет документы, на основании которых требуется сформировать обоснование.',
              },
              {
                title: 'Подготовка проекта письма',
                text: 'Формулируются правовые доводы, ссылки на нормативные акты и фактические обстоятельства.',
              },
              {
                title: 'Согласование и редактирование',
                text: 'Текст приводится к официальному стилю и оформляется в соответствии с требованиями ФТС.',
              },
              {
                title: 'Отправка и сопровождение',
                text: 'Клиент получает итоговый документ в форматах для подачи через ЭДО или бумажным письмом.',
              },
            ],
          },
          {
            title: 'Что вы получаете',
            items: [
              'Законно обоснованные письма, которые повышают шансы на положительное рассмотрение.',
              'Оптимизацию коммуникаций с ФТС без привлечения внешних юрисконсультов.',
              'Минимизацию конфликтов и ускорение процесса принятия решений таможней.',
              'Возможность использовать шаблон ответа для аналогичных случаев в будущем.',
              'Поддержку в выстраивании официального делового тона и корректных формулировок.',
            ],
          },
        ],
        cta: 'Оформите заявку на подготовку письма в таможенные органы, и специалисты ИННОВЭД разработают документ, соответствующий требованиям законодательства и вашей конкретной ситуации.',
      },
      en: {
        intro: 'Contacting customs authorities requires precise understanding of legislation, document flow rules, and formulations that exclude ambiguity. An error in the letter text can lead to rejection, additional inspections, or shipment delays. INNOVED prepares legally correct letters, requests, and explanations to the Russian FCS and regional customs, helping companies resolve disputes and protect their interests within foreign trade activities.\n\nThis service is in demand among foreign trade participants who want to minimize risks and build official communication with regulatory authorities competently and with strong arguments.',
        sections: [
          {
            title: 'Why Choose INNOVED',
            items: [
              'Professional legal accuracy — all letters are prepared based on the current EAEU Customs Code and administrative regulations.',
              'Individual approach to the task — we select the optimal document structure depending on the purpose: request, explanation, objection, or petition.',
              'Practice of interaction with FCS — proven formulations are used that meet the requirements of business practice and clerical office work.',
              'Risk analysis and minimization — each text undergoes internal review for logic and legal validity.',
              'Support until resolution — we don\'t just prepare the letter, we track its progress and, if necessary, help with additional comments for the inspector.',
            ],
          },
          {
            title: 'How Letter Preparation Works',
            steps: [
              {
                title: 'Situation analysis',
                text: 'We study the context, reason for the appeal, and the client\'s position on a specific shipment or inspection.',
              },
              {
                title: 'Obtaining source data',
                text: 'The client provides documents based on which the justification needs to be formed.',
              },
              {
                title: 'Letter draft preparation',
                text: 'Legal arguments, references to regulations, and factual circumstances are formulated.',
              },
              {
                title: 'Approval and editing',
                text: 'The text is brought to official style and formatted in accordance with FCS requirements.',
              },
              {
                title: 'Sending and support',
                text: 'The client receives the final document in formats for submission via EDI or paper letter.',
              },
            ],
          },
          {
            title: 'What You Get',
            items: [
              'Legally substantiated letters that increase the chances of favorable consideration.',
              'Optimization of communications with FCS without involving external legal consultants.',
              'Minimization of conflicts and acceleration of customs decision-making process.',
              'Ability to use the response template for similar cases in the future.',
              'Support in building an official business tone and correct formulations.',
            ],
          },
        ],
        cta: 'Submit an application for preparing a letter to customs authorities, and INNOVED specialists will develop a document that meets legal requirements and your specific situation.',
      },
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
