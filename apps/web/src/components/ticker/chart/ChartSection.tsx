import type { ReactNode } from 'react';

import { Card, CardContent } from '@/components/ui/card';

interface ChartSectionProps {
  description?: string;
  children: ReactNode;
}

export function ChartSection({ description, children }: ChartSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Comparativo de ativos
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Card>
        <CardContent className="flex flex-col gap-4">{children}</CardContent>
      </Card>
    </section>
  );
}
