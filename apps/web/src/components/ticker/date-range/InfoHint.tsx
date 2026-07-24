import { InfoIcon } from 'lucide-react';
import { useState } from 'react';

export function InfoHint({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex">
      <button
        type="button"
        aria-label={text}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        onBlur={() => setOpen(false)}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <InfoIcon className="size-3.5" />
      </button>
      {open && (
        <div
          role="tooltip"
          className="absolute top-full left-0 z-50 mt-1 w-max max-w-xs rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md"
        >
          {text}
        </div>
      )}
    </div>
  );
}
