import { useState } from 'react';
import type { Ticker } from '@/services/tickers';

export const MAX_SELECTED_TICKERS = 8;

export function useTickerSelection() {
  const [selected, setSelected] = useState<Ticker[]>([]);

  const changeSelection = (tickers: Ticker[]) => {
    setSelected(tickers.slice(0, MAX_SELECTED_TICKERS));
  };

  return { selected, setSelected: changeSelection };
}
