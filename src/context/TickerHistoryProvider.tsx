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
    async function loadHistory(ticker: Ticker) {
      fetched.current.add(ticker.symbol);
      try {
        const points = await fetchTickerHistory(ticker.symbol);
        setHistories((previous) => ({ ...previous, [ticker.symbol]: points }));
      } catch {
        fetched.current.delete(ticker.symbol);
      }
    }

    const missingTickers = selected.filter(
      (ticker) => !fetched.current.has(ticker.symbol),
    );

    missingTickers.forEach(loadHistory);
  }, [selected]);

  return (
    <TickerHistoryContext.Provider value={{ selected, setSelected, histories }}>
      {children}
    </TickerHistoryContext.Provider>
  );
}
