import {
  tickerHistoryBatchResponseSchema,
  tickersResponseSchema,
  type Ticker,
  type TickerHistoryPoint,
  type TickerHistoryResult,
} from '@b3ridge/contracts';
import { request } from './client';
import { env } from '../config/env';
import type { DateRange } from '../lib/dateRange';

export type { Ticker, TickerHistoryPoint, TickerHistoryResult };

export async function fetchTickers(): Promise<Ticker[]> {
  return request(`${env.internalApiUrl}/api/tickers`, tickersResponseSchema);
}

export async function fetchTickerHistories(
  symbols: string[],
  { startDate, endDate }: DateRange,
): Promise<TickerHistoryResult[]> {
  const query = new URLSearchParams({
    symbols: symbols.join(','),
    startDate,
    endDate,
  });

  return request(
    `${env.internalApiUrl}/api/tickers/history?${query}`,
    tickerHistoryBatchResponseSchema,
  );
}
