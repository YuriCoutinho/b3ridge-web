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

  it('anchors the end at D-1 for every preset', () => {
    expect(resolveRange('5d').endDate).toBe('2026-07-19');
    expect(resolveRange('ytd').endDate).toBe('2026-07-19');
  });

  it('moves the start back by 5 days', () => {
    expect(resolveRange('5d')).toEqual({
      startDate: '2026-07-14',
      endDate: '2026-07-19',
    });
  });

  it('moves the start back by calendar months', () => {
    expect(resolveRange('1m').startDate).toBe('2026-06-19');
    expect(resolveRange('3m').startDate).toBe('2026-04-19');
    expect(resolveRange('6m').startDate).toBe('2026-01-19');
  });

  it('moves the start back by a calendar year', () => {
    expect(resolveRange('1y').startDate).toBe('2025-07-19');
  });

  it('anchors the year-to-date start on January 1st', () => {
    expect(resolveRange('ytd').startDate).toBe('2026-01-01');
  });

  it('anchors on the local calendar day near midnight, not on UTC', () => {
    vi.setSystemTime(new Date('2026-07-20T02:00:00Z'));

    expect(resolveRange('5d')).toEqual({
      startDate: '2026-07-13',
      endDate: '2026-07-18',
    });
  });
});

describe('isValidRange', () => {
  const today = '2026-07-20';

  it('accepts a coherent range', () => {
    expect(
      isValidRange({ startDate: '2026-07-12', endDate: '2026-07-19' }, today),
    ).toBe(true);
  });

  it('rejects a start after the end', () => {
    expect(
      isValidRange({ startDate: '2026-07-19', endDate: '2026-07-12' }, today),
    ).toBe(false);
  });

  it('rejects a start equal to the end', () => {
    expect(
      isValidRange({ startDate: '2026-07-19', endDate: '2026-07-19' }, today),
    ).toBe(false);
  });

  it('rejects missing dates', () => {
    expect(isValidRange({ startDate: '', endDate: '' }, today)).toBe(false);
  });

  it('rejects an end on today', () => {
    expect(
      isValidRange({ startDate: '2026-07-19', endDate: today }, today),
    ).toBe(false);
  });

  it('rejects an end in the future', () => {
    expect(
      isValidRange({ startDate: '2026-07-19', endDate: '2026-07-21' }, today),
    ).toBe(false);
  });
});
