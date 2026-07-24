import { ComboboxChip } from '@/components/ui/combobox';
import type { Ticker } from '@/services/tickers';

interface SelectedTickerChipsProps {
  values: Ticker[];
  maxVisible: number;
}

export function SelectedTickerChips({
  values,
  maxVisible,
}: SelectedTickerChipsProps) {
  const visible = values.slice(0, maxVisible);
  const overflow = values.length - visible.length;

  return (
    <>
      {visible.map((ticker) => (
        <ComboboxChip key={ticker.symbol}>{ticker.symbol}</ComboboxChip>
      ))}
      {overflow > 0 && (
        <span className="flex h-[calc(--spacing(5.25))] items-center rounded-sm bg-muted px-1.5 text-xs font-medium text-muted-foreground">
          +{overflow}
        </span>
      )}
    </>
  );
}
