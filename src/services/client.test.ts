import { describe, it, expect, afterEach, vi } from 'vitest';
import { request, ApiError } from '@/services/client';

function stubFetch(body: unknown, ok = true, status = 200) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok, status, json: async () => body }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('request', () => {
  it('returns the parsed json when the response is ok', async () => {
    stubFetch({ value: 42 });

    await expect(request('/path')).resolves.toEqual({ value: 42 });
  });

  it('throws an ApiError carrying the status when the response is not ok', async () => {
    stubFetch({}, false, 503);

    await expect(request('/path')).rejects.toBeInstanceOf(ApiError);
    await expect(request('/path')).rejects.toMatchObject({ status: 503 });
  });
});
