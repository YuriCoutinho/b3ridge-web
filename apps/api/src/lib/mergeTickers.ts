import type { Ticker } from '@b3ridge/contracts';
import type { BrapiPage, BrapiTicker } from '../clients/brapi.js';

// brapi repeats the symbol in name for most funds/BDRs; the readable name lives in longName
function resolveName({ symbol, name, longName }: BrapiTicker): string {
  return name !== symbol ? name : (longName ?? symbol);
}

export function mergeTickers(pages: BrapiPage[]): Ticker[] {
  return pages
    .flatMap((page) => page.results)
    .map((ticker) => ({ symbol: ticker.symbol, name: resolveName(ticker) }));
}
