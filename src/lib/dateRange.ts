export interface DateRange {
  startDate: string;
  endDate: string;
}

export type RangePreset = '7d' | '1m' | '3m';

export const rangePresets: { id: RangePreset; label: string; days: number }[] =
  [
    { id: '7d', label: '7 dias', days: 7 },
    { id: '1m', label: '1 mês', days: 30 },
    { id: '3m', label: '3 meses', days: 90 },
  ];

export const defaultPreset: RangePreset = '7d';

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function subtractDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

export function resolveRange(preset: RangePreset): DateRange {
  const { days } = rangePresets.find((item) => item.id === preset)!;
  const endDate = subtractDays(new Date(), 1);
  const startDate = subtractDays(endDate, days);
  return { startDate: toIsoDate(startDate), endDate: toIsoDate(endDate) };
}

export function isValidRange({ startDate, endDate }: DateRange): boolean {
  return Boolean(startDate && endDate && startDate <= endDate);
}
