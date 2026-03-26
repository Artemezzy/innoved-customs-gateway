

## Оптимизация критического пути рендеринга (CSS + шрифты)

### Проблема
Два ресурса блокируют начальную отрисовку и задерживают LCP:
1. **CSS бандл** (`/assets/index-*.css`) — Vite по умолчанию вставляет `<link rel="stylesheet">`, который блокирует рендер
2. **Google Fonts Montserrat** — синхронная загрузка через `<link rel="stylesheet">`

### Решение

#### 1. Шрифт Montserrat — отложенная загрузка (index.html)

Заменить текущий синхронный `<link>` на паттерн с `preload` + `media="print"` trick:

```html
<!-- Preconnect остаётся -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Асинхронная загрузка шрифта -->
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
<noscript>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap">
</noscript>
```

Шрифт уже использует `display=swap`, поэтому текст будет виден сразу с фоллбэком, а Montserrat подгрузится асинхронно.

#### 2. CSS бандл — встроить критический CSS (опционально, через Vite)

Vite не имеет встроенной поддержки inline critical CSS, но есть два подхода:

**Подход A** — плагин `vite-plugin-css-injected-by-js` (инлайнит весь CSS в JS, убирает блокирующий `<link>`):

Добавить в `vite.config.ts`:
```ts
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

plugins: [
  react(),
  cssInjectedByJsPlugin(),
  // ...
]
```

Это полностью убирает отдельный CSS-файл — стили вставляются через JS при загрузке бандла. CSS перестаёт блокировать рендер.

**Подход B** (рекомендуемый, без плагинов) — оставить CSS как есть, но сфокусироваться на шрифтах, т.к. CSS бандл Vite обычно мал и быстро загружается с того же домена.

### Рекомендация

Применить только **пункт 1** (асинхронная загрузка шрифтов) — это даст наибольший эффект при минимальных изменениях. CSS бандл загружается с того же домена и кешируется, его влияние на LCP минимально.

### Файлы для изменения
- `index.html` — заменить строку 21 на асинхронную загрузку шрифта (4 строки)

