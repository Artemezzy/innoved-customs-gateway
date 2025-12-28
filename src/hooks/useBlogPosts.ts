import { useQuery } from '@tanstack/react-query';
import {
  hygraphClient,
  isHygraphConfigured,
  toHygraphLocale,
  type Locale,
  type HygraphBlogPost,
  type BlogPostsResponse,
  type BlogPostResponse,
} from '@/services/hygraph';
import { GET_BLOG_POSTS, GET_BLOG_POST_BY_SLUG, GET_BLOG_POSTS_BY_CATEGORY } from '@/graphql/queries';
import { blogPosts as staticBlogPosts, type BlogPost } from '@/data/blog-posts';

// Transform static blog post to match Hygraph interface
const transformStaticBlogPost = (post: BlogPost, locale: Locale): HygraphBlogPost => ({
  id: post.slug,
  slug: post.slug,
  date: post.date,
  category: post.category,
  title: post.title[locale],
  excerpt: post.excerpt[locale],
  content: { text: post.content[locale] },
  image: undefined,
  isPublished: true,
});

const getFallbackBlogPosts = (locale: Locale): HygraphBlogPost[] => {
  return staticBlogPosts.map((post) => transformStaticBlogPost(post, locale));
};

const getFallbackBlogPostBySlug = (locale: Locale, slug: string): HygraphBlogPost | null => {
  const post = staticBlogPosts.find((p) => p.slug === slug);
  return post ? transformStaticBlogPost(post, locale) : null;
};

const getFallbackBlogPostsByCategory = (locale: Locale, category: string): HygraphBlogPost[] => {
  return staticBlogPosts
    .filter((post) => post.category === category)
    .map((post) => transformStaticBlogPost(post, locale));
};

// Fetch all blog posts from Hygraph
const fetchBlogPosts = async (locale: Locale): Promise<HygraphBlogPost[]> => {
  if (!isHygraphConfigured()) {
    console.log('Hygraph not configured, using fallback blog data');
    return getFallbackBlogPosts(locale);
  }

  try {
    const data = await hygraphClient.request<BlogPostsResponse>(GET_BLOG_POSTS, {
      locale: toHygraphLocale(locale),
    });
    return data.blogPosts;
  } catch (error) {
    console.error('Error fetching blog posts from Hygraph:', error);
    return getFallbackBlogPosts(locale);
  }
};

// Fetch single blog post by slug from Hygraph
const fetchBlogPostBySlug = async (locale: Locale, slug: string): Promise<HygraphBlogPost | null> => {
  if (!isHygraphConfigured()) {
    console.log('Hygraph not configured, using fallback blog data');
    return getFallbackBlogPostBySlug(locale, slug);
  }

  try {
    const data = await hygraphClient.request<BlogPostResponse>(GET_BLOG_POST_BY_SLUG, {
      locale: toHygraphLocale(locale),
      slug,
    });
    return data.blogPost;
  } catch (error) {
    console.error('Error fetching blog post from Hygraph:', error);
    return getFallbackBlogPostBySlug(locale, slug);
  }
};

// Fetch blog posts by category from Hygraph
const fetchBlogPostsByCategory = async (locale: Locale, category: string): Promise<HygraphBlogPost[]> => {
  if (!isHygraphConfigured()) {
    console.log('Hygraph not configured, using fallback blog data');
    return getFallbackBlogPostsByCategory(locale, category);
  }

  try {
    const data = await hygraphClient.request<BlogPostsResponse>(GET_BLOG_POSTS_BY_CATEGORY, {
      locale: toHygraphLocale(locale),
      category,
    });
    return data.blogPosts;
  } catch (error) {
    console.error('Error fetching blog posts by category from Hygraph:', error);
    return getFallbackBlogPostsByCategory(locale, category);
  }
};

export const useBlogPosts = (locale: Locale) => {
  return useQuery({
    queryKey: ['blogPosts', locale],
    queryFn: () => fetchBlogPosts(locale),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useBlogPost = (locale: Locale, slug: string) => {
  return useQuery({
    queryKey: ['blogPost', locale, slug],
    queryFn: () => fetchBlogPostBySlug(locale, slug),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: Boolean(slug),
  });
};

export const useBlogPostsByCategory = (locale: Locale, category: string) => {
  return useQuery({
    queryKey: ['blogPosts', locale, category],
    queryFn: () => fetchBlogPostsByCategory(locale, category),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: Boolean(category),
  });
};
