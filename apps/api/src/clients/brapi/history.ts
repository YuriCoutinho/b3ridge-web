import { splitDateRange, type DateRange } from '../../lib/dateRange.js';
import { brapiGet } from './httpClient.js';
import { brapiHistorySchema, type BrapiHistoryPoint } from './schemas.js';

const INTERVAL = '1d';
const MAX_RANGE_DAYS = 90; // brapi free-plan cap on custom startDate/endDate windows

async function fetchHistoryChunk(
  symbol: string,
  { startDate, endDate }: DateRange,
): Promise<BrapiHistoryPoint[]> {
  const page = await brapiGet(
    `/quote/${symbol}`,
    { interval: INTERVAL, startDate, endDate },
    brapiHistorySchema,
  );

  return page.results[0]?.historicalDataPrice ?? [];
}

export async function fetchTickerHistory(
  symbol: string,
  range: DateRange,
): Promise<BrapiHistoryPoint[]> {
  const chunks = await Promise.all(
    splitDateRange(range, MAX_RANGE_DAYS).map((chunk) =>
      fetchHistoryChunk(symbol, chunk),
    ),
  );

  return chunks.flat();
}
