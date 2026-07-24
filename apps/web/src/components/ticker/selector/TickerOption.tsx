import { ComboboxItem } from '@/components/ui/combobox';
import type { Ticker } from '@/services/tickers';

interface TickerOptionProps {
  ticker: Ticker;
  disabled?: boolean;
}

export function TickerOption({ ticker, disabled }: TickerOptionProps) {
  return (
    <ComboboxItem value={ticker} disabled={disabled}>
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{ticker.symbol}</span>
        <span className="text-xs text-muted-foreground">{ticker.name}</span>
      </div>
    </ComboboxItem>
  );
}
