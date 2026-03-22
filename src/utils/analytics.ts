// Analytics utility functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Get GA4 Measurement ID from environment or use placeholder
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'GA_MEASUREMENT_ID';
const IS_DEVELOPMENT = import.meta.env.DEV;

export const analytics = {
  // Initialize GA4 with debug mode for development
  init: () => {
    if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID !== 'GA_MEASUREMENT_ID') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        debug_mode: IS_DEVELOPMENT,
        send_page_view: false, // We'll send manually
      });
    }
  },

  // Track page views
  pageView: (path: string, title?: string) => {
    if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID !== 'GA_MEASUREMENT_ID') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: path,
        page_title: title,
        debug_mode: IS_DEVELOPMENT,
      });
      
      // Also send as event for better tracking
      window.gtag('event', 'page_view', {
        page_title: title,
        page_location: window.location.href,
        page_path: path,
      });
    }
  },

  // Track events
  event: (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID !== 'GA_MEASUREMENT_ID') {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        debug_mode: IS_DEVELOPMENT,
      });
      
      // Log to console in development
      if (IS_DEVELOPMENT) {
        console.log('Analytics Event:', { action, category, label, value });
      }
    }
  },

  // Track conversions
  conversion: (conversionId: string, value?: number, currency = 'RUB') => {
    if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID !== 'GA_MEASUREMENT_ID') {
      window.gtag('event', 'conversion', {
        send_to: conversionId,
        value: value,
        currency: currency,
      });
      
      if (IS_DEVELOPMENT) {
        console.log('Analytics Conversion:', { conversionId, value, currency });
      }
    }
  },

  // Track specific business events
  contactClick: (method: 'telegram' | 'phone' | 'email' | 'contact-form') => {
    analytics.event('contact_click', 'engagement', method);
  },

  serviceInquiry: (serviceType: string) => {
    analytics.event('service_inquiry', 'lead_generation', serviceType);
  },

  languageChange: (language: string) => {
    analytics.event('language_change', 'user_preference', language);
  },

  priceCheck: (serviceType: string) => {
    analytics.event('price_check', 'engagement', serviceType);
  },

  formSubmit: (formType: string) => {
    analytics.event('form_submit', 'lead_generation', formType);
  },

  fileDownload: (fileName: string) => {
    analytics.event('file_download', 'engagement', fileName);
  },

  externalLinkClick: (url: string) => {
    analytics.event('external_link_click', 'engagement', url);
  }
};