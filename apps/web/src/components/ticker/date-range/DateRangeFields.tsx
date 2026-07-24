import { addDays, subDays } from 'date-fns';
import type { Matcher } from 'react-day-picker';

import { DateField } from '@/components/ticker/date-range/DateField';
import {
  dataLagDays,
  isoToDate,
  maxEndDateIso,
  type DateRange,
  type RangeErrors,
} from '@/lib/dateRange';

interface DateRangeFieldsProps {
  range: DateRange;
  onChangeRange: (next: DateRange) => void;
  errors: RangeErrors;
  disabled?: boolean;
}

export function DateRangeFields({
  range,
  onChangeRange,
  errors,
  disabled,
}: DateRangeFieldsProps) {
  const maxEndDate = isoToDate(maxEndDateIso())!;
  const startDate = isoToDate(range.startDate);
  const endDate = isoToDate(range.endDate);

  const startDisabledDays: Matcher = {
    after: endDate ? subDays(endDate, 1) : maxEndDate,
  };
  const endDisabledDays: Matcher[] = [
    { after: maxEndDate },
    ...(startDate ? [{ before: addDays(startDate, 1) }] : []),
  ];

  return (
    <div className="flex gap-3 max-[442px]:w-full">
      <DateField
        label="Início"
        value={range.startDate}
        onChange={(startDate) => onChangeRange({ ...range, startDate })}
        error={errors.startError}
        disabled={disabled}
        disabledDays={startDisabledDays}
        defaultMonth={maxEndDate}
      />
      <DateField
        label="Fim"
        value={range.endDate}
        onChange={(endDate) => onChangeRange({ ...range, endDate })}
        error={errors.endError}
        disabled={disabled}
        disabledDays={endDisabledDays}
        defaultMonth={maxEndDate}
        hint={`Cotações com defasagem de até ${dataLagDays} dias.`}
      />
    </div>
  );
}
