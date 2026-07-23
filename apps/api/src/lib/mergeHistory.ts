import type { TickerHistoryPoint } from '@b3ridge/contracts';
import type { BrapiHistoryPoint } from '../clients/brapi/schemas.js';

export function mergeHistory(
  points: BrapiHistoryPoint[],
): TickerHistoryPoint[] {
  const byDate = new Map<number, TickerHistoryPoint>();
  for (const point of points) {
    byDate.set(point.date, point);
  }

  return [...byDate.values()].sort((a, b) => a.date - b.date);
}
