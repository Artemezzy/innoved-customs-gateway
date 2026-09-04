import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook that manages per-column widths for a plain HTML <table> and persists
 * them to localStorage. Combined with <ResizableTh>, it gives the user a
 * drag handle on the right edge of each header cell to stretch/shrink that
 * column, similar to Excel/Google Sheets.
 *
 * Widths are stored in pixels, keyed by column key, in the given
 * localStorage key so each table (shipments / cert requests) keeps its own
 * layout.
 */

const MIN_COLUMN_WIDTH = 120;

function loadWidths(storageKey: string): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function saveWidths(storageKey: string, widths: Record<string, number>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey, JSON.stringify(widths));
}

export function useResizableColumns(storageKey: string, defaultWidth = 200) {
  const [widths, setWidths] = useState<Record<string, number>>(() => loadWidths(storageKey));
  const draggingKey = useRef<string | null>(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const getWidth = useCallback(
    (key: string) => widths[key] ?? defaultWidth,
    [widths, defaultWidth]
  );

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!draggingKey.current) return;
    const delta = e.clientX - startX.current;
    const next = Math.max(MIN_COLUMN_WIDTH, startWidth.current + delta);
    setWidths((prev) => ({ ...prev, [draggingKey.current as string]: next }));
  }, []);

  const handlePointerUp = useCallback(() => {
    if (!draggingKey.current) return;
    draggingKey.current = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    setWidths((prev) => {
      saveWidths(storageKey, prev);
      return prev;
    });
  }, [storageKey]);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  const startResize = useCallback(
    (key: string, e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      draggingKey.current = key;
      startX.current = e.clientX;
      startWidth.current = getWidth(key);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    [getWidth]
  );

  const resetWidths = useCallback(() => {
    setWidths({});
    saveWidths(storageKey, {});
  }, [storageKey]);

  return { getWidth, startResize, resetWidths };
}