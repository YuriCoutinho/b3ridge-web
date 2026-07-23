import { z } from 'zod';
import { tickersResponseSchema, type Ticker } from '@b3ridge/contracts';
import { request } from './client';
import { env } from '../config/env';
import type { DateRange } from '../lib/dateRange';

export type { Ticker };

const tickerHistoryPointSchema = z.object({
  date: z.number(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number(),
  adjustedClose: z.number(),
});

export type TickerHistoryPoint = z.infer<typeof tickerHistoryPointSchema>;

const tickerHistoryResponseSchema = z.object({
  results: z.array(
    z.object({
      data: z.object({
        historicalDataPrice: z.array(tickerHistoryPointSchema),
      }),
    }),
  ),
});

export async function fetchTickers(): Promise<Ticker[]> {
  return request(`${env.internalApiUrl}/api/tickers`, tickersResponseSchema);
}

export async function fetchTickerHistory(
  symbol: string,
  { startDate, endDate }: DateRange,
): Promise<TickerHistoryPoint[]> {
  const headers = {
    Authorization: `Bearer ${env.apiToken}`,
  };

  const query = new URLSearchParams({ symbols: symbol, startDate, endDate });
  const { results } = await request(
    `${env.apiUrl}/stocks/historical?${query}`,
    tickerHistoryResponseSchema,
    headers,
  );

  return results[0]?.data.historicalDataPrice ?? [];
}
