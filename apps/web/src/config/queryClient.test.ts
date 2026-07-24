import { describe, expect, it } from 'vitest';

import { shouldRetry } from '@/config/queryClient';
import { ApiError } from '@/services/client';

describe('shouldRetry', () => {
  it('does not retry client errors (4xx)', () => {
    expect(shouldRetry(0, new ApiError('not found', 404))).toBe(false);
  });

  it('retries server errors until the max is reached', () => {
    const error = new ApiError('server error', 500);

    expect(shouldRetry(0, error)).toBe(true);
    expect(shouldRetry(1, error)).toBe(true);
    expect(shouldRetry(2, error)).toBe(false);
  });

  it('retries generic errors that are not ApiError', () => {
    expect(shouldRetry(0, new Error('network down'))).toBe(true);
  });
});
