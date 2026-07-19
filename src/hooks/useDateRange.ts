import { useState } from 'react';
import {
  defaultPreset,
  resolveRange,
  type DateRange,
  type RangePreset,
} from '@/lib/dateRange';

type ActivePreset = RangePreset | 'custom';

export function useDateRange() {
  const [range, setRange] = useState<DateRange>(() =>
    resolveRange(defaultPreset),
  );
  const [activePreset, setActivePreset] = useState<ActivePreset>(defaultPreset);

  function applyPreset(preset: RangePreset) {
    setRange(resolveRange(preset));
    setActivePreset(preset);
  }

  function changeRange(next: DateRange) {
    setRange(next);
    setActivePreset('custom');
  }

  return { range, activePreset, applyPreset, changeRange };
}
