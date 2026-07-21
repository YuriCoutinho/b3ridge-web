import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useDateRange } from '@/hooks/useDateRange';

describe('useDateRange', () => {
  it('starts with no active preset', () => {
    const { result } = renderHook(() => useDateRange());

    expect(result.current.activePreset).toBeNull();
  });

  it('applyPreset switches the active preset', () => {
    const { result } = renderHook(() => useDateRange());

    act(() => result.current.applyPreset('1m'));

    expect(result.current.activePreset).toBe('1m');
  });

  it('changeRange marks the preset as custom and stores the given range', () => {
    const { result } = renderHook(() => useDateRange());
    const range = { startDate: '2026-01-01', endDate: '2026-01-31' };

    act(() => result.current.changeRange(range));

    expect(result.current.activePreset).toBe('custom');
    expect(result.current.range).toEqual(range);
  });
});
