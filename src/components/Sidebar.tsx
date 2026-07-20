import type { ReactNode } from 'react';

interface SidebarProps {
  children: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="flex flex-col gap-6 border-b border-grey-200 p-4 lg:w-72 lg:shrink-0 lg:border-r lg:border-b-0 lg:p-6">
      {children}
      <footer className="mt-auto hidden text-xs text-grey-400 lg:block">
        Dados via <span className="font-medium text-grey-500">brapi.dev</span> ·
        preview simulado
      </footer>
    </aside>
  );
}
