import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Props {
  hasUnreadMessages?: boolean;
  hasUnreadChanges?: boolean;
}

export function UnreadDots({ hasUnreadMessages, hasUnreadChanges }: Props) {
  if (!hasUnreadMessages && !hasUnreadChanges) return null;
  return (
    <span className="inline-flex items-center gap-1">
      {hasUnreadMessages && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className="inline-block h-2 w-2 rounded-full bg-primary"
              aria-label="Новые сообщения"
            />
          </TooltipTrigger>
          <TooltipContent>Новые сообщения</TooltipContent>
        </Tooltip>
      )}
      {hasUnreadChanges && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className="inline-block h-2 w-2 rounded-full bg-orange-500"
              aria-label="Изменения в заявке"
            />
          </TooltipTrigger>
          <TooltipContent>Изменения в заявке</TooltipContent>
        </Tooltip>
      )}
    </span>
  );
}
