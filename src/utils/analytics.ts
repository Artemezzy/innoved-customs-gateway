// Analytics utility functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const analytics = {
  // Track page views
  pageView: (path: string, title?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: path,
        page_title: title,
      });
    }
  },

  // Track events
  event: (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  },

  // Track conversions
  conversion: (conversionId: string, value?: number, currency = 'RUB') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: conversionId,
        value: value,
        currency: currency,
      });
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