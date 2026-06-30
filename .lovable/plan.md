## Изменения в ЛК

### 1. Чекбокс видимости документа → 1/0
Файл: `src/components/lk/DocumentsPanel.tsx`

В мутации `upload` поля `visible_to_client` и `editable_by_client` сейчас отправляются как строки `"true"`/`"false"`. Заменю на `"1"`/`"0"`:

```ts
fd.append('visible_to_client', visible ? '1' : '0');
fd.append('editable_by_client', editable ? '1' : '0');
```

### 2. Кликабельная вся строка поставки
Файл: `src/pages/lk/LKShipmentsPage.tsx`

Сейчас `<Link>` обёрнут только вокруг `#{id}` в первой ячейке. Сделаю кликабельной всю строку:

- На `<TableRow>` добавлю `onClick={() => navigate(\`/lk/shipments/${s.id}\`)}` и классы `cursor-pointer hover:bg-muted/50`.
- В первой ячейке оставлю отображение `#{id}` уже без `<Link>` (чтобы не было вложенной навигации), сохранив стиль ссылки через `text-primary`.
- Импортирую `useNavigate` из `react-router-dom`.

Логика API и фильтров не меняется.
