import { z } from 'zod';

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
  url: string,
  schema: z.ZodType<T>,
  headers?: HeadersInit,
): Promise<T> {
  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  });

  if (!response.ok) {
    throw new ApiError(
      `Request failed (${response.status}) at ${url}`,
      response.status,
    );
  }

  const parsed = schema.safeParse(await response.json());
  if (!parsed.success) {
    throw new ApiError(
      `Invalid response shape at ${url}`,
      INVALID_SHAPE_STATUS,
    );
  }

  return parsed.data;
}
