export interface DateRange {
  startDate: string;
  endDate: string;
}

export type RangePreset = '5d' | '1m' | '3m' | '6m' | '1y' | 'ytd';

export const rangePresets: { id: RangePreset; label: string }[] = [
  { id: '5d', label: '5D' },
  { id: '1m', label: '1M' },
  { id: '3m', label: '3M' },
  { id: '6m', label: '6M' },
  { id: '1y', label: '1A' },
  { id: 'ytd', label: 'YTD' },
];

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function subtractDays(date: Date, days: number): Date {
  const clonedDate = new Date(date);
  const shiftedDate = new Date(
    clonedDate.getFullYear(),
    clonedDate.getMonth(),
    clonedDate.getDate() - days,
  );
  return shiftedDate;
}

function subtractMonths(date: Date, months: number): Date {
  const clonedDate = new Date(date);
  const shiftedDate = new Date(
    clonedDate.getFullYear(),
    clonedDate.getMonth() - months,
    clonedDate.getDate(),
  );
  return shiftedDate;
}

function subtractYears(date: Date, years: number): Date {
  const clonedDate = new Date(date);
  const shiftedDate = new Date(
    clonedDate.getFullYear() - years,
    clonedDate.getMonth(),
    clonedDate.getDate(),
  );
  return shiftedDate;
}

function startOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

const startResolvers: Record<RangePreset, (endDate: Date) => Date> = {
  '5d': (endDate) => subtractDays(endDate, 5),
  '1m': (endDate) => subtractMonths(endDate, 1),
  '3m': (endDate) => subtractMonths(endDate, 3),
  '6m': (endDate) => subtractMonths(endDate, 6),
  '1y': (endDate) => subtractYears(endDate, 1),
  ytd: (endDate) => startOfYear(endDate),
};

export function resolveRange(preset: RangePreset): DateRange {
  const endDate = subtractDays(new Date(), 1);
  const startDate = startResolvers[preset](endDate);
  return { startDate: toIsoDate(startDate), endDate: toIsoDate(endDate) };
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

export function todayIso(): string {
  return toIsoDate(new Date());
}

export function isValidRange(
  { startDate, endDate }: DateRange,
  today: string,
): boolean {
  const hasBothDates = Boolean(startDate && endDate);
  const startsBeforeEnd = startDate < endDate;
  const endIsBeforeToday = endDate < today;

  return hasBothDates && startsBeforeEnd && endIsBeforeToday;
}
