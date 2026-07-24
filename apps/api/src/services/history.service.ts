import type { TickerHistoryPoint } from '@b3ridge/contracts';
import { fetchTickerHistory } from '../clients/brapi/history/client.js';
import { getJson, setJson } from '../cache/redis.js';
import type { DateRange } from '../lib/dateRange.js';

const CACHE_TTL_SECONDS = 60 * 60 * 6;

function cacheKey(symbol: string, { startDate, endDate }: DateRange): string {
  return `history:${symbol}:${startDate}:${endDate}`;
}

export async function getTickerHistory(
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
