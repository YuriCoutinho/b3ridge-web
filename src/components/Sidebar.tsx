import type { ReactNode } from 'react';

interface SidebarProps {
  children: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="flex flex-col gap-6 border-b border-sidebar-border bg-sidebar p-4 text-sidebar-foreground md:w-72 md:shrink-0 md:border-r md:border-b-0 md:p-6">
      {children}
      <footer className="mt-auto hidden text-xs text-muted-foreground md:block">
        Dados via <span className="font-medium text-foreground">brapi.dev</span>{' '}
        · preview simulado
      </footer>
    </aside>
  );
}
