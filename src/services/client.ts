import { env } from '../config/env';

const REQUEST_TIMEOUT = 10000;

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

  return response.json() as Promise<T>;
}
