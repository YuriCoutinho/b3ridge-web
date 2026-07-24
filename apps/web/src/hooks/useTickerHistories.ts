import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  isValidRange,
  maxEndDateIso,
  minStartDateIso,
  type DateRange,
} from '@/lib/dateRange';
import {
  fetchTickerHistories,
  type HistoryErrorReason,
  type Ticker,
  type TickerHistoryPoint,
  type TickerHistoryResult,
} from '@/services/tickers';

type TickerHistory = {
  data: TickerHistoryPoint[];
  isPending: boolean;
  isError: boolean;
  reason: HistoryErrorReason | null;
};

type TickerHistories = Record<string, TickerHistory>;

export function useTickerHistories(
  tickers: Ticker[],
  range: DateRange,
): TickerHistories {
  const symbols = tickers.map((ticker) => ticker.symbol).sort();
  const enabled =
    tickers.length > 0 &&
    isValidRange(range, maxEndDateIso(), minStartDateIso());

  const query = useQuery({
    queryKey: ['tickers', 'history', symbols, range],
    queryFn: () => fetchTickerHistories(symbols, range),
    enabled,
    placeholderData: keepPreviousData,
    meta: {
      toast: {
        success: 'Cotações atualizadas',
        error: 'Falha ao carregar as cotações',
      },
    },
  });

  const bySymbol = new Map<string, TickerHistoryResult>(
    query.data?.map((result) => [result.symbol, result]),
  );

  return Object.fromEntries(
    tickers.map((ticker) => {
      const result = bySymbol.get(ticker.symbol);
      const reason: HistoryErrorReason | null =
        result?.status === 'error'
          ? result.reason
          : query.isError
            ? 'upstream_error'
            : null;

      return [
        ticker.symbol,
        {
          data: result?.status === 'ok' ? result.history : [],
          isPending: query.isLoading,
          isError: reason !== null,
          reason,
        },
      ];
    }),
  );
}
