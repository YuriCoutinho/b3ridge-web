import { TickerSummaryItem } from '@/components/ticker/chart/TickerSummaryItem';

export interface TickerSummary {
  symbol: string;
  changePct: number;
  colorVar: string;
}

interface TickerSummaryListProps {
  items: TickerSummary[];
}

export function TickerSummaryList({ items }: TickerSummaryListProps) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <TickerSummaryItem key={item.symbol} {...item} />
      ))}
    </ul>
  );
}
