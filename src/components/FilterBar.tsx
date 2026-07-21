import type { ReactNode } from 'react';

interface FilterBarProps {
  children: ReactNode;
}

export function FilterBar({ children }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-end gap-x-6 gap-y-4 border-b border-sidebar-border bg-sidebar px-4 py-4 text-sidebar-foreground sm:px-6">
      {children}
    </div>
  );
}
