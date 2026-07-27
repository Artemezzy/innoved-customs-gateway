
# Роль "Сертификационный центр" + раздел "Заявки на сертификацию" (v3, синхронизировано с PHP backend)

Работаю только по фронтенду. Дизайн 1:1 с "Клиенты"/"Поставки".

## 1. Типы и роль

`src/types/lk.ts`:
- `Role = 'manager' | 'client' | 'cert_center'`.
- `LKUser` +`certCenterId: number | null`.
- `CertCenter { id, name, contact_person, phone, email, requests_count, created_at }`.
- `CertRequestStatus = 'open' | 'in_progress' | 'closed'` + `STATUS_LABELS_CERT` / `STATUS_COLORS_CERT`.
- `CertRequest { id, number, company, cert_center_id, cert_center_name, status, created_at, updated_at, has_unread_messages, has_unread_changes }`.
- `CertRequestDetails` — 10 полей: `company, product, tn_ved, tech_description, tr_ts, cert_form, cert_scheme, cost, comment` + `files: CertFile[]` + `status`.
- `CertFile { id, file_type: 'file' | 'link', url, filename?: string, created_at }`.

## 2. API-клиент

`src/api/lkClient.ts` — добавить в `lkApi`:

Центры:
- `certCenters(q?)` → `GET /api/cert-centers`.
- `createCertCenter(data)` → `POST /api/cert-centers` → `{ center, credentials }`.
- `resetCertCenterPassword(id)` → `POST /api/cert-centers/:id/reset-password`.
- Детальную страницу центра берём из кэша списка (`GET /api/cert-centers/:id` в контракте нет).

Заявки:
- `certRequests({ status?, cert_center_id? })` → `GET /api/cert-requests` (уже с `has_unread_messages` / `has_unread_changes`, см. п.6).
- `createCertRequest({ company, cert_center_id })` → `POST /api/cert-requests` (только менеджер).
- `certRequest(id)` → `GET /api/cert-requests/:id`. **Backend возвращает вложенную структуру** `{ request, fields, files }`; в клиенте делаем маппинг:
  ```ts
  async function certRequest(id: number): Promise<CertRequestDetails> {
    const res = await request<{ request: any; fields: any; files: CertFile[] }>(
      'GET', `/cert-requests/${id}`
    );
    return { ...res.fields, status: res.request.status, files: res.files };
  }
  ```
  Сам факт GET снимает флаг непрочитанного на backend — после успеха инвалидируем `['lk','cert-requests']`.
- `updateCertRequestStatus(id, status)` → `PUT /api/cert-requests/:id` с `{ status }`.
- `updateCertRequestFields(id, fields)` → `PUT /api/cert-requests/:id/fields` (все 10 полей одним запросом).
- `deleteCertRequest(id)` → `DELETE /api/cert-requests/:id` (только менеджер).

Файлы/ссылки — единый ресурс `files`:
- Список — из `certRequest(id).files`, отдельного GET не заводим.
- `uploadCertFile(id, FormData)` → `POST /api/cert-requests/:id/files` (multipart, поле `file`).
- `addCertFileUrl(id, url)` → **тоже FormData с полем `url`**, а не JSON (backend читает `$_POST['url']`):
  ```ts
  addCertFileUrl: (id, url) => {
    const fd = new FormData();
    fd.append('url', url);
    return request('POST', `/cert-requests/${id}/files`, fd, true);
  }
  ```
- `downloadCertFileUrl(id, fileId)` → `GET /api/cert-requests/:id/files/:fileId/download` через `fetch` с `Authorization: Bearer` в blob + `URL.createObjectURL` + `<a download>`.
- **Удаление файлов в MVP не делаем**: кнопки удаления нет. Требуется новый backend endpoint `DELETE /api/cert-requests/:id/files/:fileId` — тогда добавим `deleteCertFile`.

Чат:
- `certMessages(id, since?)` → `GET /api/cert-requests/:id/messages`.
- `sendCertMessage(id, text)` → `POST /api/cert-requests/:id/messages`.

Моки в `lkMock` — добавить соответствующие функции для прогона UI без backend.

## 3. Навигация и роутинг

`LKLayout.tsx`:
- `manager` — добавить "Сертификационные центры" (`/lk/cert-centers`) и "Заявки на сертификацию" (`/lk/cert-requests`).
- `cert_center` — только "Мои заявки" (`/lk/cert-requests`), подпись роли "Сертификационный центр".

`App.tsx` — новые роуты:
- `/lk/cert-centers` → `LKCertCentersPage`
- `/lk/cert-centers/:id` → `LKCertCenterDetailPage`
- `/lk/cert-requests` → `LKCertRequestsPage`
- `/lk/cert-requests/:id` → `LKCertRequestDetailPage`

