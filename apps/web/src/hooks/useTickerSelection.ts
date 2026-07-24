import { maxBatchSymbols } from '@b3ridge/contracts';
import { useState } from 'react';

import type { Ticker } from '@/services/tickers';

export function useTickerSelection() {
  const [selected, setSelected] = useState<Ticker[]>([]);

  const changeSelection = (tickers: Ticker[]) => {
    setSelected(tickers.slice(0, maxBatchSymbols));
  };

  return { selected, setSelected: changeSelection };
}
