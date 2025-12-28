import { GraphQLClient } from 'graphql-request';

// Hygraph Content API endpoint
const HYGRAPH_ENDPOINT = import.meta.env.VITE_HYGRAPH_ENDPOINT || '';

// Create GraphQL client
export const hygraphClient = new GraphQLClient(HYGRAPH_ENDPOINT, {
  headers: {
    // No auth header needed for public Content API
  },
});

// Locale type matching Hygraph locales
export type Locale = 'ru' | 'en';

// Map our app locale to Hygraph locale enum
export const toHygraphLocale = (locale: Locale): string => {
  const localeMap: Record<Locale, string> = {
    ru: 'ru',
    en: 'en',
  };
  return localeMap[locale] || 'ru';
};

// ============ Type Definitions ============

export interface HygraphService {
  id: string;
  title: string;
  description?: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export interface HygraphFaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export interface HygraphBlogPost {
  id: string;
  slug: string;
  date: string;
  category: string;
  title: string;
  excerpt: string;
  content: string | { text: string };
  image?: {
    url: string;
  };
  isPublished: boolean;
}

export interface HygraphNewsItem {
  id: string;
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  content: string | { text: string };
  image?: {
    url: string;
  };
  isPublished: boolean;
}

export interface HygraphPageContent {
  id: string;
  pageKey: string;
  sectionKey: string;
  content: string;
}

// ============ Response Types ============

export interface ServicesResponse {
  services: HygraphService[];
}

export interface FaqItemsResponse {
  faqItems: HygraphFaqItem[];
}

export interface BlogPostsResponse {
  blogPosts: HygraphBlogPost[];
}

export interface BlogPostResponse {
  blogPost: HygraphBlogPost | null;
}

export interface NewsItemsResponse {
  newsItems: HygraphNewsItem[];
}

export interface NewsItemResponse {
  newsItem: HygraphNewsItem | null;
}

export interface PageContentsResponse {
  pageContents: HygraphPageContent[];
}

// ============ Check if Hygraph is configured ============

export const isHygraphConfigured = (): boolean => {
  return Boolean(HYGRAPH_ENDPOINT && HYGRAPH_ENDPOINT.length > 0);
};
