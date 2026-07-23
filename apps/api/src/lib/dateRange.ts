export interface DateRange {
  startDate: string;
  endDate: string;
}

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function splitDateRange(
  { startDate, endDate }: DateRange,
  maxDays: number,
): DateRange[] {
  const end = new Date(`${endDate}T00:00:00Z`);
  let chunkStart = new Date(`${startDate}T00:00:00Z`);

  const chunks: DateRange[] = [];
  while (chunkStart <= end) {
    const chunkEnd = new Date(chunkStart);
    chunkEnd.setUTCDate(chunkEnd.getUTCDate() + maxDays);
    const boundedEnd = chunkEnd < end ? chunkEnd : end;

    chunks.push({ startDate: toIso(chunkStart), endDate: toIso(boundedEnd) });

    chunkStart = new Date(boundedEnd);
    chunkStart.setUTCDate(chunkStart.getUTCDate() + 1);
  }

  return chunks;
}
