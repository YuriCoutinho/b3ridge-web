import { useQueries } from '@tanstack/react-query';
import {
  fetchTickerHistory,
  type Ticker,
  type TickerHistoryPoint,
} from '@/services/tickers';
import { isValidRange, type DateRange } from '@/lib/dateRange';

type TickerHistories = Record<string, TickerHistoryPoint[] | undefined>;

export function useTickerHistories(tickers: Ticker[], range: DateRange) {
  const enabled = isValidRange(range);

  return useQueries({
    queries: tickers.map((ticker) => ({
      queryKey: ['tickers', 'history', ticker.symbol, range],
      queryFn: () => fetchTickerHistory(ticker.symbol, range),
      enabled,
    })),
    combine: (results) =>
      Object.fromEntries(
        tickers.map((ticker, index) => [ticker.symbol, results[index].data]),
      ) as TickerHistories,
  });
}
