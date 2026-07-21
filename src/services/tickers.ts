import { z } from 'zod';
import { request } from './client';
import { env } from '../config/env';
import type { DateRange } from '../lib/dateRange';

const tickerSchema = z.object({
  symbol: z.string(),
  name: z.string(),
});

export type Ticker = z.infer<typeof tickerSchema>;

const tickersResponseSchema = z.object({
  results: z.array(tickerSchema),
});

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
  const { results } = await request(
    '/tickers?limit=2000&sortBy=marketCap',
    tickersResponseSchema,
  );
  return results;
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
    `/stocks/historical?${query}`,
    tickerHistoryResponseSchema,
    headers,
  );

  return results[0]?.data.historicalDataPrice ?? [];
}
