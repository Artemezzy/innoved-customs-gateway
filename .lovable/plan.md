
## Goal
Align the UI with the new backend contract where files/links belong to a specific cert-request **item** (товарная позиция), not the whole request.

Current state:
- `lkClient.ts` — already migrated to the new per-item endpoints (`certItemFiles`, `uploadCertFile(requestId, itemId, ...)`, `addCertFileUrl(requestId, itemId, url)`, `downloadCertFile(requestId, itemId, fileId)`).
- `types/lk.ts` — `CertRequestDetails` still contains `files: CertFile[]` (stale).
- `LKCertRequestDetailPage.tsx` — still destructures `files` from `detail.data` and renders a global `CertFilesPanel`.
- `CertFilesPanel.tsx` — takes `{ requestId, files }` and uses request-level upload/download.
- `CertItemsPanel.tsx` — pure item CRUD, no files UI.

## Changes

### 1. `src/types/lk.ts`
- Remove `files` from `CertRequestDetails`:
  ```ts
  export interface CertRequestDetails {
    request: CertRequest;
    items: CertRequestItem[];
  }
  ```

### 2. `src/components/lk/CertFilesPanel.tsx`
- New props: `{ requestId: number; itemId: number }`.
- Drop the `files` prop; fetch files internally with `useQuery(['lk','cert-item-files', requestId, itemId], () => lkApi.certItemFiles(requestId, itemId))`.
- Mutations call `uploadCertFile(requestId, itemId, fd)` / `addCertFileUrl(requestId, itemId, url)`, invalidate the item-files query.
- Download uses `downloadCertFile(requestId, itemId, f.id, f.filename)`.
- Render loading / empty / list identically, keep the same visual layout, but scoped to one item.

### 3. `src/components/lk/CertItemsPanel.tsx`
- In each row/card, add a collapsible "Файлы и ссылки" section that mounts `<CertFilesPanel requestId={requestId} itemId={item.id} />`.
  - Desktop table: render a full-width sub-row under each item row (via a `<tr><td colSpan=...>` panel), togglable with a chevron button in the actions column. Default: collapsed.
  - Mobile card: a `Collapsible` / simple toggle button "Файлы (n)" that reveals the panel inside the card.
- No other logic changes; item CRUD stays intact.

### 4. `src/pages/lk/LKCertRequestDetailPage.tsx`
- Stop destructuring `files`; use `const { request, items } = detail.data`.
- Remove the standalone "Вложения" `Card` block (files now live per-item inside `CertItemsPanel`).
- Keep the "Данные заявки" and "Чат" cards.

### 5. Cleanup
- Remove now-unused `mockUploadCertFile` reference paths only if trivial; otherwise leave mock untouched (`USE_MOCK = false` in prod). No behavior impact.

## Verification
- Typecheck passes (no `files` references remain on `CertRequestDetails`).
- Open a cert request detail page: items render, each item exposes a files toggle, expanding fetches `/cert-requests/:id/items/:itemId/files`, upload/link/download all hit the new URLs.
- No 404 on the old `/cert-requests/:id/files*` routes from the UI.
