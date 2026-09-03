# PROJECT_CONTEXT — ЛК ИННОВЭД

> **Назначение документа:** постоянный технический контекст для разработки личного кабинета ИННОВЭД. Перед реализацией любой фичи нужно сверяться с этим документом, а затем — с актуальными файлами ветки `main`.
>
> **Главное правило:** этот документ описывает архитектуру и инварианты, но не заменяет исходный код. GitHub-репозиторий и актуальная ветка `main` — единственный источник истины для конкретной реализации.

---

## 1. Репозиторий и стек

| Область | Значение |
|---|---|
| Репозиторий | `Artemezzy/innoved-customs-gateway` |
| Основная ветка | `main` |
| Frontend | React + TypeScript + Vite/Lovable |
| UI | shadcn/ui, Tailwind CSS, lucide-react |
| Данные на frontend | TanStack React Query |
| Уведомления в UI | sonner |
| Backend | PHP 8.x + MySQL/PDO |
| Основной API-router | `backend/public_html/api/index.php` |
| Фоновые email-уведомления | `backend/public_html/api/cron/send-notifications.php` |
| Провайдер отправки email | Resend API |
| Публичный URL ЛК | `https://www.innovedbroker.ru/lk` |
| API URL | `https://www.innovedbroker.ru/api` |
| БД | MySQL 8.0, схема `u3230321_v1_innoved`, движок InnoDB, charset `utf8mb4` |

### Ключевые каталоги

```text
src/
  api/lkClient.ts                    # Клиент API для личного кабинета
  contexts/AuthContext.tsx           # JWT, текущий пользователь, logout
  contexts/LKLanguageContext.tsx     # Язык ЛК
  lib/lkTranslations.ts              # Переводы ЛК
  types/lk.ts                        # Типы доменных сущностей
  pages/lk/                          # Страницы личного кабинета
  components/lk/                     # Компоненты личного кабинета

backend/public_html/api/
  index.php                           # API-router: auth, CRUD, права, файлы
  cron/send-notifications.php         # Рассылка очереди уведомлений
  sql/                                # SQL-миграции и схема
```

---

## 2. Роли и доступы

В системе используются ровно три роли:

| Роль | Код роли | Назначение |
|---|---|---|
| Менеджер | `manager` | Управляет клиентами, поставками, серт-центрами, заявками и статусами |
| Клиент | `client` | Видит и ведёт только собственные поставки |
| Сертификационный центр | `cert_center` | Ведёт назначенные ему заявки на сертификацию |

### Инварианты прав

- Клиент имеет доступ **только** к поставкам, для которых `lk_shipments.client_id` совпадает с `lk_users.client_id` из JWT.
- Серт-центр имеет доступ **только** к заявкам, для которых `lk_cert_requests.cert_center_id` совпадает с `lk_users.cert_center_id` из JWT.
- Менеджер имеет доступ к управлению всеми сущностями.
- Проверки роли только во frontend не считаются защитой. Доступ обязательно проверяется на backend.
- Для поставок применять `shipment_guard($me, $sid)`: функция проверяет наличие поставки, владение клиента и допустимые роли `manager`/`client`.
- Для сертификационных заявок применять `cert_request_guard($me, $rid)`: функция проверяет наличие заявки, принадлежность серт-центру и допустимые роли `manager`/`cert_center`.

### Навигация ЛК

| Роль | Основные разделы |
|---|---|
| `manager` | Dashboard, Клиенты, Поставки, Сообщения, Сертификационные центры, Заявки на сертификацию, Уведомления |
| `client` | Поставки, Сообщения, Уведомления |
| `cert_center` | Заявки на сертификацию, Уведомления |

Файл навигации: `src/components/lk/LKLayout.tsx`.

---

## 3. Доменные сущности

### Поставки

Основные таблицы:

| Таблица | Назначение |
|---|---|
| `lk_shipments` | Карточка поставки |
| `lk_shipment_items` | Товарные позиции поставки |
| `lk_shipment_item_files` | Файлы и ссылки, привязанные к конкретной товарной позиции |
| `lk_documents` | Документы поставки |
| `lk_messages` | Чат менеджера и клиента по поставке |
| `lk_shipment_cert_requests` | Связь поставки с созданными заявками на сертификацию (many-to-many, уникальна пара `shipment_id`+`cert_request_id`) |

