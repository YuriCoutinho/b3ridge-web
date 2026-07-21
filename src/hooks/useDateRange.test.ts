import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useDateRange } from '@/hooks/useDateRange';
import { resolveRange } from '@/lib/dateRange';

describe('useDateRange', () => {
  it('starts with the 5d preset active and a resolved range', () => {
    const { result } = renderHook(() => useDateRange());

    expect(result.current.activePreset).toBe('5d');
    expect(result.current.range.startDate).not.toBe('');
    expect(result.current.range.endDate).not.toBe('');
  });

  it('applyPreset switches the active preset', () => {
    const { result } = renderHook(() => useDateRange());

    act(() => result.current.applyPreset('1m'));

    expect(result.current.activePreset).toBe('1m');
  });

  it('changeRange clears the active preset when the range matches no preset', () => {
    const { result } = renderHook(() => useDateRange());
    const range = { startDate: '2026-01-01', endDate: '2026-01-31' };

    act(() => result.current.applyPreset('1m'));
    act(() => result.current.changeRange(range));

    expect(result.current.activePreset).toBeNull();
    expect(result.current.range).toEqual(range);
  });

  it('changeRange re-activates the preset when the range matches one exactly', () => {
    const { result } = renderHook(() => useDateRange());

    act(() => result.current.changeRange(resolveRange('3m')));

    expect(result.current.activePreset).toBe('3m');
  });
});
