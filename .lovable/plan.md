## Добавление удаления вложений в заявках на сертификацию

### 1. `src/api/lkClient.ts`
Добавить метод `deleteCertFile`:
```ts
deleteCertFile: (requestId: number, itemId: number, fileId: number) =>
  request<{ ok: boolean }>(
    'DELETE',
    `/cert-requests/${requestId}/items/${itemId}/files/${fileId}`
  ),
```
(Метод уже присутствует в файле — проверю и при необходимости приведу к нужной сигнатуре.)

### 2. `src/types/lk.ts`
В `CertFile` добавить опциональное поле `filename_original?: string` (сохраняя обратную совместимость с `filename`).

### 3. `src/components/lk/CertFilesPanel.tsx`
- Импортировать `Trash2` из `lucide-react`.
- Добавить мутацию `deleteFile` через `useMutation`, вызывающую `lkApi.deleteCertFile(requestId, itemId, fileId)`, с инвалидацией `['lk','cert-item-files', requestId, itemId]` и toast.
- В строке каждого вложения (и для `file`, и для `link`) добавить кнопку с иконкой `Trash2` (variant `ghost`, destructive-цвет) рядом с существующей кнопкой «Скачать»/«Открыть».
- Показ подтверждения через `window.confirm('Удалить вложение?')` перед вызовом.
- Кнопки видны обеим ролям — проверка прав на бэкенде.

### 4. Проверка
- Билд-чек.
- Ручная проверка: удаление файла и ссылки в позиции; список обновляется, тост об успехе; при ошибке — тост об ошибке.

Ничего другого не трогаем.
