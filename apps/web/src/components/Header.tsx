import { ChartLineIcon } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center gap-2.5 border-b border-sidebar-border bg-sidebar px-4 py-3 sm:px-6">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <ChartLineIcon className="size-4" aria-hidden="true" />
      </span>
      <h1 className="text-base font-semibold text-sidebar-foreground">
        B3ridge
      </h1>
      <span aria-hidden="true" className="text-muted-foreground">
        ·
      </span>
      <span className="text-sm text-muted-foreground">Market data bridge</span>
    </header>
  );
}
