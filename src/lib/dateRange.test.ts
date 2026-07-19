import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { resolveRange, isValidRange } from '@/lib/dateRange';

describe('resolveRange', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-20T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('anchors the end at D-1 and moves the start back by the preset days', () => {
    expect(resolveRange('7d')).toEqual({
      startDate: '2026-07-12',
      endDate: '2026-07-19',
    });
  });

  it('resolves the 1 month preset', () => {
    expect(resolveRange('1m')).toEqual({
      startDate: '2026-06-19',
      endDate: '2026-07-19',
    });
  });

  it('anchors on the local calendar day near midnight, not on UTC', () => {
    vi.setSystemTime(new Date('2026-07-20T02:00:00Z'));

    expect(resolveRange('7d')).toEqual({
      startDate: '2026-07-11',
      endDate: '2026-07-18',
    });
  });
});

describe('isValidRange', () => {
  it('accepts a coherent range', () => {
    expect(
      isValidRange({ startDate: '2026-07-12', endDate: '2026-07-19' }),
    ).toBe(true);
  });

  it('rejects a start after the end', () => {
    expect(
      isValidRange({ startDate: '2026-07-19', endDate: '2026-07-12' }),
    ).toBe(false);
  });

  it('rejects missing dates', () => {
    expect(isValidRange({ startDate: '', endDate: '' })).toBe(false);
  });
});
