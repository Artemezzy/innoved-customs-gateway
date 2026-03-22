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
      ru: 'Таможенное оформление импорта',
      en: 'Import Customs Clearance',
    },
    seo: {
      ru: {
        title: 'Таможенное оформление импорта',
        description: 'Услуги по таможенному оформление импорта. Официальный импорт грузов. Официальный импорт товаров. Растаможка товаров из Китая. Белый импорт.',
        keywords: 'таможенное оформление импорта, импорт в россию, таможенный брокер, электронное декларирование, ВЭД, растаможка товаров, ИННОВЭД',
      },
      en: {
        title: 'Import Customs Clearance',
        description: 'Import customs clearance services. Official cargo import. Official goods import. Customs clearance from China. White import.',
        keywords: 'import customs clearance, customs clearance russia, customs broker, electronic declaration, foreign trade, goods import, INNOVED',
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
      ru: 'Таможенное оформление экспорта',
      en: 'Export Customs Clearance',
    },
    seo: {
      ru: {
        title: 'Таможенное оформление экспорта',
        description: 'Услуги по таможенному оформлению экспорта. Официальный экспорт грузов. Официальный экспорт товаров. Вывоз товаров за рубеж.',
        keywords: 'таможенное оформление экспорта, экспорт из россии, экспортная декларация, валютный контроль, нулевая ставка НДС, таможенный брокер, ИННОВЭД',
      },
      en: {
        title: 'Export Customs Clearance',
        description: 'Export customs clearance services. Official cargo export. Official goods export. International shipping abroad.',
        keywords: 'export customs clearance, export from russia, export declaration, currency control, zero VAT rate, customs broker, INNOVED',
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
        title: 'Определение кода ТН ВЭД',
        description: 'Услуги по определению кода ТН ВЭД. Анализ номенклатуры, оформление экспертного заключения и сопровождение внешнеэкономической документации.',
        keywords: 'код ТН ВЭД, классификация товаров ЕАЭС, экспертное определение ТН ВЭД, таможенная номенклатура, обоснование кода, расчёт пошлины, ИННОВЭД',
      },
      en: {
        title: 'HS Code Determination',
        description: 'HS code determination services. Nomenclature analysis, expert opinion preparation and foreign trade documentation support.',
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
        title: 'Консультации по вэд',
        description: 'Консультации по внешнеэкономической деятельности. Анализ контрактов, оценка пошлин, оптимизация схем поставок и валютных операций с ИННОВЭД.',
        keywords: 'консультация ВЭД, оптимизация внешнеэкономической деятельности, анализ внешнеторговых контрактов, стратегическое сопровождение ВЭД, планирование импорта, экспортный консалтинг, ИННОВЭД',
      },
      en: {
        title: 'Foreign Trade Consulting',
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
        title: 'Сертификация товаров',
        description: 'Оформление сертификатов и деклараций по ТР ТС. Лабораторные испытания, онлайн-регистрация и консультации от ИННОВЭД.',
        keywords: 'сертификация маркетплейс, декларация ЕАЭС, сертификат продукции, технические регламенты, маркировка товара, регистрация сертификации, ИННОВЭД',
      },
      en: {
        title: 'Product Certification',
        description: 'Certificates and declarations under TR CU. Laboratory testing, online registration and consultations from INNOVED.',
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
        title: 'Запрос в таможенный орган',
        description: 'Разработка и оформление писем, запросов и объяснений в ФТС России. Юридическая точность, аргументированность и сопровождение до результата от ИННОВЭД.',
        keywords: 'письмо в таможню, запрос в ФТС, объяснение инспектору, официальное обращение в таможенные органы, подготовка ответа ФТС, юридическая поддержка ВЭД, ИННОВЭД',
      },
      en: {
        title: 'Customs Authority Request',
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
        title: 'Таможенный досмотр товаров',
        description: 'Организация таможенного досмотра товаров для бизнеса. Подготовка документов, координация участников, контроль прохождения и актов досмотра от ИННОВЭД.',
        keywords: 'организация досмотра, таможенный контроль товаров, сопровождение досмотра ФТС, координация досмотра груза, акт осмотра, проверка поставки на СВХ, ИННОВЭД',
      },
      en: {
        title: 'Customs Goods Inspection',
        description: 'Customs goods inspection organization for business. Document preparation, participant coordination, monitoring and inspection reports from INNOVED.',
        keywords: 'inspection organization, customs control goods, FCS inspection support, cargo inspection coordination, inspection report, delivery check at CWH, INNOVED',
      },
    },
    content: {
      ru: {
        intro: 'Таможенный досмотр — обязательная часть контроля при импорте и экспорте, которая требует точной координации участников процесса. Ошибки в организации могут привести к простоям транспорта, повреждению груза и финансовым потерям.\n\nИННОВЭД предлагает услугу организации досмотра товаров — полное сопровождение процедур на складе временного хранения или терминале, включая подготовку документов, взаимодействие с инспектором и контроль результатов осмотра.\n\nМы обеспечиваем прозрачность и оперативность на всех этапах, чтобы проверка прошла быстро, корректно и без замечаний со стороны таможни.',
        sections: [
          {
            title: 'Почему выбирают ИННОВЭД',
            items: [
              'Координация действий с таможней и СВХ — мы согласовываем дату и время досмотра, уведомляем инспектора и транспортную компанию.',
              'Документальная готовность — подготавливаем полный пакет сопроводительных документов, спецификаций и фотофиксацию для отчётности.',
              'Опыт работы с различными категориями товаров — от промышленных компонентов и электроники до текстиля, автозапчастей и оборудования.',
              'Контроль физического состояния груза — следим за целостностью упаковки, сохранностью пломб и правильностью пересчёта мест.',
              'Участие представителя на досмотре — при необходимости наш специалист присутствует на площадке, фиксируя ход и результаты процедуры.',
            ],
          },
          {
            title: 'Как проходит организация досмотра',
            steps: [
              {
                title: 'Получение уведомления о досмотре',
                text: 'Мы анализируем документ, определяем таможенный пост и временные рамки проведения процедуры.',
              },
              {
                title: 'Подготовка к проверке',
                text: 'Составляем перечень документов, оформляем заявку и направляем уведомление на склад временного хранения.',
              },
              {
                title: 'Координация участников',
                text: 'Уведомляем перевозчика, экспедитора и при необходимости контролируем транспортное прибытие.',
              },
              {
                title: 'Проведение досмотра',
                text: 'Организуем участие ответственных лиц, фото- и видеофиксацию, оформляем акт досмотра.',
              },
              {
                title: 'Отчётность',
                text: 'Передаём клиенту протокол с указанием результатов проверки и применённых мер.',
              },
            ],
          },
          {
            title: 'Что вы получаете',
            items: [
              'Снижение простоев и штрафов из-за несвоевременного прохождения досмотра.',
              'Полное соответствие процедур требованиям ФТС России.',
              'Контроль корректности действий инспектора и учёт интересов компании.',
              'Безопасность груза и подтверждённая фотофиксация результатов.',
              'Ускоренное завершение таможенного оформления после проверки.',
            ],
          },
        ],
        cta: 'Отправьте заявку на организацию досмотра товаров, и специалисты ИННОВЭД возьмут под контроль все этапы процедуры. Мы обеспечим согласование с ФТС, сопровождение представителя на месте и своевременное оформление всех результатов проверки.',
      },
      en: {
        intro: 'Customs inspection is a mandatory part of control during import and export, requiring precise coordination of process participants. Organizational errors can lead to transport downtime, cargo damage, and financial losses.\n\nINNOVED offers goods inspection organization services — complete procedure support at temporary storage warehouses or terminals, including document preparation, interaction with inspectors, and monitoring of inspection results.\n\nWe ensure transparency and efficiency at all stages so that the inspection proceeds quickly, correctly, and without remarks from customs.',
        sections: [
          {
            title: 'Why Choose INNOVED',
            items: [
              'Coordination with customs and CWH — we agree on the date and time of inspection, notify the inspector and transport company.',
              'Document readiness — we prepare a complete package of accompanying documents, specifications, and photo documentation for reporting.',
              'Experience with various product categories — from industrial components and electronics to textiles, auto parts, and equipment.',
              'Cargo physical condition control — we monitor packaging integrity, seal preservation, and correct counting of pieces.',
              'Representative participation at inspection — if necessary, our specialist is present on-site, recording the progress and results of the procedure.',
            ],
          },
          {
            title: 'How Inspection Organization Works',
            steps: [
              {
                title: 'Receiving inspection notification',
                text: 'We analyze the document, determine the customs post and timeframes for the procedure.',
              },
              {
                title: 'Preparation for inspection',
                text: 'We compile a list of documents, prepare an application, and send notification to the temporary storage warehouse.',
              },
              {
                title: 'Participant coordination',
                text: 'We notify the carrier, freight forwarder, and if necessary, monitor transport arrival.',
              },
              {
                title: 'Conducting inspection',
                text: 'We organize participation of responsible persons, photo and video documentation, and prepare the inspection report.',
              },
              {
                title: 'Reporting',
                text: 'We provide the client with a protocol indicating inspection results and measures applied.',
              },
            ],
          },
          {
            title: 'What You Get',
            items: [
              'Reduction of downtime and fines due to untimely inspection completion.',
              'Full compliance of procedures with Russian FCS requirements.',
              'Control of inspector actions and consideration of company interests.',
              'Cargo safety and confirmed photo documentation of results.',
              'Accelerated completion of customs clearance after inspection.',
            ],
          },
        ],
        cta: 'Submit an application for goods inspection organization, and INNOVED specialists will take control of all procedure stages. We will ensure coordination with FCS, on-site representative support, and timely processing of all inspection results.',
      },
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
        title: 'Перевод документов для таможни',
        description: 'Профессиональный перевод ВЭД-документов для таможни. Нотариальное заверение, апостиль, многоязычные проекты и полная конфиденциальность от ИННОВЭД.',
        keywords: 'перевод документов, перевод для таможни, ВЭД-перевод, нотариальное заверение, апостиль, таможенный перевод, ИННОВЭД',
      },
      en: {
        title: 'Document Translation for Customs',
        description: 'Professional translation of foreign trade documents for customs. Notarization, apostille, multilingual projects and full confidentiality from INNOVED.',
        keywords: 'document translation, customs translation, foreign trade translation, notarization, apostille, customs documents, INNOVED',
      },
    },
    content: {
      ru: {
        intro: 'В сфере внешнеэкономической деятельности точность перевода — это не просто требование, а гарантия правильного оформления, успешного прохождения таможни и юридической защиты интересов компании. ИННОВЭД выполняет профессиональный перевод документов, связанных с импортом, экспортом и международными контрактами, — с сохранением юридической точности и отраслевой терминологии.\n\nМы понимаем значение каждого слова в деловой переписке, инвойсе или сертификате происхождения, поэтому обеспечиваем результат, принимаемый таможенными органами, банками и партнёрами за рубежом.',
        sections: [
          {
            title: 'Почему выбирают ИННОВЭД',
            items: [
              'Узкоспециализированный перевод ВЭД-документов — мы работаем с контрактами, инвойсами, упаковочными листами, техническими паспортами и сертификатами.',
              'Соблюдение юридической терминологии — перевод выполняется в соответствии с международными нормами документооборота и локальными требованиями ФТС.',
              'Нотариальное заверение и апостиль — по запросу организуем легализацию документов и оформление подписи переводчика.',
              'Многоязычные проекты — поддерживаем переводы не только с английского, но и с немецкого, китайского, итальянского, турецкого и других языков.',
              'Полная конфиденциальность — вся документация проходит через защищённые каналы передачи данных и хранится с соблюдением режимов коммерческой тайны.',
            ],
          },
          {
            title: 'Как проходит процесс перевода',
            steps: [
              {
                title: 'Получение запроса и материалов',
                text: 'Клиент передает документы в любом удобном формате — PDF, Word, скан или архив.',
              },
              {
                title: 'Анализ структуры и содержания',
                text: 'Мы определяем тип документа, объём и наличие специализированных терминов.',
              },
              {
                title: 'Выполнение перевода',
                text: 'Используем профессиональные лексические базы и глоссарии таможенных терминов.',
              },
              {
                title: 'Редактирование и проверка',
                text: 'Текст вычитывается вторым специалистом или носителем языка.',
              },
              {
                title: 'Утверждение и передача клиенту',
                text: 'Готовый перевод передаётся в требуемом виде — электронный файл, заверенная копия или нотариальный экземпляр.',
              },
            ],
          },
          {
            title: 'Что вы получаете',
            items: [
              'Точные переводы документов, принимаемые ФТС и зарубежными партнёрами.',
              'Экономию времени за счёт единого подрядчика для всего пакета документов.',
              'Уверенность в правильности юридических формулировок.',
              'Быструю обработку срочных документов — при необходимости в тот же день.',
              'Гибкость форматов — от электронных файлов до нотариально заверенных оригиналов.',
            ],
          },
        ],
        cta: 'Отправьте документы на перевод уже сегодня — специалисты ИННОВЭД гарантируют точность, конфиденциальность и приёмку результата таможенными органами.',
      },
      en: {
        intro: 'In foreign trade, translation accuracy is not just a requirement, but a guarantee of proper documentation, successful customs clearance, and legal protection of company interests. INNOVED provides professional translation of documents related to import, export, and international contracts — with preservation of legal accuracy and industry terminology.\n\nWe understand the importance of every word in business correspondence, invoices, or certificates of origin, so we ensure results accepted by customs authorities, banks, and partners abroad.',
        sections: [
          {
            title: 'Why Choose INNOVED',
            items: [
              'Specialized foreign trade document translation — we work with contracts, invoices, packing lists, technical passports, and certificates.',
              'Compliance with legal terminology — translation is performed in accordance with international document flow standards and local FCS requirements.',
              'Notarization and apostille — upon request, we organize document legalization and translator signature certification.',
              'Multilingual projects — we support translations not only from English, but also from German, Chinese, Italian, Turkish, and other languages.',
              'Complete confidentiality — all documentation passes through secure data transmission channels and is stored in compliance with trade secret requirements.',
            ],
          },
          {
            title: 'How the Translation Process Works',
            steps: [
              {
                title: 'Receiving request and materials',
                text: 'The client submits documents in any convenient format — PDF, Word, scan, or archive.',
              },
              {
                title: 'Structure and content analysis',
                text: 'We determine the document type, volume, and presence of specialized terminology.',
              },
              {
                title: 'Translation execution',
                text: 'We use professional lexical databases and customs terminology glossaries.',
              },
              {
                title: 'Editing and review',
                text: 'The text is proofread by a second specialist or native speaker.',
              },
              {
                title: 'Approval and delivery to client',
                text: 'The finished translation is delivered in the required format — electronic file, certified copy, or notarized original.',
              },
            ],
          },
          {
            title: 'What You Get',
            items: [
              'Accurate document translations accepted by FCS and foreign partners.',
              'Time savings through a single contractor for the entire document package.',
              'Confidence in the correctness of legal formulations.',
              'Fast processing of urgent documents — same day if necessary.',
              'Format flexibility — from electronic files to notarized originals.',
            ],
          },
        ],
        cta: 'Submit your documents for translation today — INNOVED specialists guarantee accuracy, confidentiality, and acceptance of results by customs authorities.',
      },
    },
  },
  {
    slug: 'rastamozhka-tovarov',
    icon: 'PackageCheck',
    title: {
      ru: 'Растаможка товаров',
      en: 'Goods Customs Clearance',
    },
    seo: {
      ru: {
        title: 'Растаможка товаров',
        description: 'Профессиональная помощь в растаможке любых товаров для России и СНГ — только официальный ввоз, белый импорт и прозрачные условия работы для бизнеса',
        keywords: 'растаможка товаров, растаможить товар, таможенное оформление товаров, белый импорт, официальный ввоз, таможенный брокер, ИННОВЭД',
      },
      en: {
        title: 'Goods Customs Clearance',
        description: 'Professional customs clearance assistance for any goods to Russia and CIS — official import only, white import, and transparent business conditions.',
        keywords: 'goods customs clearance, customs clearance services, official import, white import, customs broker, INNOVED',
      },
    },
    content: {
      ru: {
        intro: 'Растаможка товаров — ключевой этап при ввозе продукции на территорию России и стран СНГ. Ошибки в декларировании, неверный подбор кода ТН ВЭД или неполный пакет документов могут привести к задержке груза, доначислению платежей и даже конфискации. ИННОВЭД обеспечивает полный цикл растаможки любых товаров — от потребительских до промышленных, — гарантируя только официальный ввоз, прозрачные условия и соблюдение всех требований законодательства.',
        sections: [
          {
            title: 'Почему выбирают ИННОВЭД',
            items: [
              'Белый импорт без компромиссов — мы работаем только в правовом поле, исключая серые схемы и недекларирование.',
              'Любые категории товаров — от электроники и одежды до оборудования, сырья и продуктов питания.',
              'Подбор оптимального кода ТН ВЭД — правильная классификация снижает размер таможенных платежей без нарушения закона.',
              'Электронное декларирование 24/7 — подача деклараций через защищённые каналы ФТС в любое время суток.',
              'Выделенный менеджер — один специалист ведёт вашу партию от приёма документов до выпуска товара.',
            ],
          },
          {
            title: 'Как проходит растаможка товаров',
            steps: [
              {
                title: 'Приём и проверка документов',
                text: 'Вы передаёте контракт, инвойс, упаковочный лист, транспортные документы и сертификаты. Мы проверяем полноту и корректность данных.',
              },
              {
                title: 'Определение кода ТН ВЭД и расчёт платежей',
                text: 'Подбираем правильный код для вашего товара и рассчитываем таможенные пошлины, НДС и акцизы.',
              },
              {
                title: 'Подготовка и подача декларации',
                text: 'Формируем электронную декларацию на товары и направляем её в таможенный орган.',
              },
              {
                title: 'Сопровождение таможенного контроля',
                text: 'Отвечаем на запросы инспектора, предоставляем дополнительные документы, при необходимости организуем досмотр.',
              },
              {
                title: 'Выпуск товара и передача документов',
                text: 'После положительного решения таможни вы получаете выпущенную декларацию и можете забирать свой груз.',
              },
            ],
          },
          {
            title: 'Что вы получаете',
            items: [
              'Полностью легальный ввоз товаров без рисков для бизнеса.',
              'Экономию на таможенных платежах за счёт грамотной классификации.',
              'Предсказуемые сроки растаможки — от нескольких часов до 1–2 рабочих дней.',
              'Прозрачную отчётность на каждом этапе оформления.',
              'Минимум вашего участия — мы берём на себя все взаимодействия с таможней.',
            ],
          },
        ],
        cta: 'Оставьте заявку на растаможку товаров — менеджер ИННОВЭД свяжется с вами в течение 15 минут и рассчитает стоимость оформления.',
      },
      en: {
        intro: 'Goods customs clearance is a key stage when importing products into Russia and CIS countries. Errors in declaration, incorrect HS code selection, or an incomplete document package can lead to cargo delays, additional charges, and even confiscation. INNOVED provides a full cycle of customs clearance for any goods — from consumer to industrial — guaranteeing official import only, transparent conditions, and full compliance with all legal requirements.',
        sections: [
          {
            title: 'Why Choose INNOVED',
            items: [
              'White import without compromise — we only work within the legal framework, excluding gray schemes and undeclared goods.',
              'Any product category — from electronics and clothing to equipment, raw materials, and food products.',
              'Optimal HS code selection — correct classification reduces customs duties without breaking the law.',
              'Electronic declaration 24/7 — filing declarations through secure FCS channels at any time.',
              'Dedicated manager — one specialist handles your shipment from document receipt to goods release.',
            ],
          },
          {
            title: 'How Goods Customs Clearance Works',
            steps: [
              {
                title: 'Document receipt and verification',
                text: 'You provide the contract, invoice, packing list, transport documents, and certificates. We check completeness and correctness of data.',
              },
              {
                title: 'HS code determination and payment calculation',
                text: 'We select the correct code for your goods and calculate customs duties, VAT, and excise taxes.',
              },
              {
                title: 'Declaration preparation and submission',
                text: 'We prepare the electronic goods declaration and submit it to customs authorities.',
              },
              {
                title: 'Customs control support',
                text: 'We respond to inspector requests, provide additional documents, and organize inspection if necessary.',
              },
              {
                title: 'Goods release and document delivery',
                text: 'After customs approval, you receive the released declaration and can pick up your cargo.',
              },
            ],
          },
          {
            title: 'What You Get',
            items: [
              'Fully legal import of goods with no risks to your business.',
              'Savings on customs payments through proper classification.',
              'Predictable clearance timelines — from a few hours to 1–2 business days.',
              'Transparent reporting at every stage of processing.',
              'Minimal involvement — we handle all customs interactions.',
            ],
          },
        ],
        cta: 'Submit a request for goods customs clearance — an INNOVED manager will contact you within 15 minutes and calculate the processing cost.',
      },
    },
  },
  {
    slug: 'rastamozhka-gruzov',
    icon: 'Truck',
    title: {
      ru: 'Растаможка грузов',
      en: 'Cargo Customs Clearance',
    },
    seo: {
      ru: {
        title: 'Растаможка грузов',
        description: 'Надежное таможенное оформление и растаможка грузов в Россию и СНГ: официальный ввоз, белый импорт и тщательная проверка документов под требования таможни.',
        keywords: 'растаможка грузов, таможенное оформление грузов, растаможить груз, белый импорт, ввоз грузов, таможенный брокер, ИННОВЭД',
      },
      en: {
        title: 'Cargo Customs Clearance',
        description: 'Reliable customs clearance for cargo to Russia and CIS: official import, white import, and thorough document verification to meet customs requirements.',
        keywords: 'cargo customs clearance, customs clearance services, official import, white import, cargo import, customs broker, INNOVED',
      },
    },
    content: {
      ru: {
        intro: 'Растаможка грузов — сложный процесс, требующий точного оформления документов, знания таможенного законодательства и опыта взаимодействия с контролирующими органами. Независимо от типа и объёма груза — контейнерная, сборная или негабаритная поставка — ИННОВЭД обеспечивает надёжное таможенное оформление с полным соблюдением всех нормативных требований. Мы гарантируем белый импорт, прозрачные условия и минимальные сроки прохождения таможни.',
        sections: [
          {
            title: 'Почему выбирают ИННОВЭД',
            items: [
              'Работа с любыми типами грузов — контейнерные, навалочные, наливные, негабаритные и сборные поставки.',
              'Тщательная проверка документов — каждый документ проходит многоуровневый контроль до подачи декларации.',
              'Оптимизация таможенных платежей — корректный подбор кода ТН ВЭД и применение преференций позволяют снизить расходы.',
              'Работа на всех таможенных постах РФ — удалённое оформление грузов независимо от точки прибытия.',
              'Опыт работы с крупными партиями — мы успешно оформляем регулярные коммерческие поставки для предприятий различных отраслей.',
            ],
          },
          {
            title: 'Как проходит растаможка грузов',
            steps: [
              {
                title: 'Получение документов и предварительный анализ',
                text: 'Клиент предоставляет контракт, транспортные накладные, инвойсы, сертификаты. Мы анализируем груз и определяем стратегию оформления.',
              },
              {
                title: 'Классификация и расчёт платежей',
                text: 'Определяем код ТН ВЭД, рассчитываем пошлины, НДС, акцизы и другие обязательные платежи.',
              },
              {
                title: 'Подготовка и подача таможенной декларации',
                text: 'Формируем декларацию на товары в электронном виде и подаём через систему ФТС.',
              },
              {
                title: 'Сопровождение таможенного контроля',
                text: 'Взаимодействуем с таможенным инспектором, оперативно предоставляем дополнительные сведения и документы.',
              },
              {
                title: 'Выпуск груза',
                text: 'После прохождения таможенного контроля груз выпускается в свободное обращение. Вы получаете полный пакет документов.',
              },
            ],
          },
          {
            title: 'Что вы получаете',
            items: [
              'Надёжную растаможку грузов любого объёма и сложности.',
              'Полное соответствие таможенному законодательству — исключение рисков штрафов и задержек.',
              'Минимальные сроки оформления за счёт электронного декларирования и выстроенных процессов.',
              'Прозрачную отчётность и контроль на каждом этапе.',
              'Экономию вашего времени — мы полностью берём на себя взаимодействие с таможней.',
            ],
          },
        ],
        cta: 'Отправьте заявку на растаможку грузов — специалисты ИННОВЭД готовы подключиться в любое время.',
      },
      en: {
        intro: 'Cargo customs clearance is a complex process requiring accurate documentation, knowledge of customs legislation, and experience interacting with regulatory authorities. Regardless of cargo type and volume — container, consolidated, or oversized shipments — INNOVED ensures reliable customs clearance with full compliance with all regulatory requirements. We guarantee white import, transparent conditions, and minimal customs processing times.',
        sections: [
          {
            title: 'Why Choose INNOVED',
            items: [
              'Working with all cargo types — container, bulk, liquid, oversized, and consolidated shipments.',
              'Thorough document verification — every document undergoes multi-level review before declaration submission.',
              'Customs payment optimization — correct HS code selection and preference application reduce costs.',
              'Coverage of all Russian customs posts — remote cargo processing regardless of arrival point.',
              'Experience with large shipments — we successfully process regular commercial deliveries for various industries.',
            ],
          },
          {
            title: 'How Cargo Customs Clearance Works',
            steps: [
              {
                title: 'Document receipt and preliminary analysis',
                text: 'The client provides the contract, transport documents, invoices, and certificates. We analyze the cargo and determine the clearance strategy.',
              },
              {
                title: 'Classification and payment calculation',
                text: 'We determine the HS code, calculate duties, VAT, excise taxes, and other mandatory payments.',
              },
              {
                title: 'Customs declaration preparation and submission',
                text: 'We prepare the electronic goods declaration and submit it through the FCS system.',
              },
              {
                title: 'Customs control support',
                text: 'We interact with customs inspectors and promptly provide additional information and documents.',
              },
              {
                title: 'Cargo release',
                text: 'After passing customs control, the cargo is released for free circulation. You receive a complete document package.',
              },
            ],
          },
          {
            title: 'What You Get',
            items: [
              'Reliable customs clearance for cargo of any volume and complexity.',
              'Full compliance with customs legislation — eliminating risks of fines and delays.',
              'Minimal processing times through electronic declaration and streamlined processes.',
              'Transparent reporting and control at every stage.',
              'Time savings — we fully handle all customs interactions.',
            ],
          },
        ],
        cta: 'Submit a request for cargo customs clearance — INNOVED specialists are ready to assist at any time.',
      },
    },
  },
  {
    slug: 'tamozhennaya-ochistka',
    icon: 'ShieldCheck',
    title: {
      ru: 'Таможенная очистка',
      en: 'Customs Clearance',
    },
    seo: {
      ru: {
        title: 'Таможенная очистка',
        description: 'Услуги по растаможке товаров в России и СНГ, официальный ввоз товаров, белый импорт',
        keywords: 'таможенная очистка, растаможка, таможенное оформление, белый импорт, официальный ввоз, таможенный брокер, ИННОВЭД',
      },
      en: {
        title: 'Customs Clearance',
        description: 'Customs clearance services in Russia and CIS — official goods import, white import, and full regulatory compliance.',
        keywords: 'customs clearance, customs processing, official import, white import, customs broker, INNOVED',
      },
    },
    content: {
      ru: {
        intro: 'Таможенная очистка — это комплекс процедур, необходимых для легального перемещения товаров через границу Российской Федерации. Процесс включает подачу декларации, уплату таможенных платежей, прохождение контроля и получение разрешения на выпуск. ИННОВЭД выполняет таможенную очистку товаров под ключ, обеспечивая официальный ввоз, белый импорт и полное соответствие требованиям ФТС.',
        sections: [
          {
            title: 'Почему выбирают ИННОВЭД',
            items: [
              'Комплексный подход — мы закрываем весь процесс таможенной очистки: от сбора документов до выпуска товара.',
              'Знание нюансов законодательства — специалисты отслеживают все изменения в таможенном регулировании и применяют их в работе.',
              'Минимизация рисков — грамотное оформление исключает доначисления, штрафы и отказы в выпуске.',
              'Работа с любыми товарными группами — продовольственные, промышленные, подакцизные, подсанкционные товары.',
              'Удалённое оформление по всей России — независимо от места нахождения груза и таможенного поста.',
            ],
          },
          {
            title: 'Этапы таможенной очистки',
            steps: [
              {
                title: 'Анализ товара и документов',
                text: 'Изучаем товарную номенклатуру, проверяем комплектность документов и определяем требования к оформлению.',
              },
              {
                title: 'Классификация и расчёт платежей',
                text: 'Подбираем корректный код ТН ВЭД, рассчитываем пошлины, НДС и иные платежи.',
              },
              {
                title: 'Подготовка и подача декларации',
                text: 'Формируем электронную декларацию и передаём её в таможенный орган.',
              },
              {
                title: 'Прохождение таможенного контроля',
                text: 'Сопровождаем проверку, предоставляем дополнительные документы и пояснения по запросу инспектора.',
              },
              {
                title: 'Выпуск и передача документов',
                text: 'После завершения очистки вы получаете выпущенную декларацию и полный пакет сопроводительных документов.',
              },
            ],
          },
          {
            title: 'Что вы получаете',
            items: [
              'Полностью легальный ввоз с соблюдением всех норм таможенного законодательства.',
              'Оптимизацию затрат за счёт правильной классификации и применения льгот.',
              'Быстрое прохождение таможни — от нескольких часов до 1 рабочего дня.',
              'Прозрачность на каждом этапе — вы видите статус оформления в режиме реального времени.',
              'Отсутствие бюрократической нагрузки — все взаимодействия с таможней берёт на себя ИННОВЭД.',
            ],
          },
        ],
        cta: 'Закажите таможенную очистку товаров — менеджер ИННОВЭД свяжется с вами в течение 15 минут.',
      },
      en: {
        intro: 'Customs clearance is a set of procedures required for legal movement of goods across the Russian Federation border. The process includes filing a declaration, paying customs duties, passing control, and obtaining release permission. INNOVED performs turnkey customs clearance, ensuring official import, white import, and full compliance with FCS requirements.',
        sections: [
          {
            title: 'Why Choose INNOVED',
            items: [
              'Comprehensive approach — we cover the entire customs clearance process: from document collection to goods release.',
              'Knowledge of legislative nuances — specialists track all changes in customs regulations and apply them in practice.',
              'Risk minimization — proper processing eliminates additional charges, fines, and release refusals.',
              'Working with all product groups — food, industrial, excisable, and sanctioned goods.',
              'Remote processing across Russia — regardless of cargo location and customs post.',
            ],
          },
          {
            title: 'Customs Clearance Stages',
            steps: [
              {
                title: 'Product and document analysis',
                text: 'We study the product nomenclature, check document completeness, and determine processing requirements.',
              },
              {
                title: 'Classification and payment calculation',
                text: 'We select the correct HS code, calculate duties, VAT, and other payments.',
              },
              {
                title: 'Declaration preparation and submission',
                text: 'We prepare the electronic declaration and submit it to customs authorities.',
              },
              {
                title: 'Customs control passage',
                text: 'We support the inspection, provide additional documents and explanations at the inspector\'s request.',
              },
              {
                title: 'Release and document delivery',
                text: 'After clearance completion, you receive the released declaration and a complete set of accompanying documents.',
              },
            ],
          },
          {
            title: 'What You Get',
            items: [
              'Fully legal import in compliance with all customs legislation.',
              'Cost optimization through proper classification and benefit application.',
              'Fast customs processing — from a few hours to 1 business day.',
              'Transparency at every stage — you see the processing status in real time.',
              'No bureaucratic burden — INNOVED handles all customs interactions.',
            ],
          },
        ],
        cta: 'Order customs clearance — an INNOVED manager will contact you within 15 minutes.',
      },
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
