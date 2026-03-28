

## Разделение sitemap на индексный файл и 3 дочерних

### Что делаем

Заменяем единый `sitemap.xml` на индексный файл (`sitemapindex`), который ссылается на 3 дочерних sitemap. Убираем `priority` и `changefreq`, добавляем `lastmod` с текущей датой (2026-03-28).

### Файлы

**1. `public/sitemap.xml`** — индексный файл (по образцу из вложения):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.innovedbroker.ru/sitemap-main.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://www.innovedbroker.ru/sitemap-service.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://www.innovedbroker.ru/sitemap-geo.xml</loc>
  </sitemap>
</sitemapindex>
```

**2. `public/sitemap-main.xml`** — все страницы кроме услуг и географии:
- `/`
- `/about`
- `/how-we-work`
- `/contact`
- `/blog`
- `/faq`
- `/privacy`
- `/terms`
- `/rastamojka-tehniki`
- `/rastamojka-zapchastey`
- `/rastamojka-odejdi`
- `/rastamojka-oborudovaniya`

**3. `public/sitemap-service.xml`** — раздел услуг:
- `/services`
- `/services/import`
- `/services/export`
- `/services/certification`
- `/services/hs-code`
- `/services/customs-letters`
- `/services/ved-consulting`
- `/services/inspection`
- `/services/translation`
- `/services/rastamozhka-tovarov`
- `/services/rastamozhka-gruzov`
- `/services/tamozhennaya-ochistka`

**4. `public/sitemap-geo.xml`** — раздел географии:
- `/tamozhennyj-broker`
- `/tamozhennyj-broker/barnaul`
- ... все 28 городов

Каждый URL будет в формате:
```xml
<url>
  <loc>https://www.innovedbroker.ru/...</loc>
  <lastmod>2026-03-28</lastmod>
</url>
```

**5. `public/robots.txt`** — обновить ссылку на sitemap (остается `sitemap.xml`, т.к. он теперь индексный — менять не нужно).

### Итого: 4 файла
- `public/sitemap.xml` — перезаписать
- `public/sitemap-main.xml` — создать
- `public/sitemap-service.xml` — создать
- `public/sitemap-geo.xml` — создать

