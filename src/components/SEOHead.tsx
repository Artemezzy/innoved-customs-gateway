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
      title: 'ИННОВЭД - Таможенное оформление товаров | Брокерские услуги',
      description: 'Профессиональные услуги таможенного оформления по всей России. Более 10 лет опыта. Быстро, надежно, по низким ценам. ✅ Импорт ✅ Экспорт ✅ Транзит',
      keywords: 'таможенное оформление, таможенный брокер, импорт, экспорт, россия, customs clearance, broker'
    },
    about: {
      title: 'О компании ИННОВЭД | Таможенный брокер с опытом более 10 лет',
      description: 'Узнайте о компании ИННОВЭД — ваш надёжный партнёр в таможенном оформлении. История, миссия, ценности и команда профессионалов.',
      keywords: 'о компании, инновэд, таможенный брокер москва, команда специалистов, опыт ВЭД'
    },
    services: {
      title: 'Услуги таможенного оформления | ИННОВЭД',
      description: 'Полный спектр услуг по таможенному оформлению: импорт, экспорт, сертификация, классификация ТН ВЭД, консультации. Работаем по всей России.',
      keywords: 'таможенные услуги, импорт, экспорт, сертификация, классификация ТН ВЭД, ВЭД услуги, ИННОВЭД'
    },
    howWeWork: {
      title: 'Как мы работаем | Прозрачный процесс таможенного оформления',
      description: 'Узнайте, как проходит таможенное оформление с ИННОВЭД: от заявки до получения груза. Пошаговый процесс, сроки, гарантии.',
      keywords: 'процесс оформления, этапы работы, сроки таможенного оформления, как оформить груз'
    },
    contact: {
      title: 'Контакты ИННОВЭД | Связаться с таможенным брокером',
      description: 'Свяжитесь с ИННОВЭД для консультации по таможенному оформлению. Телефон, email, Telegram. Ответим в течение 15 минут.',
      keywords: 'контакты инновэд, таможенный брокер телефон, заказать оформление, консультация ВЭД'
    },
    blog: {
      title: 'Блог ИННОВЭД | Статьи о таможенном оформлении и ВЭД',
      description: 'Полезные материалы о таможенном оформлении, изменениях в законодательстве, советы по импорту и экспорту от экспертов ИННОВЭД.',
      keywords: 'блог инновэд, статьи таможня, законодательство ВЭД, советы импорт экспорт'
    },
    news: {
      title: 'Новости ИННОВЭД | События и обновления компании',
      description: 'Новости компании ИННОВЭД: события, достижения, новые услуги и важные обновления в сфере таможенного оформления.',
      keywords: 'новости инновэд, новости таможня, события компании, обновления ВЭД'
    },
    faq: {
      title: 'Часто задаваемые вопросы | ИННОВЭД',
      description: 'Ответы на популярные вопросы о таможенном оформлении: сроки, стоимость, документы, порядок работы с ИННОВЭД.',
      keywords: 'FAQ таможня, вопросы ответы, сколько стоит оформление, какие документы нужны'
    },
    privacy: {
      title: 'Политика конфиденциальности - ИННОВЭД',
      description: 'Политика конфиденциальности компании ИННОВЭД по обработке персональных данных',
      keywords: 'политика конфиденциальности, персональные данные, ИННОВЭД'
    },
    terms: {
      title: 'Пользовательское соглашение - ИННОВЭД',
      description: 'Пользовательское соглашение компании ИННОВЭД об использовании сайта',
      keywords: 'пользовательское соглашение, условия использования, ИННОВЭД'
    }
  },
  en: {
    home: {
      title: 'INNOVED - Customs Clearance Services | Broker Services Russia',
      description: 'Professional customs clearance services across Russia. Over 10 years of experience. Fast, reliable, competitive prices. ✅ Import ✅ Export ✅ Transit',
      keywords: 'customs clearance, customs broker, import, export, russia, таможенное оформление'
    },
    about: {
      title: 'About INNOVED | Customs Broker with 10+ Years Experience',
      description: 'Learn about INNOVED — your reliable partner in customs clearance. Our history, mission, values and team of professionals.',
      keywords: 'about us, innoved, customs broker russia, professional team, foreign trade experience'
    },
    services: {
      title: 'Customs Clearance Services | INNOVED',
      description: 'Full range of customs clearance services: import, export, certification, HS code classification, consulting. Operating across Russia.',
      keywords: 'customs services, import, export, certification, HS code classification, foreign trade services, INNOVED'
    },
    howWeWork: {
      title: 'How We Work | Transparent Customs Clearance Process',
      description: 'Learn how customs clearance works with INNOVED: from application to cargo receipt. Step-by-step process, timelines, guarantees.',
      keywords: 'clearance process, work stages, customs clearance timelines, how to clear cargo'
    },
    contact: {
      title: 'Contact INNOVED | Get in Touch with Customs Broker',
      description: 'Contact INNOVED for customs clearance consultation. Phone, email, Telegram. We respond within 15 minutes.',
      keywords: 'contact innoved, customs broker phone, order clearance, foreign trade consultation'
    },
    blog: {
      title: 'INNOVED Blog | Articles on Customs Clearance and Foreign Trade',
      description: 'Useful materials on customs clearance, legislation changes, import and export tips from INNOVED experts.',
      keywords: 'innoved blog, customs articles, foreign trade legislation, import export tips'
    },
    news: {
      title: 'INNOVED News | Company Events and Updates',
      description: 'INNOVED company news: events, achievements, new services and important updates in customs clearance.',
      keywords: 'innoved news, customs news, company events, foreign trade updates'
    },
    faq: {
      title: 'Frequently Asked Questions | INNOVED',
      description: 'Answers to popular questions about customs clearance: timelines, costs, documents, working procedures with INNOVED.',
      keywords: 'customs FAQ, questions answers, clearance cost, what documents needed'
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
    const canonicalUrl = `https://innovedbroker.ru${canonicalPath || (typeof window !== 'undefined' ? window.location.pathname : '/')}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;
    
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
      "name": language === 'ru' ? 'ИННОВЭД' : 'INNOVED',
      "url": "https://innovedbroker.ru",
      "logo": "https://innovedbroker.ru/logo.png",
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
