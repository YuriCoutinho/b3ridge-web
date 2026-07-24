import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  isValidRange,
  maskDateInput,
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
  const minStartDate = '2024-07-17';

  it('accepts a coherent range ending exactly on the max end date', () => {
    expect(
      isValidRange(
        { startDate: '2026-07-12', endDate: '2026-07-17' },
        maxEndDate,
        minStartDate,
      ),
    ).toBe(true);
  });

  it('accepts a start exactly on the min start date', () => {
    expect(
      isValidRange(
        { startDate: '2024-07-17', endDate: '2026-07-17' },
        maxEndDate,
        minStartDate,
      ),
    ).toBe(true);
  });

  it('rejects a start after the end', () => {
    expect(
      isValidRange(
        { startDate: '2026-07-16', endDate: '2026-07-12' },
        maxEndDate,
        minStartDate,
      ),
    ).toBe(false);
  });

  it('rejects a start equal to the end', () => {
    expect(
      isValidRange(
        { startDate: '2026-07-16', endDate: '2026-07-16' },
        maxEndDate,
        minStartDate,
      ),
    ).toBe(false);
  });

  it('rejects missing dates', () => {
    expect(
      isValidRange({ startDate: '', endDate: '' }, maxEndDate, minStartDate),
    ).toBe(false);
  });

  it('rejects an end past the max end date', () => {
    expect(
      isValidRange(
        { startDate: '2026-07-15', endDate: '2026-07-18' },
        maxEndDate,
        minStartDate,
      ),
    ).toBe(false);
  });

  it('rejects a start before the min start date', () => {
    expect(
      isValidRange(
        { startDate: '2024-07-16', endDate: '2026-07-17' },
        maxEndDate,
        minStartDate,
      ),
    ).toBe(false);
  });
});

describe('validateRange', () => {
  const maxEndDate = '2026-07-17';
  const minStartDate = '2024-07-17';

  it('returns no errors for a coherent range', () => {
    expect(
      validateRange(
        { startDate: '2026-07-12', endDate: '2026-07-17' },
        maxEndDate,
        minStartDate,
      ),
    ).toEqual({ startError: null, endError: null });
  });

  it('flags the start when it is not before the end', () => {
    const { startError } = validateRange(
      { startDate: '2026-07-16', endDate: '2026-07-16' },
      maxEndDate,
      minStartDate,
    );

    expect(startError).not.toBeNull();
  });

  it('flags the end when it is past the max end date', () => {
    const { endError } = validateRange(
      { startDate: '2026-07-15', endDate: '2026-07-25' },
      maxEndDate,
      minStartDate,
    );

    expect(endError).not.toBeNull();
  });

  it('flags the start when it is before the min start date', () => {
    const { startError } = validateRange(
      { startDate: '2024-01-01', endDate: '2026-07-17' },
      maxEndDate,
      minStartDate,
    );

    expect(startError).not.toBeNull();
  });
});

describe('maskDateInput', () => {
  it('inserts slashes as the digits are typed', () => {
    expect(maskDateInput('2')).toBe('2');
    expect(maskDateInput('22')).toBe('22');
    expect(maskDateInput('2207')).toBe('22/07');
    expect(maskDateInput('22072026')).toBe('22/07/2026');
  });

  it('strips non-digit characters', () => {
    expect(maskDateInput('01/07/020dd22')).toBe('01/07/0202');
    expect(maskDateInput('ab-cd')).toBe('');
  });

  it('caps the input at eight digits', () => {
    expect(maskDateInput('220720261999')).toBe('22/07/2026');
  });

  it('keeps an already formatted date unchanged', () => {
    expect(maskDateInput('22/07/2026')).toBe('22/07/2026');
  });
});
