
## Полноценная SEO-оптимизация всех страниц

### Текущие проблемы

| Страница | Проблема |
|----------|----------|
| AboutPage, ServicesPage, HowWeWorkPage, ContactPage, BlogPage, NewsPage, FAQPage | Используют `page="home"` — получают SEO главной страницы |
| BlogPostPage, NewsItemPage | Используют `page="home"` вместо динамических метаданных |
| ServiceDetailPage | Реализует SEO отдельно, дублирует логику |
| Privacy, Terms | Работают корректно |

### План реализации

#### 1. Расширить SEOHead компонент

Добавить метаданные для всех статических страниц в `seoContent`:

```text
Текущие страницы: home, privacy, terms

Добавляем:
├── about      — О компании
├── services   — Услуги (общая страница)
├── howWeWork  — Как мы работаем
├── contact    — Контакты
├── blog       — Блог
├── news       — Новости
└── faq        — FAQ
```

#### 2. Добавить поддержку динамических метаданных

Расширить интерфейс `SEOHeadProps` для передачи кастомных title/description/keywords:

```tsx
interface SEOHeadProps {
  language: 'ru' | 'en';
  page?: string;
  // Новые опциональные поля для динамического контента
  customTitle?: string;
  customDescription?: string;
  customKeywords?: string;
  // Canonical URL для SEO
  canonicalPath?: string;
}
```

Это позволит:
- Статические страницы — использовать предустановленные метаданные по ключу `page`
- Динамические страницы (блог, новости, услуги) — передавать кастомные значения

#### 3. Добавить canonical URL

Динамическое обновление `<link rel="canonical">` на основе текущего пути:

```tsx
// В SEOHead.tsx
const canonicalUrl = `https://innovedbroker.ru${canonicalPath || window.location.pathname}`;
```

#### 4. Обновить все страницы

**Статические страницы** — изменить `page` на соответствующий ключ:

| Файл | Было | Станет |
|------|------|--------|
| AboutPage.tsx | `page="home"` | `page="about"` |
| ServicesPage.tsx | `page="home"` | `page="services"` |
| HowWeWorkPage.tsx | `page="home"` | `page="howWeWork"` |
| ContactPage.tsx | `page="home"` | `page="contact"` |
| BlogPage.tsx | `page="home"` | `page="blog"` |
| NewsPage.tsx | `page="home"` | `page="news"` |
| FAQPage.tsx | `page="home"` | `page="faq"` |

**Динамические страницы** — использовать кастомные метаданные:

| Файл | Решение |
|------|---------|
| BlogPostPage.tsx | `customTitle={post.title}`, `customDescription={post.excerpt}` |
| NewsItemPage.tsx | `customTitle={item.title}`, `customDescription={item.excerpt}` |
| ServiceDetailPage.tsx | `customTitle={service.seo[language].title}`, `customDescription`, `customKeywords` |

### Детализация метаданных для каждой страницы

#### О компании (about)
```text
RU:
  title: "О компании ИННОВЭД | Таможенный брокер с опытом более 10 лет"
  description: "Узнайте о компании ИННОВЭД — ваш надёжный партнёр в таможенном оформлении. История, миссия, ценности и команда профессионалов."
  keywords: "о компании, инновэд, таможенный брокер москва, команда специалистов, опыт ВЭД"

EN:
  title: "About INNOVED | Customs Broker with 10+ Years Experience"
  description: "Learn about INNOVED — your reliable partner in customs clearance. Our history, mission, values and team of professionals."
  keywords: "about us, innoved, customs broker russia, professional team, foreign trade experience"
```

#### Услуги (services)
```text
RU:
  title: "Услуги таможенного оформления | ИННОВЭД"
  description: "Полный спектр услуг по таможенному оформлению: импорт, экспорт, сертификация, классификация ТН ВЭД, консультации. Работаем по всей России."
  keywords: "таможенные услуги, импорт, экспорт, сертификация, классификация ТН ВЭД, ВЭД услуги, ИННОВЭД"

EN:
  title: "Customs Clearance Services | INNOVED"
  description: "Full range of customs clearance services: import, export, certification, HS code classification, consulting. Operating across Russia."
  keywords: "customs services, import, export, certification, HS code classification, foreign trade services, INNOVED"
