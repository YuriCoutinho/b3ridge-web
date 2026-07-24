import { ArrowDownRightIcon, ArrowUpRightIcon } from 'lucide-react';

import { formatChangePct, type TickerSummary } from '@/lib/series';
import { cn } from '@/lib/utils';

export function TickerSummaryItem({
  symbol,
  changePct,
  colorVar,
}: TickerSummary) {
  const isPositive = changePct >= 0;
  const Arrow = isPositive ? ArrowUpRightIcon : ArrowDownRightIcon;

  return (
    <li className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm">
      <span
        aria-hidden="true"
        className="size-2.5 rounded-full"
        style={{ backgroundColor: colorVar }}
      />
      <span className="font-medium text-foreground">{symbol}</span>
      <span
        className={cn(
          'flex items-center gap-0.5 font-medium tabular-nums',
          isPositive ? 'text-success' : 'text-destructive',
        )}
      >
        <Arrow className="size-3.5" aria-hidden="true" />
        {formatChangePct(changePct)}
      </span>
    </li>
  );
}
