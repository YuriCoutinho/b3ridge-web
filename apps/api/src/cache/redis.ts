import { Redis } from 'ioredis';

import { env } from '../config/env.js';
import { toMessage } from '../lib/toMessage.js';

export const redis = new Redis(env.redisUrl);

redis.on('error', (error) => {
  console.error('Redis connection error:', toMessage(error));
});

export async function getJson<T>(key: string): Promise<T | null> {
  try {
    const cached = await redis.get(key);
    return cached ? (JSON.parse(cached) as T) : null;
  } catch (error) {
    console.error(`Redis read failed for "${key}":`, toMessage(error));
    return null;
  }
}

export async function setJson(
  key: string,
  value: unknown,
  ttlSeconds: number,
): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch (error) {
    console.error(`Redis write failed for "${key}":`, toMessage(error));
  }
}
