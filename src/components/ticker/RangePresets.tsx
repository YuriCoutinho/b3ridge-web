import { useId } from 'react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { rangePresets, type RangePreset } from '@/lib/dateRange';

interface RangePresetsProps {
  value: RangePreset | 'custom' | null;
  onSelectPreset: (preset: RangePreset) => void;
  disabled: boolean;
}

export function RangePresets({
  value,
  onSelectPreset,
  disabled,
}: RangePresetsProps) {
  const labelId = useId();

  return (
    <div className="flex w-full flex-col gap-1.5">
      <span
        id={labelId}
        className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
      >
        Período rápido
      </span>

      <ToggleGroup
        aria-labelledby={labelId}
        className="w-full"
        variant="outline"
        size="sm"
        disabled={disabled}
        value={value && value !== 'custom' ? [value] : []}
        onValueChange={(groupValue) => {
          const [next] = groupValue as RangePreset[];
          if (next) {
            onSelectPreset(next);
          }
        }}
      >
        {rangePresets.map((preset) => (
          <ToggleGroupItem
            key={preset.id}
            value={preset.id}
            aria-label={`Período ${preset.label}`}
            className="flex-1 data-[pressed]:border-primary! data-[pressed]:bg-primary! data-[pressed]:text-primary-foreground!"
          >
            {preset.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
