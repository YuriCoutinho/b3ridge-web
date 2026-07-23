import type { z } from 'zod';
import { env } from '../../config/env.js';
import { toMessage } from '../../lib/toMessage.js';
import { BrapiError } from './errors.js';

const BRAPI_BASE_URL = 'https://brapi.dev/api';
const REQUEST_TIMEOUT_MS = 8000;

function brapiHeaders(): Record<string, string> {
  return env.brapiToken ? { Authorization: `Bearer ${env.brapiToken}` } : {};
}

export async function brapiGet<T>(
  path: string,
  query: Record<string, string>,
  schema: z.ZodType<T>,
): Promise<T> {
  const url = `${BRAPI_BASE_URL}${path}?${new URLSearchParams(query)}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: brapiHeaders(),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new BrapiError(`brapi request failed: ${toMessage(error)}`, 503);
  }

  if (!response.ok) {
    throw new BrapiError(`brapi responded ${response.status}`, 502);
  }

  const parsed = schema.safeParse(await response.json());
  if (!parsed.success) {
    throw new BrapiError('unexpected brapi payload shape', 502);
  }

  return parsed.data;
}
