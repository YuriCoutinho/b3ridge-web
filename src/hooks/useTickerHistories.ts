import { useCallback } from 'react';
import { useQueries, type UseQueryResult } from '@tanstack/react-query';
import {
  fetchTickerHistory,
  type Ticker,
  type TickerHistoryPoint,
} from '@/services/tickers';
import { isValidRange, maxEndDateIso, type DateRange } from '@/lib/dateRange';

type TickerHistory = {
  data: TickerHistoryPoint[];
  isPending: boolean;
  isError: boolean;
  error: Error | null;
};

type TickerHistories = Record<string, TickerHistory>;

export function useTickerHistories(tickers: Ticker[], range: DateRange) {
  const enabled = isValidRange(range, maxEndDateIso());

  const combine = useCallback(
    (results: UseQueryResult<TickerHistoryPoint[]>[]) =>
      Object.fromEntries(
        tickers.map((ticker, index) => [
          ticker.symbol,
          {
            data: results[index].data ?? [],
            isPending: results[index].isPending,
            isError: results[index].isError,
            error: results[index].error,
          },
        ]),
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
