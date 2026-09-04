import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Textarea, TextareaProps } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

/**
 * Textarea that automatically grows in height to fit its content while
 * typing, and additionally allows the user to manually resize it further
 * (vertical resize handle) if the auto height is still not enough.
 *
 * Used in the "Продукция" table (ShipmentItemsPanel / CertItemsPanel) to
 * fix the fixed-size field problem: long "Техническое описание", "ТР ТС"
 * and "Комментарий" values no longer get visually clipped.
 */

interface AutoGrowTextareaProps extends TextareaProps {
  /** Minimum height in pixels, applied on mount and when the value is cleared. */
  minHeight?: number;
  /** Maximum auto-grow height in pixels before an internal scrollbar appears. */
  maxHeight?: number;
}

export const AutoGrowTextarea = forwardRef<HTMLTextAreaElement, AutoGrowTextareaProps>(
  ({ className, minHeight = 96, maxHeight = 480, value, onChange, ...props }, forwardedRef) => {
    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current as HTMLTextAreaElement);

    const resize = () => {
      const el = innerRef.current;
      if (!el) return;
      el.style.height = 'auto';
      const next = Math.min(Math.max(el.scrollHeight, minHeight), maxHeight);
      el.style.height = `${next}px`;
    };

    useEffect(() => {
      resize();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
      <Textarea
        ref={innerRef}
        value={value}
        onChange={(e) => {
          onChange?.(e);
          resize();
        }}
        style={{ minHeight, maxHeight, overflowY: 'auto' }}
        className={cn('resize-y transition-[height]', className)}
        {...props}
      />
    );
  }
);

AutoGrowTextarea.displayName = 'AutoGrowTextarea';