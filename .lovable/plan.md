## Личный кабинет (ЛК) для INNOVED — план реализации

Добавляем закрытую часть сайта `/lk/*` с авторизацией, ролями (manager/client), поставками, документами и чатом. Публичная часть сайта не меняется (кроме кнопки «Личный кабинет» в шапке).

### 1. Маршрутизация и структура (src/App.tsx)

Оборачиваем всё в новый `AuthProvider`. Внутри `BrowserRouter` → два «верхних» маршрута:

- `/lk/login` и `/lk/*` — рендерятся БЕЗ публичного `Layout` (без Header/Footer), используют `LKLayout`.
- `/*` — все существующие публичные роуты, как сейчас, внутри `Layout`. Ни один существующий путь не меняется.

```text
<AuthProvider>
  <BrowserRouter>
    <LanguageProvider>
      Routes:
        /lk/login            → LKLoginPage (без LKLayout)
        /lk/*                → LKLayout + вложенные Routes (dashboard, clients, clients/:id, shipments, shipments/:id, messages)
        /*                   → Layout + все текущие публичные Routes без изменений
```

### 2. Новые файлы

**Контекст и API**

- `src/contexts/AuthContext.tsx` — token в памяти (не localStorage), user `{id,name,role,clientId}`, `login()`, `logout()`, `useAuth()`.
- `src/api/lkClient.ts` — axios, baseURL `/api`, request-interceptor с `Authorization: Bearer`, response-interceptor: на 401 → `logout()` + редирект `/lk/login`.
- `src/api/lkMock.ts` — мок-данные и mock-обработчики (флаг `USE_MOCK = true`), чтобы UI работал без бэка.
- `src/types/lk.ts` — типы и константы `STATUS_LABELS`, `STATUS_COLORS` (как в ТЗ).

**Layout и общие компоненты ЛК (`src/components/lk/`)**

- `LKLayout.tsx` — сайдбар 240px, фон `hsl(214 84% 20%)`, логотип, навигация по роли, кнопка «Выйти», mobile drawer (shadcn Sheet), гард: нет токена → `Navigate /lk/login`.
- `StatusBadge.tsx` — цветной пилл по `STATUS_COLORS/LABELS`.
- `DocumentsPanel.tsx` — список карточек документов + Dialog загрузки (file input, Select doc_type, Switch видимости/редактируемости для менеджера), multipart POST.
- `ChatPanel.tsx` — пузыри менеджер слева / клиент справа, имя+время, `useQuery` с `refetchInterval: 8000`, фиксированный ввод снизу.
- `CreateClientModal.tsx`, `CreateShipmentModal.tsx` — Dialog + React Hook Form + Zod.

**Страницы (`src/pages/lk/`)**

- `LKLoginPage.tsx` — full-screen navy-gradient, центр-карточка, логотип `@/assets/logo.png`, email+password, toast ошибки, редирект по роли (manager → `/lk/dashboard`, client → `/lk/shipments`).
- `LKDashboardPage.tsx` — 3 stat Cards + таблица клиентов (клик → детальная).
- `LKClientsPage.tsx` — поиск + кнопка «Создать клиента» → модалка → после создания Dialog с логином/паролем и кнопками копирования.
- `LKClientDetailPage.tsx` — карточка клиента + его поставки.
- `LKShipmentsPage.tsx` — менеджер: фильтры статус+клиент; клиент: только свои, без фильтров. `StatusBadge` в строках.
- `LKShipmentDetailPage.tsx` — 2 колонки (desktop): слева Tabs «Документы/Чат», справа карточка инфы. Менеджер — `Select` статуса; клиент — read-only `StatusBadge`.
- `LKMessagesPage.tsx` — список поставок с непрочитанными, клик → `/lk/shipments/:id`.

### 3. Изменения в существующих файлах

- `src/App.tsx` — перестройка `Routes` под схему выше; обернуть в `AuthProvider`. Все существующие публичные роуты сохраняются как есть.
- `src/components/Header.tsx` — добавить кнопку «Личный кабинет» (`<Link to="/lk/login">` с иконкой `User` из lucide) в desktop-навигацию и в mobile-меню. Никакая другая логика шапки не меняется.

### 4. Технические детали

- Только существующие shadcn/ui-компоненты: Button, Input, Card, Dialog, Sheet, Select, Tabs, Switch, Badge, Table, Label, Separator, ScrollArea, Skeleton, Alert, Form.
- TanStack Query (`QueryClient` уже создан в App.tsx) для всех запросов; форма — React Hook Form + Zod.
- Состояния: загрузка — `Skeleton`, ошибка — `Alert variant="destructive"`, успех — `sonner toast`.
- Цвета — только семантические токены (`bg-primary`, `text-primary-foreground`, `bg-accent` …). Никаких hex/`text-white` напрямую — для тёмных пузырей чата использовать `bg-primary text-primary-foreground`.
- Весь текст — русский. Языковой переключатель в ЛК не используется.
- Токен только в памяти `AuthContext` (refresh страницы — повторный логин; это явное требование).

### 5. Зависимость

Нужно добавить `axios` (в проекте его сейчас нет). Альтернатива — обёртка над `fetch`; если хотите без новой зависимости, скажите, и сделаю `lkClient` на `fetch`.

### 6. Порядок реализации

1. `types/lk.ts` → `AuthContext` → `lkClient` + `lkMock`
2. `LKLayout` + гард → `LKLoginPage` → подключить роуты в `App.tsx` → кнопка в `Header`
3. `LKShipmentsPage` → `LKShipmentDetailPage` (+ `StatusBadge`, `DocumentsPanel`, `ChatPanel`)
4. `LKClientsPage` (+ `CreateClientModal`) → `LKClientDetailPage` → `LKDashboardPage` → `LKMessagesPage`

### Что НЕ делается

- Бэкенд/Edge-функции не пишутся (фронт работает на моках через `USE_MOCK = true`); реальный `/api` подключается заменой флага.
- Никаких изменений в публичных страницах, SEO, prerender-скрипте, переводах, формах сайта.

### Уточняющие вопросы (не блокирующие, можно ответить «делай как удобно»)

1. Добавлять `axios` или сделать `lkClient` на `fetch`? Делай как удобно.
2. Кнопка «Личный кабинет» в шапке — для всех языков (RU/EN одинаково «Личный кабинет / Client area»)? Делай как удобно.