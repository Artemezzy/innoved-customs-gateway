import { ReactNode } from 'react';

/**
 * Table header cell with a draggable handle on its right edge to resize the
 * column width. Width comes from useResizableColumns and is applied via
 * inline style so it works with plain <table> layout (no extra libraries).
 */

interface ResizableThProps {
  width: number;
  onResizeStart: (e: React.PointerEvent) => void;
  className?: string;
  children: ReactNode;
}

export function ResizableTh({ width, onResizeStart, className, children }: ResizableThProps) {
  return (
    <th
      style={{ width, minWidth: width, maxWidth: width }}
      className={`relative p-2 border-b text-left align-middle ${className || ''}`}
    >
      {children}
      <div
        onPointerDown={onResizeStart}
        title="Потяните, чтобы изменить ширину колонки"
        className="absolute top-0 right-0 h-full w-2 cursor-col-resize select-none hover:bg-primary/30 active:bg-primary/50"
      />
    </th>
  );
}