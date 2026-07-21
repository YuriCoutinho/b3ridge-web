import { useState } from 'react';
import {
  matchPreset,
  resolveRange,
  type DateRange,
  type RangePreset,
} from '@/lib/dateRange';

type ActivePreset = RangePreset | null;

const defaultPreset: RangePreset = '5d';

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
    setActivePreset(matchPreset(next));
  }

  return { range, activePreset, applyPreset, changeRange };
}
