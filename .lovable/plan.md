## Обновление создания поставки в ЛК

Адаптирую UI под новую логику бэкенда: менеджер выбирает клиента, клиент создаёт поставку только с названием.

### 1. `src/api/lkClient.ts`
Изменю сигнатуру `createShipment`, чтобы `client_id` был опциональным, и возвращаемый тип — `{ id: number }`:

```ts
createShipment: (data: { title: string; client_id?: number }) =>
  request<{ id: number }>('POST', '/shipments', data),
```

### 2. `src/components/lk/CreateShipmentModal.tsx`
- Получу роль из `useAuth()`.
- Для `client`: схема валидации только с `title`, форма без селекта клиента, в `mutationFn` отправляется `{ title }`.
- Для `manager`: оставляю текущую логику с `client_id` (или `fixedClientId`, если задан).
- В `onSuccess` показываю toast «Поставка создана» и инвалидирую `['lk', 'shipments']` (уже есть).

### 3. `src/pages/lk/LKShipmentsPage.tsx`
Сейчас кнопка «Новая поставка» отображается только для менеджера (`{isManager && ...}`). Покажу её и клиенту тоже, чтобы он мог создать поставку.

### Что НЕ меняется
- GET/PUT `/api/shipments` и связанные методы клиента.
- Логика фильтров, навигации и таблицы поставок.
- Mock-режим (`USE_MOCK = false`, не используется).
