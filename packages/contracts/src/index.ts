import { z } from 'zod';

export const tickerSchema = z.object({
  symbol: z.string(),
  name: z.string(),
});
export type Ticker = z.infer<typeof tickerSchema>;

export const tickersResponseSchema = z.array(tickerSchema);
export type TickersResponse = z.infer<typeof tickersResponseSchema>;

// B3 tickers: 5-7 uppercase alphanumeric chars (e.g. PETR4, BPAC11, KLBN11F)
export const tickerSymbolSchema = z
  .string()
  .regex(/^[A-Z0-9]{5,7}$/, 'invalid ticker symbol');

export const maxBatchSymbols = 4;

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

export const tickerHistoryBatchQuerySchema = z
  .object({
    symbols: z
      .string()
      .transform((value) => [
        ...new Set(value.split(',').map((symbol) => symbol.trim())),
      ])
      .pipe(z.array(tickerSymbolSchema).min(1).max(maxBatchSymbols)),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
  })
  .refine((range) => range.startDate < range.endDate, {
    message: 'startDate must be before endDate',
  })
  .refine((range) => range.endDate <= maxEndDateIso(), {
    message: `endDate must be at most ${dataLagDays} days ago`,
  });
export type TickerHistoryBatchQuery = z.infer<
  typeof tickerHistoryBatchQuerySchema
>;

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

export const historyErrorReasonSchema = z.enum(['not_found', 'upstream_error']);
export type HistoryErrorReason = z.infer<typeof historyErrorReasonSchema>;

export const tickerHistoryResultSchema = z.discriminatedUnion('status', [
  z.object({
    symbol: tickerSymbolSchema,
    status: z.literal('ok'),
    history: z.array(tickerHistoryPointSchema),
  }),
  z.object({
    symbol: tickerSymbolSchema,
    status: z.literal('error'),
    reason: historyErrorReasonSchema,
  }),
]);
export type TickerHistoryResult = z.infer<typeof tickerHistoryResultSchema>;

export const tickerHistoryBatchResponseSchema = z.array(
  tickerHistoryResultSchema,
);
export type TickerHistoryBatchResponse = z.infer<
  typeof tickerHistoryBatchResponseSchema
>;
