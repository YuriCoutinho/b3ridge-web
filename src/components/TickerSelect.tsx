import type { ChangeEvent } from 'react';
import { useTickers } from '@/hooks/useTickers';
import type { Ticker } from '@/services/tickers';

interface TickerSelectProps {
  selected: Ticker[];
  onSelect: (tickers: Ticker[]) => void;
}

export function TickerSelect({ selected, onSelect }: TickerSelectProps) {
  const { tickers, isPending, isError } = useTickers();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const symbols = Array.from(
      event.target.selectedOptions,
      (option) => option.value,
    );
    onSelect(tickers.filter((ticker) => symbols.includes(ticker.symbol)));
  }

  return (
    <div>
      <label htmlFor="ticker-select">Ativos</label>
      <select
        id="ticker-select"
        className="w-full"
        multiple
        disabled={isPending || isError}
        value={selected.map((ticker) => ticker.symbol)}
        onChange={handleChange}
      >
        {tickers.map((ticker) => (
          <option key={ticker.symbol} value={ticker.symbol}>
            {ticker.symbol} — {ticker.name}
          </option>
        ))}
      </select>
    </div>
  );
}
