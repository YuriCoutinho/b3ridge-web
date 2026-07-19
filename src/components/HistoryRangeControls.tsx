import type { ChangeEvent } from 'react';
import {
  rangePresets,
  type DateRange,
  type RangePreset,
} from '@/lib/dateRange';

interface HistoryRangeControlsProps {
  range: DateRange;
  activePreset: RangePreset | 'custom';
  onApplyPreset: (preset: RangePreset) => void;
  onChangeRange: (range: DateRange) => void;
}

export function HistoryRangeControls({
  range,
  activePreset,
  onApplyPreset,
  onChangeRange,
}: HistoryRangeControlsProps) {
  function handleStartDateChange(event: ChangeEvent<HTMLInputElement>) {
    onChangeRange({ ...range, startDate: event.target.value });
  }

  function handleEndDateChange(event: ChangeEvent<HTMLInputElement>) {
    onChangeRange({ ...range, endDate: event.target.value });
  }

  return (
    <div>
      <div>
        {rangePresets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            aria-pressed={activePreset === preset.id}
            onClick={() => onApplyPreset(preset.id)}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <label htmlFor="start-date">Início</label>
      <input
        id="start-date"
        type="date"
        value={range.startDate}
        onChange={handleStartDateChange}
      />
      <label htmlFor="end-date">Fim</label>
      <input
        id="end-date"
        type="date"
        value={range.endDate}
        onChange={handleEndDateChange}
      />
    </div>
  );
}
