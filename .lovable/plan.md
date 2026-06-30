## Удаление поставки в ЛК (только для менеджера)

### 1. `src/api/lkClient.ts`
Добавить метод:
```ts
deleteShipment: (id: number) =>
  request<{ ok: boolean }>('DELETE', `/shipments/${id}`),
```

### 2. `src/pages/lk/LKShipmentsPage.tsx`
- Добавить колонку действий (только для `isManager`) с иконкой `Trash2` из `lucide-react`.
- Кнопка-иконка в ячейке с `onClick={(e) => { e.stopPropagation(); setDeleteId(s.id); }}` — чтобы клик не триггерил переход на детальную страницу.
- Локальный стейт `deleteId: number | null`.
- `AlertDialog` (shadcn) с заголовком «Удалить поставку?», описанием «Действие необратимо. Все документы и сообщения будут удалены.» и кнопками «Отмена» / «Удалить».
- `useMutation` на `lkApi.deleteShipment(deleteId)`:
  - `onSuccess`: `toast.success('Поставка удалена')`, `qc.invalidateQueries(['lk','shipments'])`, закрыть диалог.
  - `onError`: разобрать сообщение (401/403/404/прочее) и показать `toast.error` с понятным текстом:
    - 401 → «Сессия истекла» (logout уже сработает в `request`)
    - 403 → «Недостаточно прав для удаления»
    - 404 → «Поставка не найдена»
    - иначе → текст ошибки
  - Список не трогаем при ошибке (invalidate не вызываем).

### 3. `src/pages/lk/LKShipmentDetailPage.tsx` (бонус, опционально)
Не трогаем в этой задаче — пользователь просил только список. *Пропустить.*

### Технические детали
- Используем существующий `AlertDialog` из `@/components/ui/alert-dialog`.
- Чтобы парсить статус ошибки, расширим `request` минимально: при `!res.ok` бросать `Error` с сообщением вида `HTTP {status}` (уже так). В `onError` mutation проверять `error.message.includes('404')` и т.д.
- Кнопки клиента не получают иконку удаления — рендер условный через `isManager`.

### Файлы
- `src/api/lkClient.ts` — +1 метод
- `src/pages/lk/LKShipmentsPage.tsx` — колонка действий, AlertDialog, mutation
