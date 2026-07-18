import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  fetchTickerHistory,
  type Ticker,
  type TickerHistoryPoint,
} from '@/services/tickers';
import { TickerHistoryContext } from './TickerHistoryContext';

export function TickerHistoryProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Ticker[]>([]);
  const [histories, setHistories] = useState<
    Record<string, TickerHistoryPoint[]>
  >({});
  const fetched = useRef<Set<string>>(new Set());

  useEffect(() => {
    const missing = selected.filter(
      (ticker) => !fetched.current.has(ticker.symbol),
    );

    missing.forEach(async (ticker) => {
      fetched.current.add(ticker.symbol);
      try {
        const points = await fetchTickerHistory(ticker.symbol);
        setHistories((prev) => ({ ...prev, [ticker.symbol]: points }));
      } catch {
        fetched.current.delete(ticker.symbol);
      }
    });
  }, [selected]);

  return (
    <TickerHistoryContext.Provider value={{ selected, setSelected, histories }}>
      {children}
    </TickerHistoryContext.Provider>
  );
}
