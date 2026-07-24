import { useState } from 'react';
import type { DateRange } from '@/lib/dateRange';
import type { Ticker } from '@/services/tickers';

export type TickerSubmission = { tickers: Ticker[]; range: DateRange };

export function useTickerSubmission() {
  const [submission, setSubmission] = useState<TickerSubmission | null>(null);

  const submit = (tickers: Ticker[], range: DateRange) => {
    setSubmission({ tickers, range });
  };

  return { submission, submit };
}
