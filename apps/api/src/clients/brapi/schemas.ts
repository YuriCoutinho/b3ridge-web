import { z } from 'zod';

const brapiTickerSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  longName: z.string().nullish(),
});
export type BrapiTicker = z.infer<typeof brapiTickerSchema>;

export const brapiPageSchema = z.object({
  results: z.array(brapiTickerSchema),
  pagination: z.object({ totalItems: z.number() }),
});
export type BrapiPage = z.infer<typeof brapiPageSchema>;

const brapiHistoryPointSchema = z.object({
  date: z.number(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number(),
  adjustedClose: z.number(),
});
export type BrapiHistoryPoint = z.infer<typeof brapiHistoryPointSchema>;

export const brapiHistorySchema = z.object({
  results: z.array(
    z.object({ historicalDataPrice: z.array(brapiHistoryPointSchema) }),
  ),
});
export type BrapiHistory = z.infer<typeof brapiHistorySchema>;
