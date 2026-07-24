import {
  tickerHistoryResponseSchema,
  tickersResponseSchema,
  type Ticker,
  type TickerHistoryPoint,
} from '@b3ridge/contracts';
import { request } from './client';
import { env } from '../config/env';
import type { DateRange } from '../lib/dateRange';

export type { Ticker, TickerHistoryPoint };

export async function fetchTickers(): Promise<Ticker[]> {
  return request(`${env.internalApiUrl}/api/tickers`, tickersResponseSchema);
}

export async function fetchTickerHistory(
  symbol: string,
  { startDate, endDate }: DateRange,
): Promise<TickerHistoryPoint[]> {
  const query = new URLSearchParams({ startDate, endDate });

  return request(
    `${env.internalApiUrl}/api/tickers/${symbol}/history?${query}`,
    tickerHistoryResponseSchema,
  );
}
