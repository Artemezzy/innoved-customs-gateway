export interface FAQItem {
  id: string;
  category: string;
  question: { ru: string; en: string; zh: string };
  answer: { ru: string; en: string; zh: string };
}

export const faqItems: FAQItem[] = [
  // General Questions
  {
    id: 'what-is-customs-broker',
    category: 'general',
    question: {
      ru: 'Что такое таможенный брокер и зачем он нужен?',
      en: 'What is a customs broker and why do you need one?',
      zh: '什么是报关行，为什么需要它？'
    },
    answer: {
      ru: 'Таможенный брокер — это профессиональный посредник между участником ВЭД и таможенными органами. Он помогает правильно оформить документы, рассчитать платежи, избежать штрафов и задержек при пересечении границы. Работа с брокером экономит время и снижает риски.',
      en: 'A customs broker is a professional intermediary between foreign trade participants and customs authorities. They help properly prepare documents, calculate payments, avoid fines and delays at border crossings. Working with a broker saves time and reduces risks.',
      zh: '报关行是对外贸易参与者与海关之间的专业中介。他们帮助正确准备文件、计算付款、避免罚款和过境延误。与报关行合作可以节省时间并降低风险。'
    }
  },
  {
    id: 'how-long-clearance',
    category: 'general',
    question: {
      ru: 'Сколько времени занимает таможенное оформление?',
      en: 'How long does customs clearance take?',
      zh: '清关需要多长时间？'
    },
    answer: {
      ru: 'Стандартное таможенное оформление занимает от 1 до 3 рабочих дней при наличии всех документов. Срочное оформление возможно в течение 24 часов. Сроки зависят от категории товара, полноты документов и загруженности таможенного поста.',
      en: 'Standard customs clearance takes 1 to 3 business days with all documents available. Urgent clearance is possible within 24 hours. Timing depends on product category, document completeness, and customs post workload.',
      zh: '在所有文件齐全的情况下，标准清关需要1到3个工作日。紧急清关可在24小时内完成。时间取决于产品类别、文件完整性和海关工作负荷。'
    }
  },
  {
    id: 'remote-work',
    category: 'general',
    question: {
      ru: 'Можно ли работать с вами дистанционно?',
      en: 'Can we work with you remotely?',
      zh: '我们可以远程与您合作吗？'
    },
    answer: {
      ru: 'Да, мы работаем с клиентами по всей России дистанционно. Все документы принимаем в электронном виде, консультации проводим по телефону, email или видеосвязи. Физическое присутствие клиента не требуется ни на одном этапе.',
      en: 'Yes, we work with clients throughout Russia remotely. We accept all documents electronically, conduct consultations by phone, email, or video call. Physical presence of the client is not required at any stage.',
      zh: '是的，我们与俄罗斯各地的客户远程合作。我们以电子方式接收所有文件，通过电话、电子邮件或视频通话进行咨询。任何阶段都不需要客户亲自到场。'
    }
  },
  // Documents
  {
    id: 'required-documents',
    category: 'documents',
    question: {
      ru: 'Какие документы нужны для таможенного оформления?',
      en: 'What documents are needed for customs clearance?',
      zh: '清关需要哪些文件？'
    },
    answer: {
      ru: 'Базовый пакет документов включает: контракт с поставщиком, инвойс, упаковочный лист, транспортные документы (коносамент, CMR, авианакладная), документы о происхождении товара. В зависимости от товара могут потребоваться сертификаты, декларации соответствия и разрешительные документы.',
      en: 'The basic document package includes: supplier contract, invoice, packing list, transport documents (bill of lading, CMR, air waybill), documents on product origin. Depending on the product, certificates, declarations of conformity, and permits may be required.',
      zh: '基本文件包括：供应商合同、发票、装箱单、运输单据（提单、CMR、空运单）、产品原产地文件。根据产品不同，可能需要证书、合格声明和许可证。'
    }
  },
  {
    id: 'missing-documents',
    category: 'documents',
    question: {
      ru: 'Что делать, если не хватает документов?',
      en: 'What to do if documents are missing?',
      zh: '如果缺少文件怎么办？'
    },
    answer: {
      ru: 'Мы поможем восстановить недостающие документы или получить их у поставщика. В некоторых случаях можно оформить груз с обязательством предоставить документы позже. Главное — сообщить нам о проблеме заранее, чтобы избежать простоя груза.',
      en: 'We will help restore missing documents or obtain them from the supplier. In some cases, cargo can be cleared with an obligation to provide documents later. The main thing is to inform us about the problem in advance to avoid cargo delays.',
      zh: '我们将帮助恢复缺失的文件或从供应商处获取。在某些情况下，可以在承诺稍后提供文件的情况下清关货物。关键是提前告知我们问题，以避免货物延误。'
    }
  },
  // Payments
  {
    id: 'payment-calculation',
    category: 'payments',
    question: {
      ru: 'Как рассчитываются таможенные платежи?',
      en: 'How are customs payments calculated?',
      zh: '如何计算关税？'
    },
    answer: {
      ru: 'Таможенные платежи включают: ввозную пошлину (зависит от кода ТН ВЭД товара), НДС (20% от таможенной стоимости + пошлина), таможенный сбор. Мы предоставляем предварительный расчёт всех платежей до начала оформления.',
      en: 'Customs payments include: import duty (depends on the HS code of the product), VAT (20% of customs value + duty), customs fee. We provide preliminary calculation of all payments before clearance begins.',
      zh: '关税包括：进口税（取决于产品的HS编码）、增值税（海关价值的20% + 关税）、海关费用。我们在清关开始前提供所有付款的初步计算。'
    }
  },
  {
    id: 'payment-methods',
    category: 'payments',
    question: {
      ru: 'Какие способы оплаты вы принимаете?',
      en: 'What payment methods do you accept?',
      zh: '您接受哪些付款方式？'
    },
    answer: {
      ru: 'Мы работаем по безналичному расчёту с юридическими лицами и ИП. Оплата производится по счёту на расчётный счёт компании. Для постоянных клиентов возможна работа с отсрочкой платежа.',
      en: 'We work by bank transfer with legal entities and individual entrepreneurs. Payment is made by invoice to the company account. Deferred payment is possible for regular clients.',
      zh: '我们与法人实体和个体经营者进行银行转账合作。按发票向公司账户付款。常客可延期付款。'
    }
  },
  // Import/Export
  {
    id: 'import-countries',
    category: 'import',
    question: {
      ru: 'Из каких стран вы помогаете импортировать товары?',
      en: 'From which countries do you help import goods?',
      zh: '您帮助从哪些国家进口商品？'
    },
    answer: {
      ru: 'Мы работаем со всеми странами мира. Наиболее популярные направления: Китай, страны ЕС, Турция, Южная Корея, Япония, США. У нас есть опыт работы с любыми таможенными режимами и категориями товаров.',
      en: 'We work with all countries of the world. Most popular destinations: China, EU countries, Turkey, South Korea, Japan, USA. We have experience with any customs regimes and product categories.',
      zh: '我们与世界所有国家合作。最受欢迎的目的地：中国、欧盟国家、土耳其、韩国、日本、美国。我们在任何海关制度和产品类别方面都有经验。'
    }
  },
  {
    id: 'prohibited-goods',
    category: 'import',
    question: {
      ru: 'Какие товары нельзя ввозить в Россию?',
      en: 'What goods cannot be imported into Russia?',
      zh: '哪些商品不能进口到俄罗斯？'
    },
    answer: {
      ru: 'Запрещены к ввозу: наркотические вещества, оружие (без разрешения), контрафактная продукция, некоторые виды продуктов питания из санкционных стран. Ограничены: лекарства, БАДы, радиоэлектронные устройства определённых частот. Мы проконсультируем по любому товару.',
      en: 'Prohibited for import: narcotic substances, weapons (without permission), counterfeit products, certain food products from sanctioned countries. Restricted: medicines, dietary supplements, radio-electronic devices of certain frequencies. We will consult on any product.',
      zh: '禁止进口：麻醉物质、武器（未经许可）、假冒产品、某些来自受制裁国家的食品。限制：药品、膳食补充剂、某些频率的无线电电子设备。我们会就任何产品提供咨询。'
    }
  },
  // Certification
  {
    id: 'certification-needed',
    category: 'certification',
    question: {
      ru: 'Как узнать, нужен ли сертификат на мой товар?',
      en: 'How do I know if my product needs a certificate?',
      zh: '如何知道我的产品是否需要证书？'
    },
    answer: {
      ru: 'Необходимость сертификации определяется кодом ТН ВЭД товара и техническими регламентами ЕАЭС. Мы бесплатно проверим ваш товар и сообщим, какие документы требуются. Достаточно прислать описание товара или каталог.',
      en: 'The need for certification is determined by the HS code of the product and EAEU technical regulations. We will check your product for free and tell you what documents are required. Just send a product description or catalog.',
      zh: '认证需求由产品的HS编码和欧亚经济联盟技术法规决定。我们将免费检查您的产品并告知需要哪些文件。只需发送产品描述或目录即可。'
    }
  },
  {
    id: 'certification-time',
    category: 'certification',
    question: {
      ru: 'Сколько времени занимает получение сертификата?',
      en: 'How long does it take to get a certificate?',
      zh: '获得证书需要多长时间？'
    },
    answer: {
      ru: 'Сроки зависят от типа сертификата: декларация соответствия — от 3 дней, сертификат ТР ТС — от 5 до 14 дней, СГР (государственная регистрация) — от 2 до 4 недель. Мы поможем подобрать оптимальный вариант по срокам и стоимости.',
      en: 'Timing depends on certificate type: declaration of conformity — from 3 days, TR CU certificate — from 5 to 14 days, SGR (state registration) — from 2 to 4 weeks. We will help choose the optimal option in terms of timing and cost.',
      zh: '时间取决于证书类型：合格声明——3天起，TR CU证书——5至14天，SGR（国家注册）——2至4周。我们将帮助在时间和成本方面选择最佳方案。'
    }
  }
];

export const faqCategories = {
  general: { ru: 'Общие вопросы', en: 'General Questions', zh: '一般问题' },
  documents: { ru: 'Документы', en: 'Documents', zh: '文件' },
  payments: { ru: 'Платежи', en: 'Payments', zh: '付款' },
  import: { ru: 'Импорт/Экспорт', en: 'Import/Export', zh: '进出口' },
  certification: { ru: 'Сертификация', en: 'Certification', zh: '认证' }
};
