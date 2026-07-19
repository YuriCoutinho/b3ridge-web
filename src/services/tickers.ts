import { request } from './client';
import { env } from '../config/env';
import type { DateRange } from '../lib/dateRange';

export interface Ticker {
  symbol: string;
  name: string;
}

interface TickersResponse {
  results: Ticker[];
}

export interface TickerHistoryPoint {
  date: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose: number;
}

interface TickerHistoryResponse {
  results: {
    data: {
      historicalDataPrice: TickerHistoryPoint[];
    };
  }[];
}

export async function fetchTickers(): Promise<Ticker[]> {
  const { results } = await request<TickersResponse>('/tickers?limit=2000');
  return slimTickers(results);
}

function slimTickers(tickers: Ticker[]): Ticker[] {
  return tickers.map(({ symbol, name }) => ({ symbol, name }));
}

export async function fetchTickerHistory(
  symbol: string,
  { startDate, endDate }: DateRange,
): Promise<TickerHistoryPoint[]> {
  // TODO: Remove after implements backend endpoint
  const headers = {
    Authorization: `Bearer ${env.apiToken}`,
  };

  const query = new URLSearchParams({ symbols: symbol, startDate, endDate });
  const { results } = await request<TickerHistoryResponse>(
    `/stocks/historical?${query}`,
    headers,
  );

  return results[0]?.data.historicalDataPrice ?? [];
}
