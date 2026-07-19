import { useState } from 'react';
import type { Ticker } from '@/services/tickers';

export function useTickerSelection() {
  const [selected, setSelected] = useState<Ticker[]>([]);
  return { selected, setSelected };
}
