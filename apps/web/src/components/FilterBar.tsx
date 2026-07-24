import type { SubmitEvent } from 'react';

import { DateRangeFields } from '@/components/ticker/date-range/DateRangeFields';
import { RangePresets } from '@/components/ticker/date-range/RangePresets';
import { TickerSelector } from '@/components/ticker/selector/TickerSelector';
import { Button } from '@/components/ui/button';
import { useDateRange } from '@/hooks/useDateRange';
import { useTickerSelection } from '@/hooks/useTickerSelection';
import {
  isValidRange,
  maxEndDateIso,
  validateRange,
  type DateRange,
} from '@/lib/dateRange';
import type { Ticker } from '@/services/tickers';

interface FilterBarProps {
  onApply: (tickers: Ticker[], range: DateRange) => void;
}

export function FilterBar({ onApply }: FilterBarProps) {
  const { selected, setSelected } = useTickerSelection();
  const { range, activePreset, applyPreset, changeRange } = useDateRange();

  const hasSelection = selected.length > 0;
  const rangeErrors = validateRange(range, maxEndDateIso());
  const canSubmit = hasSelection && isValidRange(range, maxEndDateIso());

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSubmit) {
      onApply(selected, range);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-start gap-x-6 gap-y-4 border-b border-sidebar-border bg-sidebar px-4 py-4 text-sidebar-foreground sm:px-6"
    >
      <TickerSelector selected={selected} onSelectionChange={setSelected} />

      <RangePresets
        value={activePreset}
        onSelectPreset={applyPreset}
        disabled={!hasSelection}
      />

      <div className="flex flex-wrap items-end gap-x-6 gap-y-4 max-[442px]:w-full">
        <DateRangeFields
          range={range}
          onChangeRange={changeRange}
          errors={rangeErrors}
          disabled={!hasSelection}
        />

        <Button
          type="submit"
          disabled={!canSubmit}
          className="max-[442px]:h-10 max-[442px]:w-full"
        >
          Consultar
        </Button>
      </div>
    </form>
  );
}
