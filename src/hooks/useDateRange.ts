import { useState } from 'react';
import {
  resolveRange,
  type DateRange,
  type RangePreset,
} from '@/lib/dateRange';

type ActivePreset = RangePreset | 'custom' | null;

const emptyRange: DateRange = { startDate: '', endDate: '' };

export function useDateRange() {
  const [range, setRange] = useState<DateRange>(emptyRange);
  const [activePreset, setActivePreset] = useState<ActivePreset>(null);

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