Ключевые поля поставки (`lk_shipments`):

```text
id, document_number, client_id, title,
applicant_org, applicant_address, applicant_head,
applicant_position, applicant_email,
manufacturer_org, manufacturer_address, manufacturer_country,
status, created_at, updated_at
```

Статусы поставки (подтверждено дампом БД, `ENUM` в `lk_shipments.status`):

```text
new
documents_requested
documents_received
declaration_filed
customs_inspection
released
on_hold
```

> Ранее в этом документе статус ошибочно был указан как `notifications_requested`. Актуальное значение — `documents_requested`.

> В коде API и frontend обязательно использовать фактические значения из `src/types/lk.ts` и `index.php`. Перед добавлением нового статуса проверить оба слоя.

### Заявки на сертификацию

Основные таблицы:

| Таблица | Назначение |
|---|---|
| `lk_cert_requests` | Карточка заявки на сертификацию |
| `lk_cert_request_items` | Товарные позиции заявки |
| `lk_cert_request_files` | Файлы и ссылки товарных позиций заявки (привязаны к `item_id`) |
| `lk_cert_messages` | Чат менеджера и серт-центра по заявке |
| `lk_cert_request_fields_old_backup` | Legacy-таблица старых плоских полей заявки (company/product/tn_ved и т.д.), сохранена как backup, в текущей логике не используется — актуальные поля живут в `lk_cert_request_items` |

Ключевые поля заявки (`lk_cert_requests`):

```text
id, document_number, cert_center_id, status,
created_by, created_at, updated_at, updated_by_role,
applicant_org, applicant_address, applicant_head,
applicant_position, applicant_email,
manufacturer_org, manufacturer_address, manufacturer_country,
manager_seen_at, center_seen_at
```

Статусы заявки (подтверждено дампом БД):

```text
open
estimation
documents_pending
layout_approved
payment
certificate_issued
rejected
closed
```

Ключевые поля товарной позиции заявки (`lk_cert_request_items`):

```text
id, request_id, source_shipment_item_id, position_no, is_checked,
company, product, tn_ved, contract_invoice, quantity,
tech_description, model_article, trademark,
tr_ts, cert_form, cert_scheme, cost,
production_deadline, samples_required, samples_city,
comment, created_at, updated_at
```

`source_shipment_item_id` хранит ссылку на исходную товарную позицию поставки (`lk_shipment_items.id`), из которой была сформирована позиция заявки при генерации сертификационной заявки менеджером.

### Клиенты и серт-центры

| Сущность | Основная таблица | Связь с пользователем |
|---|---|---|
| Клиент | `lk_clients` | `lk_users.client_id`, роль `client` |
| Серт-центр | `lk_cert_centers` | `lk_users.cert_center_id`, роль `cert_center` |
| Менеджер | `lk_users` | роль `manager` |

Удаление клиентов и серт-центров реализовано как архивирование через `is_active=0` вместе с деактивацией соответствующего пользователя. Данные поставок, заявок, файлов и переписки сохраняются.

### Организационные профили (шаблоны реквизитов)

Таблица `lk_organization_profiles` хранит сохранённые шаблоны реквизитов заявителя/изготовителя клиента для быстрого повторного заполнения:

```text
id, client_id, profile_type ('applicant'|'manufacturer'),
name, address, head, position, email, country,
created_by_user_id, created_at, updated_at
```

### Нумерация документов

Таблица `lk_document_sequence` — сквозной счётчик для генерации номеров документов (`document_number`) отдельно по типу сущности:

```text
id, entity_type ('shipment'|'cert_request'), entity_id, created_at
```

---

## 4. Важные компоненты frontend

