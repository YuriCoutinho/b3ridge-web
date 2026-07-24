import {
  dataLagDays,
  maxEndDateIso,
  type TickerHistoryQuery,
} from '@b3ridge/contracts';
import {
  format,
  isValid,
  parse,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';

export type DateRange = TickerHistoryQuery;

export { dataLagDays, maxEndDateIso };

const isoFormat = 'yyyy-MM-dd';

export type RangePreset = '5d' | '1m' | '3m' | '6m' | '1y' | 'ytd';

export const defaultPreset: RangePreset = '5d';

export const rangePresets: { id: RangePreset; label: string }[] = [
  { id: '5d', label: '5D' },
  { id: '1m', label: '1M' },
  { id: '3m', label: '3M' },
  { id: '6m', label: '6M' },
  { id: '1y', label: '1A' },
  { id: 'ytd', label: 'YTD' },
];

const startResolvers: Record<RangePreset, (endDate: Date) => Date> = {
  '5d': (endDate) => subDays(endDate, 5),
  '1m': (endDate) => subMonths(endDate, 1),
  '3m': (endDate) => subMonths(endDate, 3),
  '6m': (endDate) => subMonths(endDate, 6),
  '1y': (endDate) => subYears(endDate, 1),
  ytd: (endDate) => startOfYear(endDate),
};

function maxEndDate(): Date {
  return isoToDate(maxEndDateIso())!;
}

export function resolveRange(preset: RangePreset): DateRange {
  const endDate = maxEndDate();
  const startDate = startResolvers[preset](endDate);
  return { startDate: dateToIso(startDate), endDate: dateToIso(endDate) };
}

export function matchPreset(range: DateRange): RangePreset | null {
  const preset = rangePresets.find((preset) => {
    const resolved = resolveRange(preset.id);
    return (
      resolved.startDate === range.startDate &&
      resolved.endDate === range.endDate
    );
  });

  return preset?.id ?? null;
}

export function isoToDate(iso: string): Date | undefined {
  const parsed = parse(iso, isoFormat, new Date());
  return isValid(parsed) ? parsed : undefined;
}

export function dateToIso(date: Date): string {
  return format(date, isoFormat);
}

export interface RangeErrors {
  startError: string | null;
  endError: string | null;
}

const startAfterEndMessage = 'A data inicial deve ser anterior à final.';
const endAfterMaxMessage = `A data final deve ser de no máximo ${dataLagDays} dias atrás.`;

export function validateRange(
  { startDate, endDate }: DateRange,
  maxEndDate: string,
): RangeErrors {
  const endError = endDate && endDate > maxEndDate ? endAfterMaxMessage : null;
  const startError =
    startDate && endDate && startDate >= endDate ? startAfterEndMessage : null;

  return { startError, endError };
}

export function isValidRange(range: DateRange, maxEndDate: string): boolean {
  const { startError, endError } = validateRange(range, maxEndDate);
  const hasBothDates = Boolean(range.startDate && range.endDate);

  return hasBothDates && !startError && !endError;
}
