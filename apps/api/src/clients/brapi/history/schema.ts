import { z } from 'zod';
import { tickerHistoryPointSchema } from '@b3ridge/contracts';

export const brapiHistorySchema = z.object({
  results: z.array(
    z.object({ historicalDataPrice: z.array(tickerHistoryPointSchema) }),
  ),
});
