import { z } from 'zod';

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
