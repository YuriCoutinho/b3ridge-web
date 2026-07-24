import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { ApiError, request } from '@/services/client';

const schema = z.object({ value: z.number() });

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
  it('returns the parsed data when the response matches the schema', async () => {
    stubFetch({ value: 42 });

    await expect(request('/path', schema)).resolves.toEqual({ value: 42 });
  });

  it('throws an ApiError carrying the status when the response is not ok', async () => {
    stubFetch({}, false, 503);

    await expect(request('/path', schema)).rejects.toBeInstanceOf(ApiError);
    await expect(request('/path', schema)).rejects.toMatchObject({
      status: 503,
    });
  });

  it('throws an ApiError with 502 when the response fails validation', async () => {
    stubFetch({ value: 'not-a-number' });

    await expect(request('/path', schema)).rejects.toMatchObject({
      name: 'ApiError',
      status: 502,
    });
  });
});
