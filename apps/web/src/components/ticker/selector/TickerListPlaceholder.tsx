import { Button } from '@/components/ui/button';

interface TickerListPlaceholderProps {
  isError: boolean;
  isPending: boolean;
  onRetry: () => void;
}

export function TickerListPlaceholder({
  isError,
  isPending,
  onRetry,
}: TickerListPlaceholderProps) {
  if (isError) {
    return (
      <div className="flex flex-col items-center gap-1.5">
        Não foi possível carregar os ativos.
        <Button variant="outline" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (isPending) {
    return 'Carregando ativos…';
  }

  return 'Nenhum ativo encontrado.';
}