```

#### Как мы работаем (howWeWork)
```text
RU:
  title: "Как мы работаем | Прозрачный процесс таможенного оформления"
  description: "Узнайте, как проходит таможенное оформление с ИННОВЭД: от заявки до получения груза. Пошаговый процесс, сроки, гарантии."
  keywords: "процесс оформления, этапы работы, сроки таможенного оформления, как оформить груз"

EN:
  title: "How We Work | Transparent Customs Clearance Process"
  description: "Learn how customs clearance works with INNOVED: from application to cargo receipt. Step-by-step process, timelines, guarantees."
  keywords: "clearance process, work stages, customs clearance timelines, how to clear cargo"
```

#### Контакты (contact)
```text
RU:
  title: "Контакты ИННОВЭД | Связаться с таможенным брокером"
  description: "Свяжитесь с ИННОВЭД для консультации по таможенному оформлению. Телефон, email, Telegram. Ответим в течение 15 минут."
  keywords: "контакты инновэд, таможенный брокер телефон, заказать оформление, консультация ВЭД"

EN:
  title: "Contact INNOVED | Get in Touch with Customs Broker"
  description: "Contact INNOVED for customs clearance consultation. Phone, email, Telegram. We respond within 15 minutes."
  keywords: "contact innoved, customs broker phone, order clearance, foreign trade consultation"
```

#### Блог (blog)
```text
RU:
  title: "Блог ИННОВЭД | Статьи о таможенном оформлении и ВЭД"
  description: "Полезные материалы о таможенном оформлении, изменениях в законодательстве, советы по импорту и экспорту от экспертов ИННОВЭД."
  keywords: "блог инновэд, статьи таможня, законодательство ВЭД, советы импорт экспорт"

EN:
  title: "INNOVED Blog | Articles on Customs Clearance and Foreign Trade"
  description: "Useful materials on customs clearance, legislation changes, import and export tips from INNOVED experts."
  keywords: "innoved blog, customs articles, foreign trade legislation, import export tips"
```

#### Новости (news)
```text
RU:
  title: "Новости ИННОВЭД | События и обновления компании"
  description: "Новости компании ИННОВЭД: события, достижения, новые услуги и важные обновления в сфере таможенного оформления."
  keywords: "новости инновэд, новости таможня, события компании, обновления ВЭД"

EN:
  title: "INNOVED News | Company Events and Updates"
  description: "INNOVED company news: events, achievements, new services and important updates in customs clearance."
  keywords: "innoved news, customs news, company events, foreign trade updates"
```

#### FAQ (faq)
```text
RU:
  title: "Часто задаваемые вопросы | ИННОВЭД"
  description: "Ответы на популярные вопросы о таможенном оформлении: сроки, стоимость, документы, порядок работы с ИННОВЭД."
  keywords: "FAQ таможня, вопросы ответы, сколько стоит оформление, какие документы нужны"

EN:
  title: "Frequently Asked Questions | INNOVED"
  description: "Answers to popular questions about customs clearance: timelines, costs, documents, working procedures with INNOVED."
  keywords: "customs FAQ, questions answers, clearance cost, what documents needed"
```

### Файлы для изменения

```text
src/
├── components/
│   └── SEOHead.tsx          ← Расширить seoContent + добавить custom props
├── pages/
│   ├── AboutPage.tsx        ← page="about"
│   ├── ServicesPage.tsx     ← page="services"
│   ├── ServiceDetailPage.tsx ← customTitle/Description/Keywords из service.seo
│   ├── HowWeWorkPage.tsx    ← page="howWeWork"
│   ├── ContactPage.tsx      ← page="contact"
│   ├── BlogPage.tsx         ← page="blog"
│   ├── BlogPostPage.tsx     ← customTitle/Description из post
│   ├── NewsPage.tsx         ← page="news"
│   ├── NewsItemPage.tsx     ← customTitle/Description из item
│   └── FAQPage.tsx          ← page="faq"
```

### Результат

После изменений каждая страница будет иметь:
- Уникальный `<title>` — важно для ранжирования
- Уникальный `<meta description>` — влияет на CTR в выдаче
- Релевантные `<meta keywords>` — дополнительный сигнал
- Корректные OG и Twitter теги — для шаринга в соцсетях
- Canonical URL — предотвращает дублирование контента
- Правильный `lang` атрибут — для языковых версий

Это значительно улучшит индексацию и видимость каждой страницы в поисковых системах.
