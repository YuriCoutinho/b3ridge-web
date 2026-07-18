import type { ChangeEvent } from 'react';
import { useTickers } from '@/hooks/useTickers';
import { useTickerHistory } from '@/context/TickerHistoryContext';

// Select nativo (<select multiple>) como placeholder da seleção de ativos.
// O combobox com busca do shadcn substitui isso numa PR futura.
export function TickerSelect() {
  const { tickers, status } = useTickers();
  const { selected, setSelected } = useTickerHistory();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const symbols = Array.from(
      event.target.selectedOptions,
      (option) => option.value,
    );
    setSelected(tickers.filter((ticker) => symbols.includes(ticker.symbol)));
  }

  return (
    <div>
      <label htmlFor="ticker-select">Ativos</label>
      <select
        id="ticker-select"
        multiple
        disabled={status !== 'ready'}
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