| Компонент/страница | Ответственность |
|---|---|
| `LKShipmentDetailPage.tsx` | Детальная страница поставки; основной контент и чат |
| `ShipmentItemsPanel.tsx` | Единая форма поставки: Заявитель/Импортёр, Изготовитель, Продукция |
| `ShipmentFilesPanel.tsx` | Вложения конкретной товарной позиции поставки |
| `DocumentsPanel.tsx` | Документы поставки |
| `ChatPanel.tsx` | Чат менеджера и клиента по поставке |
| `LKCertRequestDetailPage.tsx` | Детальная страница заявки на сертификацию |
| `CertItemsPanel.tsx` | Товары и реквизиты заявки на сертификацию |
| `CertFilesPanel.tsx` | Вложения конкретной позиции заявки |
| `CertChatPanel.tsx` | Чат менеджера и серт-центра |
| `LKClientsPage.tsx` | Список клиентов и архив |
| `LKCertCentersPage.tsx` | Список серт-центров и архив |
| `NotificationSettingsCard.tsx` | Настройки email-уведомлений текущего пользователя |
| `LKNotificationsPage.tsx` | Страница настроек уведомлений |
| `LKLayout.tsx` | Навигация, отображаемая в зависимости от роли |

### Важное правило формы поставки

Разделы **«Заявитель (импортёр)»**, **«Изготовитель»** и **«Продукция»** уже находятся внутри `ShipmentItemsPanel.tsx`. Нельзя создавать отдельный компонент формы для этих же полей, не проверив существующий `ShipmentItemsPanel.tsx`.

### Связь поставки и заявки на сертификацию в списках

В таблице поставок (`LKShipmentsPage.tsx`) выводится колонка со всеми связанными заявками на сертификацию (`shipment.linked_cert_requests_brief`), в таблице заявок (`LKCertRequestsPage.tsx`) — колонка со связанной поставкой (`certRequest.linked_shipment`). Оба поля вычисляются на backend через таблицу `lk_shipment_cert_requests` и не хранятся как отдельные колонки в `lk_shipments`/`lk_cert_requests`.

---

## 5. API и права

Клиент API: `src/api/lkClient.ts`.

### Авторизация

| Метод | Endpoint | Назначение |
|---|---|---|
| `POST` | `/auth/login` | Вход, выдача JWT |

JWT содержит как минимум:

```text
sub, role, name, client_id, cert_center_id, exp
```

### Поставки

| Метод | Endpoint | Кто использует |
|---|---|---|
| `GET` | `/shipments` | Менеджер и клиент; клиент видит только свои |
| `POST` | `/shipments` | Менеджер или клиент |
| `GET` | `/shipments/{id}` | Менеджер или владелец-клиент |
| `PUT` | `/shipments/{id}` | Изменение статуса; проверять роль согласно UI-политике |
| `PUT` | `/shipments/{id}/info` | Менеджер и владелец-клиент; обязательно `auth()` + `shipment_guard()` |
| `GET` | `/shipments/{id}/items` | Менеджер и владелец-клиент |
| `POST` | `/shipments/{id}/items` | Менеджер и владелец-клиент; обязательно `auth()` + `shipment_guard()` |
| `PUT` | `/shipments/{id}/items/{itemId}` | Менеджер и владелец-клиент; обязательно `auth()` + `shipment_guard()` |
| `DELETE` | `/shipments/{id}/items/{itemId}` | Менеджер и владелец-клиент; нельзя удалить последнюю позицию |
| `POST` | `/shipments/{id}/items/{itemId}/files` | Менеджер и владелец-клиент |
| `DELETE` | `/shipments/{id}/items/{itemId}/files/{fileId}` | Менеджер и владелец-клиент |
| `POST` | `/shipments/{id}/documents` | Менеджер и владелец-клиент |
| `GET/POST` | `/shipments/{id}/messages` | Менеджер и владелец-клиент |
| `POST` | `/shipments/{id}/generate-cert-request` | Менеджер |

### Сертификационные заявки

| Метод | Endpoint | Кто использует |
|---|---|---|
| `GET` | `/cert-requests` | Менеджер и серт-центр |
| `POST` | `/cert-requests` | Менеджер |
| `GET/PUT` | `/cert-requests/{id}` | Менеджер и назначенный серт-центр |
| `GET/POST` | `/cert-requests/{id}/items` | Менеджер и назначенный серт-центр |
| `PUT/DELETE` | `/cert-requests/{id}/items/{itemId}` | Менеджер и назначенный серт-центр |
| `GET/POST` | `/cert-requests/{id}/items/{itemId}/files` | Менеджер и назначенный серт-центр |
| `GET/POST` | `/cert-requests/{id}/messages` | Менеджер и назначенный серт-центр |

### Настройки уведомлений

