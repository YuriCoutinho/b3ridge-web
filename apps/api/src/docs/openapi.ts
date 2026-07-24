import { z } from 'zod';
import {
  dataLagDays,
  maxBatchSymbols,
  tickerSchema,
  tickerHistoryPointSchema,
  tickerHistoryResultSchema,
} from '@b3ridge/contracts';

type JsonSchema = Record<string, unknown>;

// OpenAPI 3.1 aligns with JSON Schema draft 2020-12, so contract schemas are
// converted directly and become the single source of truth for response shapes.
function component(schema: z.ZodType): JsonSchema {
  const { $schema: _$schema, ...jsonSchema } = z.toJSONSchema(schema, {
    target: 'draft-2020-12',
  }) as JsonSchema & { $schema?: string };
  return jsonSchema;
}

const errorSchema: JsonSchema = {
  type: 'object',
  properties: { error: { type: 'string' } },
  required: ['error'],
};

const errorResponse = (description: string) => ({
  description,
  content: {
    'application/json': { schema: { $ref: '#/components/schemas/Error' } },
  },
});

export const openApiDocument = {
  openapi: '3.1.0',
  info: {
    title: 'b3ridge API',
    version: '1.0.0',
    description:
      'Internal BFF that proxies and caches B3 ticker data from brapi. ' +
      'Architectural decisions and diagrams live in the repository `docs/` folder.',
  },
  servers: [{ url: 'http://localhost:3333', description: 'Local development' }],
  tags: [
    { name: 'Tickers', description: 'Ticker catalog and price history' },
    { name: 'Health', description: 'Liveness probe' },
  ],
  paths: {
    '/healthcheck': {
      get: {
        tags: ['Health'],
        summary: 'Liveness probe',
        description:
          'Not rate limited. Used by orchestrators to check the process is up.',
        responses: {
          200: {
            description: 'Service is up',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    service: { type: 'string', example: 'api' },
                  },
                  required: ['status', 'service'],
                },
              },
            },
          },
        },
      },
    },
    '/api/tickers': {
      get: {
        tags: ['Tickers'],
        summary: 'List the full B3 ticker catalog',
        description:
          'Returns every tradable symbol with a human-readable name, sorted by market cap ' +
          'descending upstream. Cached in Redis for 6h; the first request after expiry ' +
          'fans out across all brapi pages.',
        responses: {
          200: {
            description: 'Ticker catalog',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Ticker' },
                },
              },
            },
          },
          429: errorResponse('Rate limit exceeded (30 requests/minute per IP)'),
          502: errorResponse(
            'Upstream brapi returned an unexpected status or payload',
          ),
          503: errorResponse('Upstream brapi unreachable or timed out'),
        },
      },
    },
    '/api/tickers/history': {
      get: {
        tags: ['Tickers'],
        summary: 'Batch daily price history for up to 4 symbols',
        description:
          'Resolves each symbol independently: a per-symbol upstream failure yields an ' +
          '`error` result instead of failing the whole request (HTTP stays 200). ' +
          'Ranges wider than 90 days are split into segments, fetched in parallel, then ' +
          'merged. Each symbol/range pair is cached in Redis for 6h.',
        parameters: [
          {
            name: 'symbols',
            in: 'query',
            required: true,
            description: `Comma-separated symbols, deduped, 1 to ${maxBatchSymbols}. Each must match /^[A-Z0-9]{5,7}$/.`,
            schema: { type: 'string' },
            example: 'PETR4,VALE3',
          },
          {
            name: 'startDate',
            in: 'query',
            required: true,
            description:
              'Inclusive ISO date (YYYY-MM-DD). Must be strictly before endDate.',
            schema: { type: 'string', format: 'date' },
            example: '2026-01-02',
          },
          {
            name: 'endDate',
            in: 'query',
            required: true,
            description: `Inclusive ISO date (YYYY-MM-DD). Must be at most ${dataLagDays} days before the current B3 trading day.`,
            schema: { type: 'string', format: 'date' },
            example: '2026-06-30',
          },
        ],
        responses: {
          200: {
            description: 'One result per requested symbol, in request order',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/TickerHistoryResult' },
                },
              },
            },
          },
          400: errorResponse(
            'Invalid query: bad symbol, too many symbols, or invalid date range',
          ),
          429: errorResponse('Rate limit exceeded (30 requests/minute per IP)'),
        },
      },
    },
  },
  components: {
    schemas: {
      Ticker: component(tickerSchema),
      TickerHistoryPoint: component(tickerHistoryPointSchema),
      TickerHistoryResult: component(tickerHistoryResultSchema),
      Error: errorSchema,
    },
  },
} as const;
