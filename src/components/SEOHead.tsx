import { useEffect } from 'react';
import { analytics } from '../utils/analytics';

interface SEOHeadProps {
  language: 'ru' | 'en';
  page?: string;
  customTitle?: string;
  customDescription?: string;
  customKeywords?: string;
  canonicalPath?: string;
}

const seoContent = {
  ru: {
    home: {
      title: 'Таможенный брокер "Инновэд". Оказываем услуги таможенного оформления в Москве и по всей России',
      description: 'Услуги таможенного брокера, таможенное оформление товаров, растаможка грузов, таможенное оформление импорта, таможенное оформление экспорта, таможенный брокер из китая',
      keywords: 'таможенное оформление, таможенный брокер, импорт, экспорт, россия, customs clearance, broker, белый импорт, растаможка грузов, декларирование товаров, сертификация товаров, ВЭД, консалтинг, таможенный транзит'
    },
    about: {
      title: 'О компании Инновэд | Таможенный брокер с опытом более 10 лет в России',
      description: 'Компания Инновэд — надёжный таможенный брокер с опытом более 10 лет. Профессиональная команда, прозрачные условия, работа по всей России.',
      keywords: 'о компании, инновэд, таможенный брокер москва, команда специалистов, опыт ВЭД, растаможка, декларирование'
    },
    services: {
      title: 'Услуги таможенного брокера, таможенное оформление',
      description: 'Все виды таможенных услуг от компании "Инновэд"',
      keywords: 'таможенные услуги, импорт, экспорт, сертификация, классификация ТН ВЭД, ВЭД услуги, растаможка, декларирование, консалтинг, Инновэд'
    },
    howWeWork: {
      title: 'Как мы работаем | Прозрачный процесс таможенного оформления | Инновэд',
      description: 'Пошаговый процесс таможенного оформления с Инновэд: от заявки до получения груза. Чёткие сроки, прозрачные условия, гарантия результата.',
      keywords: 'процесс оформления, этапы работы, сроки таможенного оформления, как оформить груз, растаможка пошагово'
    },
    contact: {
      title: 'Контакты Инновэд | Заказать таможенное оформление | Консультация',
      description: 'Свяжитесь с Инновэд для консультации по таможенному оформлению и растаможке грузов. Телефон, email, Telegram. Ответим в течение 15 минут.',
      keywords: 'контакты инновэд, таможенный брокер телефон, заказать оформление, консультация ВЭД, растаможка заявка'
    },
    blog: {
      title: 'Блог Инновэд | Статьи о таможенном оформлении, ВЭД и растаможке',
      description: 'Полезные статьи о таможенном оформлении, изменениях в законодательстве ВЭД, советы по импорту, экспорту и сертификации от экспертов Инновэд.',
      keywords: 'блог инновэд, статьи таможня, законодательство ВЭД, советы импорт экспорт, растаможка, декларирование'
    },
    news: {
      title: 'Новости Инновэд | События и обновления компании',
      description: 'Новости компании Инновэд: события, достижения, новые услуги и важные обновления в сфере таможенного оформления.',
      keywords: 'новости инновэд, новости таможня, события компании, обновления ВЭД'
    },
    faq: {
      title: 'Часто задаваемые вопросы о таможенном оформлении | Инновэд',
      description: 'Ответы на популярные вопросы о таможенном оформлении и растаможке: сроки, стоимость, документы, порядок работы с Инновэд.',
      keywords: 'FAQ таможня, вопросы ответы, сколько стоит оформление, какие документы нужны, растаможка FAQ, ВЭД вопросы'
    },
    privacy: {
      title: 'Политика конфиденциальности - Инновэд',
      description: 'Политика конфиденциальности компании Инновэд по обработке персональных данных',
      keywords: 'политика конфиденциальности, персональные данные, Инновэд'
    },
    terms: {
      title: 'Пользовательское соглашение - Инновэд',
      description: 'Пользовательское соглашение компании Инновэд об использовании сайта',
      keywords: 'пользовательское соглашение, условия использования, Инновэд'
    },
    cookies: {
      title: 'Политика использования файлов cookies - Инновэд',
      description: 'Узнайте, какие cookies использует сайт Инновэд: категории, цели, сроки хранения и управление настройками.',
      keywords: 'cookies, политика cookies, файлы куки, Инновэд, конфиденциальность'
    },
    broker: {
      title: 'Таможенный брокер по всей России | Услуги таможенного оформления Инновэд',
      description: 'Таможенный брокер Инновэд — профессиональное оформление импорта и экспорта в 28 городах России. Декларирование, классификация ТН ВЭД, сертификация, консультации.',
      keywords: 'таможенный брокер, таможенный представитель, таможенное оформление, растаможка, декларирование, ТН ВЭД, импорт экспорт, Инновэд'
    },
    caseTehniki: {
      title: 'Растаможка техники | Кейс Инновэд',
      description: 'Кейс: таможенное оформление бытовой техники. Перевод клиента из режима блокировок в стабильные поставки без остановок.',
      keywords: 'растаможка техники, таможенное оформление техники, белый импорт электроприборов, кейс Инновэд'
    },
    caseZapchastey: {
      title: 'Растаможка запчастей | Кейс Инновэд',
      description: 'Кейс: таможенное оформление автозапчастей. Оптимизация логистики и снижение таможенных платежей.',
      keywords: 'растаможка запчастей, таможенное оформление автозапчастей, импорт запчастей, кейс Инновэд'
    },
    caseOdejda: {
      title: 'Растаможка одежды | Кейс Инновэд',
      description: 'Кейс: таможенное оформление одежды и текстиля. Сертификация, маркировка и белый импорт.',
      keywords: 'растаможка одежды, таможенное оформление одежды, импорт текстиля, кейс Инновэд'
    },
    caseOborudovaniya: {
      title: 'Растаможка оборудования | Кейс Инновэд',
      description: 'Кейс: таможенное оформление промышленного оборудования. Сокращение сроков оформления с 10-14 до 1-2 дней.',
      keywords: 'растаможка оборудования, таможенное оформление станков, импорт оборудования, кейс Инновэд'
    }
  },
  en: {
    home: {
      title: 'INNOVED - Customs Clearance & Cargo Clearance | Broker Services for Business in Russia',
      description: 'Professional customs clearance services across Russia. Fast, reliable, competitive prices. Over 10 years of experience. ✅ Import ✅ Export ✅ Transit ✅ Certification',
      keywords: 'customs clearance, customs broker, import, export, russia, cargo clearance, goods declaration, product certification, foreign trade, consulting, customs transit'
    },
    about: {
      title: 'About INNOVED | Customs Broker with 10+ Years Experience in Russia',
      description: 'INNOVED — your reliable customs broker with over 10 years of experience. Professional team, transparent terms, operating across Russia.',
      keywords: 'about us, innoved, customs broker russia, professional team, foreign trade experience, cargo clearance'
    },
    services: {
      title: 'Customs Clearance & Cargo Clearance Services | INNOVED',
      description: 'Full range of customs services: import, export, certification, HS code classification, foreign trade consulting, goods declaration. Operating across Russia.',
      keywords: 'customs services, import, export, certification, HS code classification, foreign trade services, cargo clearance, declaration, consulting, INNOVED'
    },
    howWeWork: {
      title: 'How We Work | Transparent Customs Clearance Process | INNOVED',
      description: 'Step-by-step customs clearance process with INNOVED: from application to cargo receipt. Clear timelines, transparent terms, guaranteed results.',
      keywords: 'clearance process, work stages, customs clearance timelines, how to clear cargo, step by step clearance'
    },
    contact: {
      title: 'Contact INNOVED | Order Customs Clearance | Free Consultation',
      description: 'Contact INNOVED for customs clearance and cargo clearance consultation. Phone, email, Telegram. We respond within 15 minutes.',
      keywords: 'contact innoved, customs broker phone, order clearance, foreign trade consultation, cargo clearance request'
    },
    blog: {
      title: 'INNOVED Blog | Articles on Customs Clearance, Foreign Trade & Certification',
      description: 'Expert articles on customs clearance, foreign trade legislation changes, import, export and certification tips from INNOVED professionals.',
      keywords: 'innoved blog, customs articles, foreign trade legislation, import export tips, cargo clearance, declaration'
    },
    news: {
      title: 'INNOVED News | Company Events and Updates',
      description: 'INNOVED company news: events, achievements, new services and important updates in customs clearance.',
      keywords: 'innoved news, customs news, company events, foreign trade updates'
    },
    faq: {
      title: 'Frequently Asked Questions About Customs Clearance | INNOVED',
      description: 'Answers to popular questions about customs and cargo clearance: timelines, costs, documents, working procedures with INNOVED.',
      keywords: 'customs FAQ, questions answers, clearance cost, what documents needed, cargo clearance FAQ, foreign trade questions'
    },
    privacy: {
      title: 'Privacy Policy - INNOVED',
      description: 'INNOVED company privacy policy for personal data processing',
      keywords: 'privacy policy, personal data, INNOVED'
    },
    terms: {
      title: 'Terms of Service - INNOVED',
      description: 'INNOVED company terms of service for website usage',
      keywords: 'terms of service, terms of use, INNOVED'
    },
    cookies: {
      title: 'Cookie Policy - INNOVED',
      description: 'Learn about cookies used on the INNOVED website: categories, purposes, retention periods, and preference management.',
      keywords: 'cookies, cookie policy, INNOVED, privacy'
    },
    broker: {
      title: 'Customs Broker Across Russia | Professional Customs Clearance INNOVED',
      description: 'INNOVED customs broker — professional import and export clearance in 28 cities across Russia. Declaration, HS code classification, certification, consulting.',
      keywords: 'customs broker, customs representative, customs clearance, cargo clearance, declaration, HS code, import export, INNOVED'
    },
    caseTehniki: {
      title: 'Appliance Customs Clearance | INNOVED Case Study',
      description: 'Case study: customs clearance of household appliances. From constant blockages to stable, uninterrupted deliveries.',
      keywords: 'appliance customs clearance, household electronics import, white import, INNOVED case study'
    },
    caseZapchastey: {
      title: 'Auto Parts Customs Clearance | INNOVED Case Study',
      description: 'Case study: customs clearance of auto parts. Logistics optimization and customs duty reduction.',
      keywords: 'auto parts customs clearance, spare parts import, INNOVED case study'
    },
    caseOdejda: {
      title: 'Clothing Customs Clearance | INNOVED Case Study',
      description: 'Case study: customs clearance of clothing and textiles. Certification, labeling and white import.',
      keywords: 'clothing customs clearance, textile import, garment import, INNOVED case study'
    },
    caseOborudovaniya: {
      title: 'Equipment Customs Clearance | INNOVED Case Study',
      description: 'Case study: customs clearance of industrial equipment. Processing time reduced from 10-14 to 1-2 days.',
      keywords: 'equipment customs clearance, machinery import, industrial equipment, INNOVED case study'
    }
  }
};