| Метод | Endpoint | Назначение |
|---|---|---|
| `GET` | `/me/notifications` | Email-адреса и переключатель для текущего пользователя |
| `PUT` | `/me/notifications` | Сохранение настроек текущего пользователя |

Настройки привязаны к пользователю из JWT (`/me`), а не к сущности клиента или серт-центра напрямую.

---

## 6. Уведомления по email

### Архитектура

```text
Действие в API
  → queue_notification(...)
  → lk_notification_queue (status='pending')
  → cron/send-notifications.php
  → Resend API
  → email получателю
```

Очередь агрегирует несколько событий одной сущности и одного получателя, пока запись имеет `status='pending'`. Cron забирает записи, у которых `last_event_at` старше 60 секунд, затем меняет статус на `sent` или `failed`.

### Таблицы уведомлений

| Таблица | Назначение |
|---|---|
| `lk_notification_queue` | Очередь событий email-уведомлений: `entity_type`, `entity_id`, `recipient_role`, `event_summary`, `events_count`, `first_event_at`, `last_event_at`, `status`, `sent_at` |
| `lk_notification_emails` | Дополнительные email-адреса пользователя (`user_id`+`email`, уникальная пара) |
| `lk_users.notifications_enabled` | Индивидуальный переключатель рассылки |

### Типы сущностей очереди

Актуальный `ENUM` в `lk_notification_queue.entity_type` (подтверждено дампом БД):

```text
cert_request
shipment
```

Миграция на `shipment` уже применена в БД — при добавлении нового `entity_type` требуется новая SQL-миграция.

### Правило адресации поставок

| Кто совершил действие с поставкой | `recipient_role` | Получатель |
|---|---|---|
| Клиент | `manager` | Все активные менеджеры с включёнными уведомлениями |
| Менеджер | `client` | Активный пользователь-клиент данной поставки с включёнными уведомлениями |

Для поставки cron определяет клиента через `lk_shipments.client_id`, затем ищет пользователя: `role='client' AND client_id=?`.

### Правило адресации заявок на сертификацию

| Кто совершил действие | `recipient_role` | Получатель |
|---|---|---|
| Менеджер | `cert_center` | Пользователь назначенного серт-центра |
| Серт-центр | `manager` | Все активные менеджеры |

### Обязательная проверка при новой фиче

Если фича меняет данные поставки или заявки, проверить всю цепочку:

```text
UI → lkClient.ts → index.php endpoint → role/ownership guard → queue_notification → cron → recipient selection
```

Нельзя считать email-уведомление реализованным, если добавлен только вызов `queue_notification()` и cron не умеет обработать соответствующий `entity_type`/получателя.

---

## 7. Файлы и исходные имена

### Хранение

Файлы загружаются на локальное файловое хранилище сервера под `UPLOAD_PATH`, включая каталоги вида:

```text
uploads/cert/{requestId}/
uploads/shipment-items/{shipmentId}/
uploads/chat/cert-requests/{requestId}/
uploads/chat/shipments/{shipmentId}/
```

Сервер генерирует техническое имя для хранения (`filename_stored`), но исходное пользовательское имя обязательно сохраняется в `filename_original`.

В БД аналогичный паттерн `filename_original`/`filename_stored` используется в таблицах: `lk_documents`, `lk_cert_request_files`, `lk_shipment_item_files`, а также в чатах `lk_messages`/`lk_cert_messages` через пары `attachment_original`/`attachment_stored`.

### Правило отображения

Во frontend всегда показывать и передавать в скачивание:

```ts
file.filename_original || file.filename || fallback
```

Нельзя использовать только `file.filename`, если API возвращает `filename_original`. Иначе пользователь увидит искусственные подписи вида `Файл №28`, хотя исходное имя уже хранится в БД.

Панели, которые нужно проверять вместе:

```text
ShipmentFilesPanel.tsx
CertFilesPanel.tsx
lkClient.ts
index.php (GET/POST download/list endpoints)
types/lk.ts
```

---

## 8. Локализация

Личный кабинет поддерживает языки:

```text
ru
en
zh
```

Источник переводов: `src/lib/lkTranslations.ts`.

При добавлении интерфейсной строки:

1. Добавить ключ в `lkTranslations.ts` для всех трёх языков.
2. Использовать `useLKLanguage()` для получения текущего языка.
3. Использовать `lkT('key', language)` вместо захардкоженного текста.
4. Проверить кнопки, состояния загрузки, ошибки, пустые состояния, `aria-label` и диалоги.

