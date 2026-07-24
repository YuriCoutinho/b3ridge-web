import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { getTickerHistories } from '../services/history.service.js';
import { getHistory } from './history.controller.js';

vi.mock('../services/history.service.js', () => ({
  getTickerHistories: vi.fn(),
}));

const serviceMock = vi.mocked(getTickerHistories);
const validRange = { startDate: '2024-01-01', endDate: '2024-02-01' };

function mockRes(): Response {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

function requestWith(query: Record<string, string>): Request {
  return { query } as unknown as Request;
}

beforeEach(() => vi.resetAllMocks());

describe('getHistory', () => {
  it('parses the symbols CSV, dedupes, and forwards the range to the service', async () => {
    serviceMock.mockResolvedValue([]);
    const res = mockRes();

    await getHistory(
      requestWith({ symbols: 'PETR4,VALE3,PETR4', ...validRange }),
      res,
      vi.fn(),
    );

    expect(serviceMock).toHaveBeenCalledWith(['PETR4', 'VALE3'], validRange);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('rejects a request over the symbol limit with 400', async () => {
    const res = mockRes();

    await getHistory(
      requestWith({ symbols: 'AAAAA,BBBBB,CCCCC,DDDDD,EEEEE', ...validRange }),
      res,
      vi.fn(),
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(serviceMock).not.toHaveBeenCalled();
  });

  it('rejects an invalid symbol with 400', async () => {
    const res = mockRes();

    await getHistory(
      requestWith({ symbols: 'petr4', ...validRange }),
      res,
      vi.fn(),
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(serviceMock).not.toHaveBeenCalled();
  });
});
