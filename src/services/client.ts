import { env } from '../config/env';

export async function request<TResponse>(
  path: string,
  headers?: HeadersInit,
): Promise<TResponse> {
  const response = await fetch(`${env.apiUrl}${path}`, { headers });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) at ${path}`);
  }

  return response.json() as Promise<TResponse>;
}
