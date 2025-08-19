import { useEffect } from 'react';

interface SEOHeadProps {
  language: 'ru' | 'en' | 'zh';
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
  },
  zh: {
    home: {
      title: 'INNOVED - 俄罗斯海关清关服务 | 经纪服务',
      description: '俄罗斯专业海关清关服务。超过10年经验。快速、可靠、价格优惠。✅ 进口 ✅ 出口 ✅ 过境',
      keywords: '海关清关, 海关经纪, 进口, 出口, 俄罗斯, customs clearance'
    },
    privacy: {
      title: '隐私政策 - INNOVED',
      description: 'INNOVED公司个人数据处理隐私政策',
      keywords: '隐私政策, 个人数据, INNOVED'
    },
    terms: {
      title: '服务条款 - INNOVED',
      description: 'INNOVED公司网站使用服务条款',
      keywords: '服务条款, 使用条款, INNOVED'
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
    
    // Track page view with analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: content.title,
        page_location: window.location.href,
        page_language: language,
        custom_map: {'custom_parameter_1': page}
      });
    }
  }, [language, page, content]);

  return null;
}