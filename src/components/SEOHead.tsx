import { useEffect } from 'react';
import { analytics } from '../utils/analytics';

interface SEOHeadProps {
  language: 'ru' | 'en';
  page?: string;
}

const seoContent = {
  ru: {
    home: {
      title: 'ИННОВЭД - Таможенное оформление товаров | Брокерские услуги',
      description: 'Профессиональные услуги таможенного оформления по всей России. Более 10 лет опыта. Быстро, надежно, по низким ценам. ✅ Импорт ✅ Экспорт ✅ Транзит',
      keywords: 'таможенное оформление, таможенный брокер, импорт, экспорт, россия, customs clearance, broker'
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

export function SEOHead({ language, page = 'home' }: SEOHeadProps) {
  const content = seoContent[language][page as keyof typeof seoContent[typeof language]];

  useEffect(() => {
    // Update document title
    document.title = content.title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', content.description);
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', content.keywords);
    }
    
    // Update lang attribute
    document.documentElement.lang = language;
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', content.title);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', content.description);
    }
    
    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', content.title);
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', content.description);
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
      "description": content.description
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
      analytics.pageView(window.location.pathname, content.title);
    }
  }, [language, page, content]);

  return null;
}