import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  isValidRange,
  matchPreset,
  resolveRange,
  validateRange,
} from '@/lib/dateRange';

describe('resolveRange', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-20T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('anchors the end at D-3 for every preset', () => {
    expect(resolveRange('5d').endDate).toBe('2026-07-17');
    expect(resolveRange('ytd').endDate).toBe('2026-07-17');
  });

  it('moves the start back by 5 days', () => {
    expect(resolveRange('5d')).toEqual({
      startDate: '2026-07-12',
      endDate: '2026-07-17',
    });
  });

  it('moves the start back by calendar months', () => {
    expect(resolveRange('1m').startDate).toBe('2026-06-17');
    expect(resolveRange('3m').startDate).toBe('2026-04-17');
    expect(resolveRange('6m').startDate).toBe('2026-01-17');
  });

  it('moves the start back by a calendar year', () => {
    expect(resolveRange('1y').startDate).toBe('2025-07-17');
  });

  it('anchors the year-to-date start on January 1st', () => {
    expect(resolveRange('ytd').startDate).toBe('2026-01-01');
  });

  it('anchors on the local calendar day near midnight, not on UTC', () => {
    vi.setSystemTime(new Date('2026-07-20T02:00:00Z'));

    expect(resolveRange('5d')).toEqual({
      startDate: '2026-07-11',
      endDate: '2026-07-16',
    });
  });
});

describe('matchPreset', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-20T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the preset whose resolved range matches exactly', () => {
    expect(matchPreset(resolveRange('3m'))).toBe('3m');
  });

  it('returns null when the end is more recent than the D-3 anchor', () => {
    expect(
      matchPreset({ startDate: '2026-07-15', endDate: '2026-07-20' }),
    ).toBeNull();
  });

  it('returns null for a range that matches no preset', () => {
    expect(
      matchPreset({ startDate: '2026-02-03', endDate: '2026-05-11' }),
    ).toBeNull();
  });
});

describe('isValidRange', () => {
  const maxEndDate = '2026-07-17';

  it('accepts a coherent range ending exactly on the max end date', () => {
    expect(
      isValidRange(
        { startDate: '2026-07-12', endDate: '2026-07-17' },
        maxEndDate,
      ),
    ).toBe(true);
  });

  it('rejects a start after the end', () => {
    expect(
      isValidRange(
        { startDate: '2026-07-16', endDate: '2026-07-12' },
        maxEndDate,
      ),
    ).toBe(false);
  });

  it('rejects a start equal to the end', () => {
    expect(
      isValidRange(
        { startDate: '2026-07-16', endDate: '2026-07-16' },
        maxEndDate,
      ),
    ).toBe(false);
  });

  it('rejects missing dates', () => {
    expect(isValidRange({ startDate: '', endDate: '' }, maxEndDate)).toBe(
      false,
    );
  });

  it('rejects an end past the max end date', () => {
    expect(
      isValidRange(
        { startDate: '2026-07-15', endDate: '2026-07-18' },
        maxEndDate,
      ),
    ).toBe(false);
  });
});

describe('validateRange', () => {
  const maxEndDate = '2026-07-17';

  it('returns no errors for a coherent range', () => {
    expect(
      validateRange(
        { startDate: '2026-07-12', endDate: '2026-07-17' },
        maxEndDate,
      ),
    ).toEqual({ startError: null, endError: null });
  });

  it('flags the start when it is not before the end', () => {
    const { startError } = validateRange(
      { startDate: '2026-07-16', endDate: '2026-07-16' },
      maxEndDate,
    );

    expect(startError).not.toBeNull();
  });

  it('flags the end when it is past the max end date', () => {
    const { endError } = validateRange(
      { startDate: '2026-07-15', endDate: '2026-07-25' },
      maxEndDate,
    );

    expect(endError).not.toBeNull();
  });
});
