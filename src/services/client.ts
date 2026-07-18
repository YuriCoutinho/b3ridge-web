import { env } from '../config/env';

export async function request<T>(path: string, headers?: {}): Promise<T> {
  const res = await fetch(`${env.apiUrl}${path}`, { headers });

  if (!res.ok) {
    throw new Error(`Request failed (${res.status}) at ${path}`);
  }

  return res.json() as Promise<T>;
}