`LKLoginPage` — редирект по роли: `manager` → `/lk/dashboard`, `client` → `/lk/shipments`, `cert_center` → `/lk/cert-requests`.

## 4. Страницы

### `LKCertCentersPage` (менеджер)
Клон `LKClientsPage`: поиск, таблица (Название, Контакт, Телефон, Email, **Заявок** = `requests_count`), кнопка "Создать центр" → `CreateCertCenterModal` (клон `CreateClientModal`: название, контактное лицо, телефон, email; после создания — модалка с логином/паролем и копированием). Клик по строке → `/lk/cert-centers/:id`.

### `LKCertCenterDetailPage` (менеджер)
Данные центра — из кэша `['lk','cert-centers']` (find by id); если нет — редирект на список. Карточка с реквизитами и кнопка "Сбросить пароль" (модалка с новыми учётками).

### `LKCertRequestsPage` (менеджер + центр)
- Менеджер: фильтры по статусу и по центру, кнопка "Новая заявка" → `CreateCertRequestModal` (компания + селект центра).
- Центр: только свои, без фильтра по центру, без кнопки создания.
- Таблица: №, Компания, Дата создания, Сертцентр, Статус (`Badge` со `STATUS_COLORS_CERT`), индикаторы `UnreadDots` (см. п.6).
- Кнопка "Корзина" — только менеджер, `AlertDialog`, `deleteCertRequest`, обработка 401/403/404 как в `LKShipmentsPage`.
- Клик по строке → детальная страница.

### `LKCertRequestDetailPage` (обе роли)
- Форма (react-hook-form + zod) на 10 полей: `company, product, tn_ved, tech_description (Textarea), tr_ts, cert_form, cert_scheme, cost, comment (Textarea)`. Кнопка "Сохранить изменения" → `updateCertRequestFields`, toast + инвалидация.
- Селект статуса (Открыто / В работе / Закрыто) — обе роли, `updateCertRequestStatus` (`PUT /:id` с `{status}`), оптимистичный апдейт.
- `CertFilesPanel`: список `files` (иконка file/link, имя/URL, кнопка "Скачать" для `file_type='file'`, для `link` — внешняя ссылка). Ниже — "Загрузить файл" (multipart) и "Добавить ссылку" (FormData `url`). Кнопки удаления нет в MVP.
- `CertChatPanel` — клон `ChatPanel`, но по `cert-requests/:id/messages`.
- При монтировании страницы вызываем `certRequest(id)` — backend автоматически обновит `manager_seen_at`/`center_seen_at`. После успеха инвалидируем `['lk','cert-requests']`.

## 5. Новые компоненты в `src/components/lk/`

- `CreateCertCenterModal.tsx`, `CreateCertRequestModal.tsx`
- `CertRequestStatusSelect.tsx`
- `CertFilesPanel.tsx`
- `CertChatPanel.tsx`
- `UnreadDots.tsx` (см. п.6)

Существующее `StatusBadge` расширяем или добавляем `CertStatusBadge`.

## 6. Индикаторы непрочитанного — **Вариант Б (два отдельных флага)**

Фронт делает две точки:
- Синяя (`bg-primary`) — `has_unread_messages`, tooltip "Новые сообщения".
- Оранжевая (`bg-orange-500`) — `has_unread_changes`, tooltip "Изменения в заявке".

**Требуется доработка PHP backend** в `GET /api/cert-requests`:
- `has_unread_messages` = существуют записи в `lk_cert_messages` с `is_read=0` и `role` противоположной текущему пользователю стороны.
- `has_unread_changes` = `cert_requests.updated_at` новее, чем `manager_seen_at`/`center_seen_at` (текущая логика единого `has_unread`).

Поле `has_unread` в текущем виде убирается / заменяется двумя. Фронт сразу пишется под новые поля; до доработки backend оба флага будут `false` — UI работает без ошибок, точки просто не показываются.

## 7. Что НЕ делаем

- Нет `PUT /:id/status`, `PUT /:id/read`, `GET /:id/attachments`, `POST /:id/attachments/url`, `DELETE /:id/files/:fileId`, `GET /cert-centers/:id`.
- Удаление файлов в MVP не реализуем (нужен backend `DELETE /files/:fileId`).
- Существующие роуты клиентов/поставок не трогаем; `AuthContext` только расширяется `certCenterId` из ответа `/auth/login`.

## Технические детали

React Query, react-hook-form + zod, shadcn/ui. Пуллинг чата — `refetchInterval: 8000`. 401 автологаут уже в `request()`. Скачивание файлов — blob через `fetch` с Bearer + `<a download>`. Все загрузки на `/files` идут через FormData (и файлы, и ссылки) — единый путь.
