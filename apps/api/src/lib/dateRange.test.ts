import { describe, expect, it } from 'vitest';

import { splitDateRange } from './dateRange.js';

describe('splitDateRange', () => {
  it('returns a single segment when the range fits within maxDays', () => {
    const dateRangeSegments = splitDateRange(
      { startDate: '2026-01-01', endDate: '2026-01-10' },
      90,
    );

    expect(dateRangeSegments).toEqual([
      { startDate: '2026-01-01', endDate: '2026-01-10' },
    ]);
  });

  it('returns a single segment when the range is exactly maxDays', () => {
    const dateRangeSegments = splitDateRange(
      { startDate: '2026-01-01', endDate: '2026-04-01' },
      90,
    );

    expect(dateRangeSegments).toEqual([
      { startDate: '2026-01-01', endDate: '2026-04-01' },
    ]);
  });

  it('splits a range wider than maxDays into contiguous, non-overlapping segments', () => {
    const dateRangeSegments = splitDateRange(
      { startDate: '2026-01-01', endDate: '2026-06-01' },
      90,
    );

    expect(dateRangeSegments).toEqual([
      { startDate: '2026-01-01', endDate: '2026-04-01' },
      { startDate: '2026-04-02', endDate: '2026-06-01' },
    ]);
  });

  it('splits a range spanning multiple years into 90-day segments with no gaps', () => {
    const dateRangeSegments = splitDateRange(
      { startDate: '2024-01-01', endDate: '2024-12-31' },
      90,
    );

    for (let i = 1; i < dateRangeSegments.length; i += 1) {
      const previousEnd = new Date(
        `${dateRangeSegments[i - 1].endDate}T00:00:00Z`,
      );
      const currentStart = new Date(
        `${dateRangeSegments[i].startDate}T00:00:00Z`,
      );
      const dayAfterPreviousEnd = new Date(previousEnd);
      dayAfterPreviousEnd.setUTCDate(dayAfterPreviousEnd.getUTCDate() + 1);

      expect(currentStart).toEqual(dayAfterPreviousEnd);
    }

    expect(dateRangeSegments[0].startDate).toBe('2024-01-01');
    expect(dateRangeSegments.at(-1)?.endDate).toBe('2024-12-31');
    expect(dateRangeSegments.length).toBeGreaterThan(1);
  });
});
