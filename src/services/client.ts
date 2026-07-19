import { z } from 'zod';
import { env } from '../config/env';

const REQUEST_TIMEOUT = 10000;
const INVALID_SHAPE_STATUS = 502;

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  headers?: HeadersInit,
): Promise<T> {
  const response = await fetch(`${env.apiUrl}${path}`, {
    headers,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  });

  if (!response.ok) {
    throw new ApiError(
      `Request failed (${response.status}) at ${path}`,
      response.status,
    );
  }

  const parsed = schema.safeParse(await response.json());
  if (!parsed.success) {
    throw new ApiError(
      `Invalid response shape at ${path}`,
      INVALID_SHAPE_STATUS,
    );
  }

  return parsed.data;
}
