## Summary

Verify and harden the per-item file download UI in certification requests so both `manager` and `cert_center` roles can download attached files.

## Current state (verified)

- `src/components/lk/CertFilesPanel.tsx` already receives `{ requestId, itemId }`, fetches files via `useQuery(['lk','cert-item-files', requestId, itemId], …)`, and renders a `<Download>` icon button for every `file_type === 'file'` entry that calls `lkApi.downloadCertFile(requestId, itemId, f.id, f.filename)`.
- `src/components/lk/CertItemsPanel.tsx` already mounts `<CertFilesPanel requestId={requestId} itemId={item.id} />` for each item (desktop sub-row and mobile card collapsible).
- `src/pages/lk/LKCertRequestDetailPage.tsx` already renders `CertItemsPanel` inside the «Данные заявки» card and has no global attachments block.
- `src/api/lkClient.ts` already implements `downloadCertFile` hitting `GET /api/cert-requests/:requestId/items/:itemId/files/:fileId/download`.
- `src/types/lk.ts` defines `CertFile.filename?: string`.

So the requested button and wiring are already in place. The work is to confirm there are no runtime/typing issues and to fix anything that prevents the download from working.

## Plan

1. **Typecheck / build**
   - Run `bunx tsc --noEmit` (or project typecheck) to confirm no TS errors from `downloadCertFile` usage or `CertFile` fields.

2. **Field-name consistency check**
   - If the backend returns `filename_original` instead of `filename`, update `CertFile` interface and the render/download filename fallback so the button is visible and downloads use the correct name.

3. **UI hardening (only if verification reveals a problem)**
   - Ensure the download button is always rendered for `file_type === 'file'` regardless of role.
   - Add an accessible `title="Скачать"` to the download button.
   - Keep the existing layout; no changes to `CertItemsPanel`, `LKCertRequestDetailPage`, or `lkClient.ts` unless a bug is found.

4. **Browser verification**
   - Open `/lk/cert-requests/:id` under `manager` role: expand a row with files, click the Download icon, confirm the browser starts a download and no 404/401 errors appear for `/cert-requests/:id/items/:itemId/files/:fileId/download`.
   - Repeat under `cert_center` role.
   - Confirm no old `/cert-requests/:id/files*` requests are made.

## Expected result

Both roles see a working Download icon next to each uploaded file inside every item's «Вложения» panel, and files download via the new per-item endpoint.
