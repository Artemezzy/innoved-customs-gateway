## Цель
Заменить одиночную форму "Данные заявки" на таблицу товарных позиций с построчным CRUD, синхронно с новым бэкенд-контрактом.

## 1. Типы (`src/types/lk.ts`)
- Удалить старый `CertRequestDetails extends CertRequestFields`.
- Оставить `CertRequestFields` только если используется где-то ещё; иначе удалить.
- Добавить:
  ```ts
  export interface CertRequestItem {
    id: number;
    position_no: number;
    company: string;
    product: string;
    tn_ved: string;
    tech_description: string;
    tr_ts: string;
    cert_form: string;
    cert_scheme: string;
    cost: string;
    comment: string;
  }
  export interface CertRequestDetails {
    request: CertRequest;
    items: CertRequestItem[];
    files: CertFile[];
  }
  ```

## 2. API-клиент (`src/api/lkClient.ts`)
- `certRequest(id)` теперь возвращает `{ request, items, files }` без плоского маппинга.
- Удалить `updateCertRequestFields` (маршрут PUT /fields больше не существует).
- Добавить методы:
  - `certRequestItems(id)` → GET `/cert-requests/:id/items`
  - `addCertRequestItem(id, data?)` → POST `/cert-requests/:id/items`
  - `updateCertRequestItem(id, itemId, data)` → PUT `/cert-requests/:id/items/:itemId`
  - `deleteCertRequestItem(id, itemId)` → DELETE `/cert-requests/:id/items/:itemId`
- В `lkMock.ts` — заглушки для новых методов (минимум для типовой сборки, реально не используются, USE_MOCK=false).

## 3. Страница `LKCertRequestDetailPage.tsx`
- Убрать `useForm`, массив `FIELDS`, `EMPTY`, мутацию `save`, кнопку "Сохранить изменения".
- В блоке "Данные заявки" рендерить новый компонент `CertItemsPanel` с `requestId` и `items` из `detail.data.items`.
- Хедер/статус/файлы/чат — без изменений; `detail.data.status` заменить на `detail.data.request.status`, `detail.data.files` остаётся.

## 4. Новый компонент `src/components/lk/CertItemsPanel.tsx`
- Props: `requestId: number; items: CertRequestItem[]`.
- Desktop (`md+`): таблица с колонками — № / Компания / Товар / ТН ВЭД / Тех. описание / ТР ТС / Форма / Схема / Стоимость / Комментарий / Действия. Каждое поле — `Input`/`Textarea` в контролируемом локальном стейте на строку.
- Mobile (`<md`): стек `Card`-ов, по одной позиции = одна карточка с теми же полями по вертикали. Реализация — CSS (`hidden md:table` / `md:hidden` grid of cards), без `useIsMobile`, чтобы избежать SSR-скачков.
- Автосохранение строки: `onBlur` любого поля → если значение изменилось от исходного — `updateCertRequestItem` (debounce не нужен, blur достаточно). Индикация: небольшой спиннер/точка "сохранение…" рядом с номером строки, toast только на ошибку.
- Кнопка "Сохранить строку" рядом с корзиной — форсированный PUT (на случай если пользователь хочет явно).
- Кнопка "+ Добавить товар" под таблицей/списком → `addCertRequestItem`, при успехе invalidate `['lk','cert-request',requestId]`.
- Кнопка удаления (иконка `Trash2`) с `AlertDialog` подтверждением. Скрыта/`disabled`, если `items.length <= 1`.
- Все мутации инвалидируют `['lk','cert-request',requestId]` и `['lk','cert-requests']`.

## 5. Внутренний под-компонент `CertItemRow` (в том же файле)
- Держит локальный стейт полей, инициализируемый из props; при изменении `item.id` — reset.
- Экспортирует общий рендер строки/карточки через флаг `variant: 'row' | 'card'`.

## Технические детали
- Не трогать: `CertFilesPanel`, `CertChatPanel`, `CertRequestStatusSelect`, роутинг, LKLayout.
- Проверить остальные использования удаляемого `updateCertRequestFields` и старой формы полей на верхнем уровне details — судя по коду, только `LKCertRequestDetailPage` и mock.
- После изменений — `tsgo` для проверки типов.

## Что НЕ меняется
Вложения, чат, статус, индикаторы непрочитанного, права доступа по ролям.
