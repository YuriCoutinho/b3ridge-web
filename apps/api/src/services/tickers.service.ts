import type { Ticker } from '@b3ridge/contracts';
import { fetchTickers } from '../clients/brapi/tickers/client.js';
import { getJson, setJson } from '../cache/redis.js';

const CACHE_TTL_SECONDS = 60 * 60 * 6;
const CACHE_KEY = 'tickers';

export async function getTickers(): Promise<Ticker[]> {
  const cached = await getJson<Ticker[]>(CACHE_KEY);
  if (cached) return cached;

  const tickers = await fetchTickers();
  await setJson(CACHE_KEY, tickers, CACHE_TTL_SECONDS);
  return tickers;
}
