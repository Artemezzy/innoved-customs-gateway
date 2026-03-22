

# Fix H1-H6 heading hierarchy across pages

## Problem
Several pages skip heading levels (H1 → H3, missing H2) or use non-semantic tags where headings should be. This hurts SEO.

## Changes

### 1. `/services` page — Add H2 wrapper in `Services.tsx`
Currently ServiceCard uses H3 directly. Add a visually hidden H2 section heading above the grid:
```
<h2 className="sr-only">{language === 'ru' ? 'Список услуг' : 'Services list'}</h2>
```
This preserves visual design while fixing H1→H3 skip.

### 2. `/how-we-work` page — Change step H3 to H2 in `HowWeWork.tsx`
When `showHeader={false}` (used on the dedicated page), the component's own H2 title is hidden, leaving only H3 step titles. Fix: change step `fullTitle` from `<h3>` to `<h2>` when shown on standalone page, OR add a `sr-only` H2 inside the component when header is hidden.

Simpler approach: add an `sr-only` H2 before the tabs when `showHeader` is false:
```tsx
{!showHeader && (
  <h2 className="sr-only">{content.title}</h2>
)}
```

### 3. `/contact` page — Add H2 headings in `Contact.tsx`
The CardTitle elements use generic tags. Change the two `CardTitle` components to render as H2:
```tsx
<CardTitle asChild><h2 className="...">{text.companyInfo.title}</h2></CardTitle>
```

### 4. `/blog` page — Add H2 in `BlogPage.tsx`
Add a visually hidden H2 section heading before the content carousel:
```
<h2 className="sr-only">{language === 'ru' ? 'Статьи' : 'Articles'}</h2>
```
And change ContentCard's `<h3>` — this is correct as-is (H2 → H3 hierarchy).

### 5. `/news` page — Add H2 in `NewsPage.tsx`
Same as blog — add `sr-only` H2 before content:
```
<h2 className="sr-only">{language === 'ru' ? 'Новости компании' : 'Company news'}</h2>
```

### 6. `/faq` page — Add H2 in `FAQPage.tsx`
Add `sr-only` H2 before the accordion, and wrap accordion question text in H3:
```tsx
<h2 className="sr-only">{language === 'ru' ? 'Вопросы и ответы' : 'Questions and answers'}</h2>
```
Change the `<span>` inside AccordionTrigger to `<h3>`:
```tsx
<h3 className="text-foreground font-medium pr-4">{item.question}</h3>
```

## Files to modify
- `src/components/Services.tsx` — add sr-only H2
- `src/components/HowWeWork.tsx` — add sr-only H2 when no header
- `src/components/Contact.tsx` — CardTitle → H2
- `src/pages/BlogPage.tsx` — add sr-only H2
- `src/pages/NewsPage.tsx` — add sr-only H2
- `src/pages/FAQPage.tsx` — add sr-only H2, span → H3

