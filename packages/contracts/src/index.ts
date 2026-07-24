import { z } from 'zod';

export const tickerSchema = z.object({
  symbol: z.string(),
  name: z.string(),
});
export type Ticker = z.infer<typeof tickerSchema>;

export const tickersResponseSchema = z.array(tickerSchema);
export type TickersResponse = z.infer<typeof tickersResponseSchema>;

export const dataLagDays = 3;

const marketTimeZone = 'America/Sao_Paulo';

export function maxEndDateIso(now: Date = new Date()): string {
  const marketToday = new Intl.DateTimeFormat('en-CA', {
    timeZone: marketTimeZone,
  }).format(now);
  const [year, month, day] = marketToday.split('-').map(Number);
  const anchored = new Date(Date.UTC(year, month - 1, day - dataLagDays));
  return anchored.toISOString().slice(0, 10);
}

export const tickerHistoryQuerySchema = z
  .object({
    startDate: z.iso.date(),
    endDate: z.iso.date(),
  })
  .refine((range) => range.startDate < range.endDate, {
    message: 'startDate must be before endDate',
  })
  .refine((range) => range.endDate <= maxEndDateIso(), {
    message: `endDate must be at most ${dataLagDays} days ago`,
  });
export type TickerHistoryQuery = z.infer<typeof tickerHistoryQuerySchema>;

export const tickerHistoryPointSchema = z.object({
  date: z.number(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number(),
  adjustedClose: z.number(),
});
export type TickerHistoryPoint = z.infer<typeof tickerHistoryPointSchema>;

export const tickerHistoryResponseSchema = z.array(tickerHistoryPointSchema);
export type TickerHistoryResponse = z.infer<typeof tickerHistoryResponseSchema>;
