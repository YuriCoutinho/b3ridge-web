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
