import { useQuery } from '@tanstack/react-query';
import {
  hygraphClient,
  isHygraphConfigured,
  toHygraphLocale,
  type Locale,
  type HygraphNewsItem,
  type NewsItemsResponse,
  type NewsItemResponse,
} from '@/services/hygraph';
import { GET_NEWS_ITEMS, GET_NEWS_ITEM_BY_SLUG } from '@/graphql/queries';
import { newsItems as staticNewsItems, type NewsItem } from '@/data/news-items';

// Transform static news item to match Hygraph interface
const transformStaticNewsItem = (item: NewsItem, locale: Locale): HygraphNewsItem => ({
  id: item.slug,
  slug: item.slug,
  date: item.date,
  title: item.title[locale],
  excerpt: item.excerpt[locale],
  content: { text: item.content[locale] },
  isPublished: true,
});

const getFallbackNewsItems = (locale: Locale): HygraphNewsItem[] => {
  return staticNewsItems.map((item) => transformStaticNewsItem(item, locale));
};

const getFallbackNewsItemBySlug = (locale: Locale, slug: string): HygraphNewsItem | null => {
  const item = staticNewsItems.find((n) => n.slug === slug);
  return item ? transformStaticNewsItem(item, locale) : null;
};

// Fetch all news items from Hygraph
const fetchNewsItems = async (locale: Locale): Promise<HygraphNewsItem[]> => {
  if (!isHygraphConfigured()) {
    console.log('Hygraph not configured, using fallback news data');
    return getFallbackNewsItems(locale);
  }

  try {
    const data = await hygraphClient.request<NewsItemsResponse>(GET_NEWS_ITEMS, {
      locale: toHygraphLocale(locale),
    });
    return data.newsItems;
  } catch (error) {
    console.error('Error fetching news items from Hygraph:', error);
    return getFallbackNewsItems(locale);
  }
};

// Fetch single news item by slug from Hygraph
const fetchNewsItemBySlug = async (locale: Locale, slug: string): Promise<HygraphNewsItem | null> => {
  if (!isHygraphConfigured()) {
    console.log('Hygraph not configured, using fallback news data');
    return getFallbackNewsItemBySlug(locale, slug);
  }

  try {
    const data = await hygraphClient.request<NewsItemResponse>(GET_NEWS_ITEM_BY_SLUG, {
      locale: toHygraphLocale(locale),
      slug,
    });
    return data.newsItem;
  } catch (error) {
    console.error('Error fetching news item from Hygraph:', error);
    return getFallbackNewsItemBySlug(locale, slug);
  }
};

export const useNewsItems = (locale: Locale) => {
  return useQuery({
    queryKey: ['newsItems', locale],
    queryFn: () => fetchNewsItems(locale),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useNewsItem = (locale: Locale, slug: string) => {
  return useQuery({
    queryKey: ['newsItem', locale, slug],
    queryFn: () => fetchNewsItemBySlug(locale, slug),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: Boolean(slug),
  });
};
