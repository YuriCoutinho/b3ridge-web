import type {
  TickerHistoryPoint,
  TickerHistoryResult,
} from '@b3ridge/contracts';

import { getJson, setJson } from '../cache/redis.js';
import { BrapiError } from '../clients/brapi/errors.js';
import { fetchTickerHistory } from '../clients/brapi/history/client.js';
import type { DateRange } from '../lib/dateRange.js';

const CACHE_TTL_SECONDS = 60 * 60 * 6;

function cacheKey(symbol: string, { startDate, endDate }: DateRange): string {
  return `history:${symbol}:${startDate}:${endDate}`;
}

async function getTickerHistory(
  symbol: string,
  range: DateRange,
): Promise<TickerHistoryPoint[]> {
  const key = cacheKey(symbol, range);
  const cached = await getJson<TickerHistoryPoint[]>(key);
  if (cached) return cached;

  const history = await fetchTickerHistory(symbol, range);
  await setJson(key, history, CACHE_TTL_SECONDS);
  return history;
}

async function resolveSymbol(
  symbol: string,
  range: DateRange,
): Promise<TickerHistoryResult> {
  try {
    return {
      symbol,
      status: 'ok',
      history: await getTickerHistory(symbol, range),
    };
  } catch (error) {
    const reason =
      error instanceof BrapiError && error.status === 404
        ? 'not_found'
        : 'upstream_error';
    return { symbol, status: 'error', reason };
  }
}

export async function getTickerHistories(
  symbols: string[],
  range: DateRange,
): Promise<TickerHistoryResult[]> {
  return Promise.all(symbols.map((symbol) => resolveSymbol(symbol, range)));
}