Текст, который приходит из API/БД или является исходным именем файла, переводить не нужно.

---

## 9. Безопасный процесс изменений

### До реализации

1. Работать от актуальной ветки `main`.
2. Найти все связанные существующие компоненты — не создавать новый компонент, пока не проверено, что аналогичного уже нет.
3. Назвать затрагиваемые файлы и возможные последствия.
4. Проверить роли, API, типы, локализацию, очередь уведомлений и cron, если действие меняет данные пользователя.
5. Если содержимое большого файла было возвращено инструментом не полностью, не реконструировать его по памяти. Запросить актуальный файл либо дать минимальный diff для точно известного участка.

### Во время реализации

- Сначала менять backend-права и endpoint, затем API-клиент и frontend.
- Не ослаблять авторизацию без `shipment_guard()` или `cert_request_guard()`.
- Не добавлять уведомление в UI вместо серверной очереди — email отправляет только backend cron.
- Не менять схему БД без проверки фактической схемы (см. раздел 3 и Приложение А ниже, либо свежий экспорт из phpMyAdmin).
- При изменении сигнатуры общей функции, например `queue_notification()`, обновлять **все** существующие вызовы в `index.php`.

### После реализации

Проверять минимум следующие сценарии:

| Сценарий | Ожидаемый результат |
|---|---|
| Клиент открывает свою поставку | Доступ разрешён |
| Клиент обращается к чужой поставке | HTTP 403 |
| Клиент сохраняет реквизиты/позицию | Изменения сохраняются; уведомление ставится менеджеру |
| Менеджер изменяет поставку клиента | Изменения сохраняются; уведомление ставится клиенту |
| Серт-центр обновляет заявку | Уведомление ставится менеджеру |
| Менеджер обновляет заявку | Уведомление ставится серт-центру |
| Файл позиции загружается | Сохраняется `filename_original`; UI показывает исходное имя |
| Уведомления выключены у получателя | Email не отправляется; приложение не падает |
| Не найден получатель | Очередь корректно помечается обработанной согласно логике cron |

---

## 10. Правила для AI и разработчиков

При постановке задачи рекомендуется использовать шаблон:

```text
Работай от актуального main.

Задача: [ожидаемое поведение].

Ограничения:
- Не создавай компоненты, пока не проверишь существующие.
- Перед изменением перечисли затрагиваемые файлы и риски.
- Для действий пользователя проверь UI, lkClient.ts, index.php, права,
  types/lk.ts, lkTranslations.ts и уведомления/cron.
- Не реконструируй большие файлы по обрезанным сниппетам.
- Сначала предложи минимальный проверяемый план, затем дай точный патч.
```

### Обязательная маркировка ответа

В техническом ответе нужно явно разделять:

- **Подтверждено кодом** — прочитано в актуальном файле/репозитории.
- **Предположение** — требует проверки.
- **Изменение** — точный файл, endpoint, метод или SQL-миграция.
- **Проверка** — конкретные действия после деплоя.

---

## 11. История важных решений

### Чат на детальной странице поставки

Чат менеджера и клиента должен быть постоянной правой колонкой на desktop, аналогично чату в заявке на сертификацию. На мобильных он располагается ниже основного контента.

### Уведомления клиентов

У клиента должен быть пункт меню «Уведомления» с маршрутом `/lk/notifications`, использующий общую страницу `LKNotificationsPage` и API `/me/notifications`.

### Редактирование клиентом поставки

Клиент должен иметь возможность заполнять и редактировать собственную поставку в существующем `ShipmentItemsPanel.tsx`:

- реквизиты заявителя/импортёра;
- реквизиты изготовителя;
- товарные позиции;
- файлы и сообщения в рамках собственной поставки.

Менеджер сохраняет исключительное право формировать заявку на сертификацию из позиций поставки, если это отдельно не будет изменено бизнес-правилом.

### Сохранение имён файлов

Показывать пользователю исходное имя загруженного файла. Техническое имя хранения предназначено только для файловой системы и не должно быть видно в UI.

### Связка поставки и заявки на сертификацию в списках

