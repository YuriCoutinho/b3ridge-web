import { z } from 'zod';

export const tickerSchema = z.object({
  symbol: z.string(),
  name: z.string(),
});
export type Ticker = z.infer<typeof tickerSchema>;

export const tickersResponseSchema = z.array(tickerSchema);
export type TickersResponse = z.infer<typeof tickersResponseSchema>;
