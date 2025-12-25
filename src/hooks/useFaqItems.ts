import { useQuery } from '@tanstack/react-query';
import {
  hygraphClient,
  isHygraphConfigured,
  toHygraphLocale,
  type Locale,
  type HygraphFaqItem,
  type FaqItemsResponse,
} from '@/services/hygraph';
import { GET_FAQ_ITEMS, GET_FAQ_ITEMS_BY_CATEGORY } from '@/graphql/queries';
import { faqItems as staticFaqItems, type FAQItem } from '@/data/faq-items';

// Transform static FAQ items to match Hygraph interface
const transformStaticFaqItem = (item: FAQItem, locale: Locale, index: number): HygraphFaqItem => ({
  id: item.id,
  category: item.category,
  question: item.question[locale],
  answer: item.answer[locale],
  order: index,
  isActive: true,
});

const getFallbackFaqItems = (locale: Locale): HygraphFaqItem[] => {
  return staticFaqItems.map((item, index) => transformStaticFaqItem(item, locale, index));
};

const getFallbackFaqItemsByCategory = (locale: Locale, category: string): HygraphFaqItem[] => {
  return staticFaqItems
    .filter((item) => item.category === category)
    .map((item, index) => transformStaticFaqItem(item, locale, index));
};

// Fetch all FAQ items from Hygraph
const fetchFaqItems = async (locale: Locale): Promise<HygraphFaqItem[]> => {
  if (!isHygraphConfigured()) {
    console.log('Hygraph not configured, using fallback FAQ data');
    return getFallbackFaqItems(locale);
  }

  try {
    const data = await hygraphClient.request<FaqItemsResponse>(GET_FAQ_ITEMS, {
      locale: toHygraphLocale(locale),
    });
    return data.faqItems;
  } catch (error) {
    console.error('Error fetching FAQ items from Hygraph:', error);
    return getFallbackFaqItems(locale);
  }
};

// Fetch FAQ items by category from Hygraph
const fetchFaqItemsByCategory = async (locale: Locale, category: string): Promise<HygraphFaqItem[]> => {
  if (!isHygraphConfigured()) {
    console.log('Hygraph not configured, using fallback FAQ data');
    return getFallbackFaqItemsByCategory(locale, category);
  }

  try {
    const data = await hygraphClient.request<FaqItemsResponse>(GET_FAQ_ITEMS_BY_CATEGORY, {
      locale: toHygraphLocale(locale),
      category,
    });
    return data.faqItems;
  } catch (error) {
    console.error('Error fetching FAQ items by category from Hygraph:', error);
    return getFallbackFaqItemsByCategory(locale, category);
  }
};

export const useFaqItems = (locale: Locale) => {
  return useQuery({
    queryKey: ['faqItems', locale],
    queryFn: () => fetchFaqItems(locale),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useFaqItemsByCategory = (locale: Locale, category: string) => {
  return useQuery({
    queryKey: ['faqItems', locale, category],
    queryFn: () => fetchFaqItemsByCategory(locale, category),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: Boolean(category),
  });
};
