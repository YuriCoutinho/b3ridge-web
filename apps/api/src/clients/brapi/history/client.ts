import type { TickerHistoryPoint } from '@b3ridge/contracts';

import { splitDateRange, type DateRange } from '../../../lib/dateRange.js';
import { brapiGet } from '../httpClient.js';
import { dedupeAndSortByDate } from './normalize.js';
import { brapiHistorySchema } from './schema.js';

const INTERVAL = '1d';
const MAX_RANGE_DAYS = 90; // brapi free-plan cap on custom startDate/endDate windows

async function fetchHistorySegment(
  symbol: string,
  { startDate, endDate }: DateRange,
): Promise<TickerHistoryPoint[]> {
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
): Promise<TickerHistoryPoint[]> {
  const segmentResults = await Promise.all(
    splitDateRange(range, MAX_RANGE_DAYS).map((segment) =>
      fetchHistorySegment(symbol, segment),
    ),
  );

  return dedupeAndSortByDate(segmentResults.flat());
}
