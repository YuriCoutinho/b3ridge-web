import { maxEndDateIso, minStartDateIso } from '@b3ridge/contracts';
import type { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getTickerHistories } from '../services/history.service.js';
import { getHistory } from './history.controller.js';

vi.mock('../services/history.service.js', () => ({
  getTickerHistories: vi.fn(),
}));

function isoDaysBefore(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

const serviceMock = vi.mocked(getTickerHistories);
const validRange = {
  startDate: isoDaysBefore(maxEndDateIso(), 30),
  endDate: maxEndDateIso(),
};

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

  it('rejects a start beyond the max lookback with 400', async () => {
    const res = mockRes();

    await getHistory(
      requestWith({
        symbols: 'PETR4',
        startDate: isoDaysBefore(minStartDateIso(), 1),
        endDate: maxEndDateIso(),
      }),
      res,
      vi.fn(),
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(serviceMock).not.toHaveBeenCalled();
  });
});
