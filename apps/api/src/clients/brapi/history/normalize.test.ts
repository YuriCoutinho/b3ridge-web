import { describe, it, expect } from 'vitest';
import { dedupeAndSortByDate } from './normalize.js';
import type { BrapiHistoryPoint } from './schema.js';

function point(overrides: Partial<BrapiHistoryPoint> & { date: number }) {
  return {
    open: 1,
    high: 1,
    low: 1,
    close: 1,
    volume: 1,
    adjustedClose: 1,
    ...overrides,
  };
}

describe('dedupeAndSortByDate', () => {
  it('sorts points from out-of-order segments by date', () => {
    const points = [point({ date: 3 }), point({ date: 1 }), point({ date: 2 })];

    expect(dedupeAndSortByDate(points).map((p) => p.date)).toEqual([1, 2, 3]);
  });

  it('dedupes points sharing the same date, keeping the last occurrence', () => {
    const points = [
      point({ date: 1, close: 10 }),
      point({ date: 1, close: 20 }),
    ];

    const result = dedupeAndSortByDate(points);

    expect(result).toHaveLength(1);
    expect(result[0].close).toBe(20);
  });
});
