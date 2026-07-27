## Добавить экспорт заявки в CSV

### 1. `src/api/lkClient.ts`
Добавить в объект `lkApi` метод `exportCertRequest(requestId)` — по аналогии с `downloadCertFile`: fetch с `Authorization: Bearer <token>`, blob, программный клик по `<a download="cert-request-<id>.csv">`.

### 2. `src/pages/lk/LKCertRequestsPage.tsx`
- Импортировать `Download` из `lucide-react`.
- Добавить новую колонку действий (ghost icon-кнопка) в каждой строке таблицы — видна и менеджеру, и cert_center.
- В `onClick`: `e.stopPropagation()` + `lkApi.exportCertRequest(r.id)`.
- `title="Скачать в Excel"`, `aria-label`.
- Обновить `colSpan` пустого состояния (+1 колонка для всех ролей; у менеджера +1 к уже существующей колонке удаления).
- Обернуть вызов в try/catch с `toast.error` при ошибке.

### 3. `src/pages/lk/LKCertRequestDetailPage.tsx`
- Импортировать `Download`.
- В правой части верхнего блока (рядом со статусом) добавить `Button variant="outline" size="sm"` с иконкой и текстом «Скачать в Excel», `onClick={() => lkApi.exportCertRequest(requestId)}` с обработкой ошибки через toast.

### Что НЕ трогаем
Чат, статусы, позиции товаров, файлы, mock-слой (метод только для реального API — USE_MOCK=false).

### Проверка
- Build/тайпчек проходит.
- В списке иконка скачивания не открывает деталь заявки.
- На детальной странице кнопка отдаёт тот же CSV.
