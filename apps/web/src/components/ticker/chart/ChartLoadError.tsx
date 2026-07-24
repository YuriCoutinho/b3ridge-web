import { TriangleAlertIcon } from 'lucide-react';

import { FailureLines } from '@/components/ticker/chart/FailureLines';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ChartLoadErrorProps {
  allNotFound: boolean;
  lines: string[];
}

export function ChartLoadError({ allNotFound, lines }: ChartLoadErrorProps) {
  return (
    <Alert variant="destructive">
      <TriangleAlertIcon />
      <AlertTitle>
        {allNotFound
          ? 'Nenhuma cotação encontrada.'
          : 'Não foi possível carregar as cotações.'}
      </AlertTitle>
      <AlertDescription>
        <FailureLines lines={lines} />
      </AlertDescription>
    </Alert>
  );
}
