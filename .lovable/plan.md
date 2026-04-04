

## Создание страницы «Политика использования файлов cookies»

### Что делаем

Создаём новую страницу `/cookies` по аналогии с `/privacy` и `/terms` — тот же компонентный паттерн (SEOHead + PageHero + секции в карточках). Контент на русском и английском, 7 разделов.

### Технические изменения

**1. Новый файл `src/pages/CookiesPage.tsx`**

Структура идентична `Privacy.tsx`: объект `content` с ключами `ru` / `en`, каждый содержит `title` и массив `sections` (title + content). Раздел 2 «Какие cookies мы используем» будет содержать текстовую таблицу через `whitespace-pre-line`.

Разделы (H2):
1. Что такое cookies
2. Какие cookies мы используем (подразделы по 4 категориям: строго необходимые, функциональные, аналитические, маркетинговые)
3. Как мы используем аналитические и маркетинговые cookies
4. Управление cookies
5. Хранение данных и срок действия cookies
6. Обновления политики cookies
7. Контакты

**2. Маршрут в `src/App.tsx`**

Добавить `<Route path="/cookies" element={<CookiesPage />} />` рядом с `/privacy` и `/terms`.

**3. SEO в `src/components/SEOHead.tsx`**

Добавить запись `cookies` в `seoContent` для `ru` и `en` (title, description, keywords).

**4. Ссылки в Footer**

Добавить ссылку «Политика cookies» / «Cookie Policy» в блок `legal` в `src/components/Footer.tsx`.

**5. Пререндеринг в `scripts/prerender-meta.mjs`**

Добавить запись для `/cookies` с H1, текстом и ссылками.

### Объём
5 файлов, ~250 строк нового контента.