В таблицах `/lk/shipments` и `/lk/cert-requests` добавлена видимость перекрёстной связи (заявки на поставке, поставка на заявке) через существующую таблицу `lk_shipment_cert_requests`, без создания новых сущностей или колонок в основных таблицах.

### Синхронизация PROJECT_CONTEXT.md со схемой БД (2026-09-03)

Документ сверен с полным SQL-дампом `localhost.sql` (`u3230321_v1_innoved`, MySQL 8.0). Исправлена опечатка в статусе поставки (`documents_requested` вместо `notifications_requested`), добавлено описание фактических полей `lk_cert_request_items`, `lk_organization_profiles`, `lk_document_sequence`, `lk_notification_queue`, `lk_notification_emails`, `lk_cert_request_fields_old_backup`. Полная схема — см. Приложение А.

---

## Приложение А. Полная схема БД (по дампу `localhost.sql`, 2026-09-03)

> Актуальность подтверждена SQL-дампом. При любом расхождении с фактическим `information_schema` на проде — приоритет у прода, документ обновить повторным экспортом.

### Таблицы и назначение

| Таблица | Назначение | Ключевые связи (FK) |
|---|---|---|
| `lk_users` | Пользователи всех трёх ролей | `client_id → lk_clients.id` (SET NULL), `cert_center_id → lk_cert_centers.id` (SET NULL) |
| `lk_clients` | Клиенты (заказчики) | — |
| `lk_cert_centers` | Сертификационные центры | — |
| `lk_shipments` | Поставки | `client_id → lk_clients.id` (CASCADE) |
| `lk_shipment_items` | Товарные позиции поставки | `shipment_id → lk_shipments.id` (индекс, без явного FK в дампе) |
| `lk_shipment_item_files` | Файлы/ссылки позиции поставки | индексы по `shipment_id`, `item_id` |
| `lk_documents` | Документы поставки | `shipment_id → lk_shipments.id` (CASCADE), `uploader_id → lk_users.id` (CASCADE) |
| `lk_messages` | Чат менеджер/клиент по поставке | `shipment_id → lk_shipments.id` (CASCADE), `user_id → lk_users.id` (CASCADE) |
| `lk_cert_requests` | Заявки на сертификацию | `cert_center_id → lk_cert_centers.id` |
| `lk_cert_request_items` | Товарные позиции заявки | `request_id → lk_cert_requests.id` (CASCADE) |
| `lk_cert_request_files` | Файлы/ссылки позиции заявки | `request_id → lk_cert_requests.id` (CASCADE) |
| `lk_cert_messages` | Чат менеджер/серт-центр по заявке | `request_id → lk_cert_requests.id` (CASCADE) |
| `lk_cert_request_fields_old_backup` | Legacy backup плоских полей заявки | `request_id → lk_cert_requests.id` (CASCADE) |
| `lk_shipment_cert_requests` | Связь поставка ↔ заявка (many-to-many) | `shipment_id`, `cert_request_id`; уникальная пара |
| `lk_organization_profiles` | Шаблоны реквизитов заявитель/изготовитель | `client_id → lk_clients.id` (CASCADE), `created_by_user_id → lk_users.id` (RESTRICT) |
| `lk_document_sequence` | Сквозная нумерация документов | — |
| `lk_notification_queue` | Очередь email-уведомлений | — |
| `lk_notification_emails` | Доп. email пользователя | уникальная пара `user_id`+`email` |

### Полные поля по таблицам

