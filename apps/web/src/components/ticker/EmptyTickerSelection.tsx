import { ChartLineIcon, LockIcon } from 'lucide-react';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

const suggestions = ['PETR4', 'VALE3', 'ITUB4', 'ABEV3', 'WEGE3'];

export function EmptyTickerSelection() {
  return (
    <Empty className="border-0">
      <EmptyHeader>
        <EmptyMedia variant="default" className="relative">
          <div className="flex size-14 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <ChartLineIcon className="size-7" />
          </div>
          <span className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
            <LockIcon className="size-3" />
          </span>
        </EmptyMedia>
        <EmptyTitle>Nenhum ativo consultado</EmptyTitle>
        <EmptyDescription>
          Selecione os ativos e clique em Consultar para visualizar o gráfico de
          preços.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <ul className="flex flex-wrap justify-center gap-2">
          {suggestions.map((symbol) => (
            <li
              key={symbol}
              className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {symbol}
            </li>
          ))}
        </ul>
      </EmptyContent>
    </Empty>
  );
}
