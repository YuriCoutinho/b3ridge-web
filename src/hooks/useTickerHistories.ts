import { useCallback } from 'react';
import { useQueries, type UseQueryResult } from '@tanstack/react-query';
import {
  fetchTickerHistory,
  type Ticker,
  type TickerHistoryPoint,
} from '@/services/tickers';
import { isValidRange, type DateRange } from '@/lib/dateRange';

type TickerHistories = Record<string, TickerHistoryPoint[] | undefined>;

export function useTickerHistories(tickers: Ticker[], range: DateRange) {
  const enabled = isValidRange(range);

  const combine = useCallback(
    (results: UseQueryResult<TickerHistoryPoint[]>[]) =>
      Object.fromEntries(
        tickers.map((ticker, index) => [ticker.symbol, results[index].data]),
      ) as TickerHistories,
    [tickers],
  );

  return useQueries({
    queries: tickers.map((ticker) => ({
      queryKey: ['tickers', 'history', ticker.symbol, range],
      queryFn: () => fetchTickerHistory(ticker.symbol, range),
      enabled,
      meta: {
        toast: {
          success: 'Cotações atualizadas',
          error: 'Falha ao carregar as cotações',
        },
      },
    })),
    combine,
  });
}
