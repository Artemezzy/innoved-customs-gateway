

## Добавление external links в пререндеринг всех страниц

### Что делаем

Добавляем 5 внешних ссылок (2ГИС, Яндекс.Карты, Авито, Telegram, MAX) в пререндеренный HTML всех страниц. Ссылки будут рендериться как отдельный `<nav>` блок после внутренних ссылок.

### Технические изменения

**Файл:** `scripts/prerender-meta.mjs`

1. **Добавить константу `EXTERNAL_LINKS`** (после `COMMON_LINKS`):
```js
const EXTERNAL_LINKS = [
  { href: 'https://2gis.ru/irkutsk/firm/70000001105785879', text: 'ИННОВЭД на 2ГИС' },
  { href: 'https://yandex.ru/maps/-/CPfFASpp', text: 'ИННОВЭД на Яндекс.Картах' },
  { href: 'https://www.avito.ru/brands/8e77d0c48e66c4309455043654b9f0dd', text: 'ИННОВЭД на Авито' },
  { href: 'https://t.me/innoved_broker', text: 'ИННОВЭД в Telegram' },
  { href: 'https://max.ru/id3849109300_bot', text: 'ИННОВЭД в MAX' },
];
```

2. **Обновить `buildPrerenderedContent()`** (строка ~383) — перед `return` добавить блок external links:
```js
const extTags = EXTERNAL_LINKS.map(l =>
  `<a href="${l.href}" target="_blank" rel="noopener noreferrer">${l.text}</a>`
).join('');
parts.push(`<nav>${extTags}</nav>`);
```

### Объём
~12 строк в одном файле.

