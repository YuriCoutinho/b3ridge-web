import { describe, it, expect } from 'vitest';
import type { BrapiHistoryPoint } from '../clients/brapi/schemas.js';
import { mergeHistory } from './mergeHistory.js';

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

describe('mergeHistory', () => {
  it('sorts points from out-of-order chunks by date', () => {
    const points = [point({ date: 3 }), point({ date: 1 }), point({ date: 2 })];

    expect(mergeHistory(points).map((p) => p.date)).toEqual([1, 2, 3]);
  });

  it('dedupes points sharing the same date, keeping the last occurrence', () => {
    const points = [
      point({ date: 1, close: 10 }),
      point({ date: 1, close: 20 }),
    ];

    const result = mergeHistory(points);

    expect(result).toHaveLength(1);
    expect(result[0].close).toBe(20);
  });
});
