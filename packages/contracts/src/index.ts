import { z } from 'zod';

export const tickerSchema = z.object({
  symbol: z.string(),
  name: z.string(),
});
export type Ticker = z.infer<typeof tickerSchema>;

export const tickersResponseSchema = z.array(tickerSchema);
export type TickersResponse = z.infer<typeof tickersResponseSchema>;

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
