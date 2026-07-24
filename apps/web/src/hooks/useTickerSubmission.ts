import { useState } from 'react';

import { defaultPreset, resolveRange, type DateRange } from '@/lib/dateRange';
import type { Ticker } from '@/services/tickers';

export function useTickerSubmission() {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [range, setRange] = useState<DateRange>(() =>
    resolveRange(defaultPreset),
  );

  const submit = (nextTickers: Ticker[], nextRange: DateRange) => {
    setTickers(nextTickers);
    setRange(nextRange);
  };

  return { tickers, range, submit };
}