```sql
lk_users (
  id, email, password_hash, name, role ENUM('manager','client','cert_center'),
  client_id, cert_center_id, is_active, notifications_enabled,
  created_at, updated_at
)

lk_clients (
  id, name, inn, contact_person, phone, email, is_active, created_at
)

lk_cert_centers (
  id, name, contact_person, phone, email, is_active, created_at, updated_at
)

lk_shipments (
  id, document_number, client_id, title,
  applicant_org, applicant_address, applicant_head, applicant_position, applicant_email,
  manufacturer_org, manufacturer_address, manufacturer_country,
  status ENUM('new','documents_requested','documents_received','declaration_filed',
              'customs_inspection','released','on_hold'),
  created_at, updated_at
)

lk_shipment_items (
  id, shipment_id, position_no, product, tech_description, model_article, trademark,
  tn_ved, contract_invoice, quantity, price, tr_ts, cert_form, cert_price, comment,
  created_at, updated_at
)

lk_shipment_item_files (
  id, shipment_id, item_id, file_type ENUM('file','link'), url,
  filename_original, filename_stored, uploader_id, uploader_role, created_at
)

lk_documents (
  id, shipment_id, filename_original, filename_stored,
  doc_type ENUM('contract','invoice','packing_list','certificate','customs_declaration','other'),
  uploader_id, uploader_role ENUM('manager','client'),
  visible_to_client, editable_by_client, created_at
)

lk_messages (
  id, shipment_id, user_id, role ENUM('manager','client'), text,
  attachment_original, attachment_stored, attachment_size, reply_to_id, is_read, created_at
)

lk_cert_requests (
  id, document_number, cert_center_id,
  status ENUM('open','estimation','documents_pending','layout_approved','payment',
              'certificate_issued','rejected','closed'),
  created_by, created_at, updated_at, updated_by_role ENUM('manager','cert_center'),
  applicant_org, applicant_address, applicant_head, applicant_position, applicant_email,
  manufacturer_org, manufacturer_address, manufacturer_country,
  manager_seen_at, center_seen_at
)

lk_cert_request_items (
  id, request_id, source_shipment_item_id, position_no, is_checked,
  company, product, tn_ved, contract_invoice, quantity, tech_description,
  model_article, trademark, tr_ts, cert_form, cert_scheme, cost,
  production_deadline, samples_required, samples_city, comment,
  created_at, updated_at
)

lk_cert_request_files (
  id, request_id, item_id, file_type ENUM('file','link'),
  filename_original, filename_stored, url, uploader_id,
  uploader_role ENUM('manager','cert_center'), created_at
)

lk_cert_messages (
  id, request_id, user_id, role ENUM('manager','cert_center'), text,
  attachment_original, attachment_stored, attachment_size, reply_to_id, is_read, created_at
)

lk_cert_request_fields_old_backup (
  request_id, company, product, tn_ved, tech_description,
  tr_ts, cert_form, cert_scheme, cost, comment
)

lk_shipment_cert_requests (
  id, shipment_id, cert_request_id, created_at
  -- UNIQUE (shipment_id, cert_request_id)
)

lk_organization_profiles (
  id, client_id, profile_type ENUM('applicant','manufacturer'),
  name, address, head, position, email, country,
  created_by_user_id, created_at, updated_at
)

lk_document_sequence (
  id, entity_type ENUM('shipment','cert_request'), entity_id, created_at
)

lk_notification_queue (
  id, entity_type ENUM('cert_request','shipment'), entity_id,
  recipient_role ENUM('manager','cert_center'), event_summary, events_count,
  first_event_at, last_event_at, status ENUM('pending','sent','failed'), sent_at
)

lk_notification_emails (
  id, user_id, email, created_at
  -- UNIQUE (user_id, email)
)
```

### Замечания к схеме

- `lk_notification_queue.recipient_role` в текущей схеме — `ENUM('manager','cert_center')`, значения для роли `client` как получателя обрабатываются на уровне логики cron/PHP, а не через отдельное ENUM-значение в этой колонке — при работе с уведомлениями по поставкам проверить фактическую обработку в `index.php`/cron, а не только ENUM в БД.
- `lk_cert_request_fields_old_backup` не участвует в текущих запросах приложения (legacy), но физически хранится и связана `FOREIGN KEY ... ON DELETE CASCADE` с `lk_cert_requests` — удаление заявки удалит и эту backup-запись.
- В `lk_shipment_items` есть собственные поля `tr_ts`, `cert_form`, `cert_price`, которые дублируют по смыслу часть полей `lk_cert_request_items` (`tr_ts`, `cert_form`, `cost`) — это ожидаемо, так как данные копируются при генерации заявки из позиции поставки (`source_shipment_item_id`), а не хранятся как общая таблица.
- Явных `FOREIGN KEY` для `lk_shipment_items`, `lk_shipment_item_files`, `lk_cert_request_items` (кроме `request_id`), `lk_notification_queue`, `lk_notification_emails`, `lk_document_sequence`, `lk_shipment_cert_requests` в дампе нет — целостность обеспечивается только на уровне индексов и логики приложения (`shipment_guard`/`cert_request_guard`), а не через FK constraint.
