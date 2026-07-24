import { tickerHistoryPointSchema } from '@b3ridge/contracts';
import { z } from 'zod';

export const brapiHistorySchema = z.object({
  results: z.array(
    z.object({ historicalDataPrice: z.array(tickerHistoryPointSchema) }),
  ),
});
