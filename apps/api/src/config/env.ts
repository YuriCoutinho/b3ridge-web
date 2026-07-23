import { z } from 'zod';

try {
  process.loadEnvFile('.env');
} catch {
  // No local .env file; rely on the process environment.
}

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  CORS_ORIGINS: z.string().min(1),
  REDIS_URL: z.string().min(1),
  BRAPI_TOKEN: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.issues);
  process.exit(1);
}

export const env = {
  port: parsed.data.PORT,
  corsOrigins: parsed.data.CORS_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  redisUrl: parsed.data.REDIS_URL,
  brapiToken: parsed.data.BRAPI_TOKEN,
};