type PageKey = keyof typeof seoContent.ru;

export function SEOHead({ 
  language, 
  page = 'home',
  customTitle,
  customDescription,
  customKeywords,
  canonicalPath
}: SEOHeadProps) {
  const pageContent = seoContent[language][page as PageKey] || seoContent[language].home;
  
  const title = customTitle || pageContent.title;
  const description = customDescription || pageContent.description;
  const keywords = customKeywords || pageContent.keywords;

  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    }
    
    // Update lang attribute
    document.documentElement.lang = language;
    
    // Update canonical URL
    const canonicalUrl = `https://www.innovedbroker.ru${canonicalPath || (typeof window !== 'undefined' ? window.location.pathname : '/')}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    // Update hreflang tags
    const hreflangIds = ['hreflang-ru', 'hreflang-en', 'hreflang-default'];
    hreflangIds.forEach(id => document.getElementById(id)?.remove());

    const createHreflang = (id: string, lang: string, href: string) => {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = href;
      document.head.appendChild(link);
    };
    createHreflang('hreflang-ru', 'ru', canonicalUrl);
    createHreflang('hreflang-en', 'en', canonicalUrl);
    createHreflang('hreflang-default', 'x-default', canonicalUrl);
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', canonicalUrl);
    }
    
    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title);
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description);
    }
    
    // Add JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": language === 'ru' ? 'Инновэд' : 'INNOVED',
      "url": "https://www.innovedbroker.ru",
      "logo": "https://www.innovedbroker.ru/logo.png",
      "sameAs": [
        "https://t.me/innovedbroker"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+7-933-188-10-09",
        "email": "info@innovedbroker.ru",
        "contactType": "customer service",
        "availableLanguage": ["Russian", "English"]
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "RU"
      },
      "description": description
    };

    // Remove existing JSON-LD script
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new JSON-LD script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    // Initialize and configure Google Analytics
    analytics.init();
    if (typeof window !== 'undefined') {
      analytics.pageView(window.location.pathname, title);
    }
  }, [language, page, title, description, keywords, canonicalPath]);

  return null;
}
