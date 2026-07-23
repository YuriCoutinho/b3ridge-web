import { describe, it, expect } from 'vitest';
import { splitDateRange } from './dateRange.js';

describe('splitDateRange', () => {
  it('returns a single chunk when the range fits within maxDays', () => {
    const chunks = splitDateRange(
      { startDate: '2026-01-01', endDate: '2026-01-10' },
      90,
    );

    expect(chunks).toEqual([
      { startDate: '2026-01-01', endDate: '2026-01-10' },
    ]);
  });

  it('returns a single chunk when the range is exactly maxDays', () => {
    const chunks = splitDateRange(
      { startDate: '2026-01-01', endDate: '2026-04-01' },
      90,
    );

    expect(chunks).toEqual([
      { startDate: '2026-01-01', endDate: '2026-04-01' },
    ]);
  });

  it('splits a range wider than maxDays into contiguous, non-overlapping chunks', () => {
    const chunks = splitDateRange(
      { startDate: '2026-01-01', endDate: '2026-06-01' },
      90,
    );

    expect(chunks).toEqual([
      { startDate: '2026-01-01', endDate: '2026-04-01' },
      { startDate: '2026-04-02', endDate: '2026-06-01' },
    ]);
  });

  it('splits a range spanning multiple years into 90-day chunks with no gaps', () => {
    const chunks = splitDateRange(
      { startDate: '2024-01-01', endDate: '2024-12-31' },
      90,
    );

    for (let i = 1; i < chunks.length; i += 1) {
      const previousEnd = new Date(`${chunks[i - 1].endDate}T00:00:00Z`);
      const currentStart = new Date(`${chunks[i].startDate}T00:00:00Z`);
      const dayAfterPreviousEnd = new Date(previousEnd);
      dayAfterPreviousEnd.setUTCDate(dayAfterPreviousEnd.getUTCDate() + 1);

      expect(currentStart).toEqual(dayAfterPreviousEnd);
    }

    expect(chunks[0].startDate).toBe('2024-01-01');
    expect(chunks.at(-1)?.endDate).toBe('2024-12-31');
    expect(chunks.length).toBeGreaterThan(1);
  });
});
