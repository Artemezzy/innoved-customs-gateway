export interface FAQItem {
  id: string;
  category: string;
  question: { ru: string; en: string };
  answer: { ru: string; en: string };
}

export const faqItems: FAQItem[] = [
  // General Questions
  {
    id: 'what-is-customs-broker',
    category: 'general',
    question: {
      ru: 'Что такое таможенный брокер и зачем он нужен?',
      en: 'What is a customs broker and why do you need one?'
    },
    answer: {
      ru: 'Таможенный брокер — это профессиональный посредник между участником ВЭД и таможенными органами. Он помогает правильно оформить документы, рассчитать платежи, избежать штрафов и задержек при пересечении границы. Работа с брокером экономит время и снижает риски.',
      en: 'A customs broker is a professional intermediary between foreign trade participants and customs authorities. They help properly prepare documents, calculate payments, avoid fines and delays at border crossings. Working with a broker saves time and reduces risks.'
    }
  },
  {
    id: 'how-long-clearance',
    category: 'general',
    question: {
      ru: 'Сколько времени занимает таможенное оформление?',
      en: 'How long does customs clearance take?'
    },
    answer: {
      ru: 'Стандартное таможенное оформление занимает от 1 до 3 рабочих дней при наличии всех документов. Срочное оформление возможно в течение 24 часов. Сроки зависят от категории товара, полноты документов и загруженности таможенного поста.',
      en: 'Standard customs clearance takes 1 to 3 business days with all documents available. Urgent clearance is possible within 24 hours. Timing depends on product category, document completeness, and customs post workload.'
    }
  },
  {
    id: 'remote-work',
    category: 'general',
    question: {
      ru: 'Можно ли работать с вами дистанционно?',
      en: 'Can we work with you remotely?'
    },
    answer: {
      ru: 'Да, мы работаем с клиентами по всей России дистанционно. Все документы принимаем в электронном виде, консультации проводим по телефону, email или видеосвязи. Физическое присутствие клиента не требуется ни на одном этапе.',
      en: 'Yes, we work with clients throughout Russia remotely. We accept all documents electronically, conduct consultations by phone, email, or video call. Physical presence of the client is not required at any stage.'
    }
  },
  // Documents
  {
    id: 'required-documents',
    category: 'documents',
    question: {
      ru: 'Какие документы нужны для таможенного оформления?',
      en: 'What documents are needed for customs clearance?'
    },
    answer: {
      ru: 'Базовый пакет документов включает: контракт с поставщиком, инвойс, упаковочный лист, транспортные документы (коносамент, CMR, авианакладная), документы о происхождении товара. В зависимости от товара могут потребоваться сертификаты, декларации соответствия и разрешительные документы.',
      en: 'The basic document package includes: supplier contract, invoice, packing list, transport documents (bill of lading, CMR, air waybill), documents on product origin. Depending on the product, certificates, declarations of conformity, and permits may be required.'
    }
  },
  {
    id: 'missing-documents',
    category: 'documents',
    question: {
      ru: 'Что делать, если не хватает документов?',
      en: 'What to do if documents are missing?'
    },
    answer: {
      ru: 'Мы поможем восстановить недостающие документы или получить их у поставщика. В некоторых случаях можно оформить груз с обязательством предоставить документы позже. Главное — сообщить нам о проблеме заранее, чтобы избежать простоя груза.',
      en: 'We will help restore missing documents or obtain them from the supplier. In some cases, cargo can be cleared with an obligation to provide documents later. The main thing is to inform us about the problem in advance to avoid cargo delays.'
    }
  },
  // Payments
  {
    id: 'payment-calculation',
    category: 'payments',
    question: {
      ru: 'Как рассчитываются таможенные платежи?',
      en: 'How are customs payments calculated?'
    },
    answer: {
      ru: 'Таможенные платежи включают: ввозную пошлину (зависит от кода ТН ВЭД товара), НДС (20% от таможенной стоимости + пошлина), таможенный сбор. Мы предоставляем предварительный расчёт всех платежей до начала оформления.',
      en: 'Customs payments include: import duty (depends on the HS code of the product), VAT (20% of customs value + duty), customs fee. We provide preliminary calculation of all payments before clearance begins.'
    }
  },
  {
    id: 'payment-methods',
    category: 'payments',
    question: {
      ru: 'Какие способы оплаты вы принимаете?',
      en: 'What payment methods do you accept?'
    },
    answer: {
      ru: 'Мы работаем по безналичному расчёту с юридическими лицами и ИП. Оплата производится по счёту на расчётный счёт компании. Для постоянных клиентов возможна работа с отсрочкой платежа.',
      en: 'We work by bank transfer with legal entities and individual entrepreneurs. Payment is made by invoice to the company account. Deferred payment is possible for regular clients.'
    }
  },
  // Import/Export
  {
    id: 'import-countries',
    category: 'import',
    question: {
      ru: 'Из каких стран вы помогаете импортировать товары?',
      en: 'From which countries do you help import goods?'
    },
    answer: {
      ru: 'Мы работаем со всеми странами мира. Наиболее популярные направления: Китай, страны ЕС, Турция, Южная Корея, Япония, США. У нас есть опыт работы с любыми таможенными режимами и категориями товаров.',
      en: 'We work with all countries of the world. Most popular destinations: China, EU countries, Turkey, South Korea, Japan, USA. We have experience with any customs regimes and product categories.'
    }
  },
  {
    id: 'prohibited-goods',
    category: 'import',
    question: {
      ru: 'Какие товары нельзя ввозить в Россию?',
      en: 'What goods cannot be imported into Russia?'
    },
    answer: {
      ru: 'Запрещены к ввозу: наркотические вещества, оружие (без разрешения), контрафактная продукция, некоторые виды продуктов питания из санкционных стран. Ограничены: лекарства, БАДы, радиоэлектронные устройства определённых частот. Мы проконсультируем по любому товару.',
      en: 'Prohibited for import: narcotic substances, weapons (without permission), counterfeit products, certain food products from sanctioned countries. Restricted: medicines, dietary supplements, radio-electronic devices of certain frequencies. We will consult on any product.'
    }
  },
  // Certification
  {
    id: 'certification-needed',
    category: 'certification',
    question: {
      ru: 'Как узнать, нужен ли сертификат на мой товар?',
      en: 'How do I know if my product needs a certificate?'
    },
    answer: {
      ru: 'Необходимость сертификации определяется кодом ТН ВЭД товара и техническими регламентами ЕАЭС. Мы бесплатно проверим ваш товар и сообщим, какие документы требуются. Достаточно прислать описание товара или каталог.',
      en: 'The need for certification is determined by the HS code of the product and EAEU technical regulations. We will check your product for free and tell you what documents are required. Just send a product description or catalog.'
    }
  },
  {
    id: 'certification-time',
    category: 'certification',
    question: {
      ru: 'Сколько времени занимает получение сертификата?',
      en: 'How long does it take to get a certificate?'
    },
    answer: {
      ru: 'Сроки зависят от типа сертификата: декларация соответствия — от 3 дней, сертификат ТР ТС — от 5 до 14 дней, СГР (государственная регистрация) — от 2 до 4 недель. Мы поможем подобрать оптимальный вариант по срокам и стоимости.',
      en: 'Timing depends on certificate type: declaration of conformity — from 3 days, TR CU certificate — from 5 to 14 days, SGR (state registration) — from 2 to 4 weeks. We will help choose the optimal option in terms of timing and cost.'
    }
  }
];

export const faqCategories = {
  general: { ru: 'Общие вопросы', en: 'General Questions' },
  documents: { ru: 'Документы', en: 'Documents' },
  payments: { ru: 'Платежи', en: 'Payments' },
  import: { ru: 'Импорт/Экспорт', en: 'Import/Export' },
  certification: { ru: 'Сертификация', en: 'Certification' }
};
