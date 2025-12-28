import { gql } from 'graphql-request';

// ============ Service Queries ============

export const GET_SERVICES = gql`
  query GetServices($locale: Locale!) {
    services(where: { isActive: true }, orderBy: order_ASC, locales: [$locale, ru]) {
      id
      title
      description
      icon
      order
      isActive
    }
  }
`;

// ============ FAQ Queries ============

export const GET_FAQ_ITEMS = gql`
  query GetFaqItems($locale: Locale!) {
    faqItems(where: { isActive: true }, orderBy: order_ASC, locales: [$locale, ru]) {
      id
      category
      question
      answer
      order
      isActive
    }
  }
`;

export const GET_FAQ_ITEMS_BY_CATEGORY = gql`
  query GetFaqItemsByCategory($locale: Locale!, $category: String!) {
    faqItems(
      where: { isActive: true, category: $category }
      orderBy: order_ASC
      locales: [$locale, ru]
    ) {
      id
      category
      question
      answer
      order
      isActive
    }
  }
`;

// ============ Blog Queries ============

export const GET_BLOG_POSTS = gql`
  query GetBlogPosts($locale: Locale!) {
    blogPosts(where: { isPublished: true }, orderBy: date_DESC, locales: [$locale, ru]) {
      id
      slug
      date
      category
      title
      excerpt
      image {
        url
      }
      isPublished
    }
  }
`;

export const GET_BLOG_POST_BY_SLUG = gql`
  query GetBlogPostBySlug($locale: Locale!, $slug: String!) {
    blogPost(where: { slug: $slug }, locales: [$locale, ru]) {
      id
      slug
      date
      category
      title
      excerpt
      content {
        text
      }
      image {
        url
      }
      isPublished
    }
  }
`;

export const GET_BLOG_POSTS_BY_CATEGORY = gql`
  query GetBlogPostsByCategory($locale: Locale!, $category: String!) {
    blogPosts(
      where: { isPublished: true, category: $category }
      orderBy: date_DESC
      locales: [$locale, ru]
    ) {
      id
      slug
      date
      category
      title
      excerpt
      image {
        url
      }
      isPublished
    }
  }
`;

// ============ News Queries ============

export const GET_NEWS_ITEMS = gql`
  query GetNewsItems($locale: Locale!) {
    newsItems(where: { isPublished: true }, orderBy: date_DESC, locales: [$locale, ru]) {
      id
      slug
      date
      title
      excerpt
      image {
        url
      }
      isPublished
    }
  }
`;

export const GET_NEWS_ITEM_BY_SLUG = gql`
  query GetNewsItemBySlug($locale: Locale!, $slug: String!) {
    newsItem(where: { slug: $slug }, locales: [$locale, ru]) {
      id
      slug
      date
      title
      excerpt
      content {
        html
        text
      }
      image {
        url
      }
      isPublished
    }
  }
`;

// ============ Page Content Queries ============

export const GET_PAGE_CONTENT = gql`
  query GetPageContent($locale: Locale!, $pageKey: String!) {
    pageContents(where: { pageKey: $pageKey }, locales: [$locale, ru]) {
      id
      pageKey
      sectionKey
      content
    }
  }
`;

export const GET_PAGE_SECTION = gql`
  query GetPageSection($locale: Locale!, $pageKey: String!, $sectionKey: String!) {
    pageContents(
      where: { pageKey: $pageKey, sectionKey: $sectionKey }
      locales: [$locale, ru]
      first: 1
    ) {
      id
      pageKey
      sectionKey
      content
    }
  }
`;
