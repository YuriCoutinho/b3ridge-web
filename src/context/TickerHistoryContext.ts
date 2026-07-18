import { createContext, useContext } from 'react';
import type { Ticker, TickerHistoryPoint } from '@/services/tickers';

export interface TickerHistoryContextValue {
  selected: Ticker[];
  setSelected: (tickers: Ticker[]) => void;
  histories: Record<string, TickerHistoryPoint[]>;
}

export const TickerHistoryContext =
  createContext<TickerHistoryContextValue | null>(null);

export function useTickerHistory() {
  const context = useContext(TickerHistoryContext);
  if (!context) {
    throw new Error(
      'useTickerHistory must be used within a TickerHistoryProvider',
    );
  }
  return context;
}
