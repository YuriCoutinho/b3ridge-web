import type { TickerHistoryQuery } from '@b3ridge/contracts';

export type DateRange = TickerHistoryQuery;

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function splitDateRange(
  { startDate, endDate }: DateRange,
  maxDays: number,
): DateRange[] {
  const end = new Date(`${endDate}T00:00:00Z`);
  let segmentStart = new Date(`${startDate}T00:00:00Z`);

  const dateRangeSegments: DateRange[] = [];
  while (segmentStart <= end) {
    const segmentEnd = new Date(segmentStart);
    segmentEnd.setUTCDate(segmentEnd.getUTCDate() + maxDays);
    const boundedEnd = segmentEnd < end ? segmentEnd : end;

    dateRangeSegments.push({
      startDate: toIso(segmentStart),
      endDate: toIso(boundedEnd),
    });

    segmentStart = new Date(boundedEnd);
    segmentStart.setUTCDate(segmentStart.getUTCDate() + 1);
  }

  return dateRangeSegments;
}
