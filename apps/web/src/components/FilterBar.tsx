import type { FormEvent, ReactNode } from 'react';

interface FilterBarProps {
  children: ReactNode;
  onSubmit: () => void;
}

export function FilterBar({ children, onSubmit }: FilterBarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-x-6 gap-y-4 border-b border-sidebar-border bg-sidebar px-4 py-4 text-sidebar-foreground sm:px-6"
    >
      {children}
    </form>
  );
}
