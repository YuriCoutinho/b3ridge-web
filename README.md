# B3ridge Web (Frontend)

Frontend do B3ridge, uma ferramenta para consultar o histórico de preços de fechamento de ativos da B3 (bolsa brasileira) e visualizar sua evolução em um gráfico de linha comparativo.

O usuário escolhe um ou mais ativos, define um período e recebe um gráfico com a evolução de cada um. Como ativos têm preços muito diferentes entre si, as séries são normalizadas em variação percentual desde o início do período, permitindo comparar tudo na mesma escala.

Live: https://yuricoutinho.github.io/b3ridge-web/

Este repositório contém apenas o frontend. O backend, que conversa com a fonte de dados externa, valida, calcula e cacheia, vive em um repositório separado.

## Funcionalidades

- Seleção de ativos com busca por texto (código ou nome) e seleção múltipla.
- Período por calendário ou por atalhos prontos (7D, 1M, 3M, 6M, 1A, YTD).
- Consulta reativa: a busca dispara ao alterar ativos, datas ou preset, respeitando a validação do formulário.
- Gráfico de linha combinado, uma linha por ativo, normalizadas em variação percentual.
- Resumo de variação percentual por ativo.
- Estados de loading, erro total e falha parcial.
- Layout responsivo para desktop e mobile.

## Arquitetura de dados

O frontend nunca busca preços direto na fonte externa. Ele sempre pergunta ao backend, que decide entre buscar novo dado ou reaproveitar o que já está em cache. Isso protege o limite de requisições da fonte externa e acelera consultas repetidas.

```
Frontend -> Backend -> Fonte de dados externa (B3)
```

Enquanto o backend não existe, a camada de API (`apiClient`) bate provisoriamente na fonte externa de forma isolada, apenas para destravar o desenvolvimento do frontend.

## Stack

- React 19, TypeScript e Vite
- Vitest e Testing Library para testes unitários
- Oxlint para lint e Prettier para formatação
- Husky, lint-staged e Commitlint para Conventional Commits
- pnpm via corepack
- GitHub Actions para CI e deploy no GitHub Pages

UI (shadcn/ui e Tailwind) e dados (TanStack Query e Recharts) chegam nas entregas seguintes.

## Começando

Requisitos: Node 24 (fixado no `.nvmrc`) e pnpm via corepack.

```bash
nvm use
corepack enable
pnpm install
cp .env.example .env
pnpm dev
```

## Scripts

| Script | Descrição |
| --- | --- |
| `pnpm dev` | Servidor de desenvolvimento. |
| `pnpm build` | Typecheck e build de produção. |
| `pnpm preview` | Serve o build de produção. |
| `pnpm typecheck` | Checagem de tipos. |
| `pnpm test` | Testes em modo watch. |
| `pnpm test:run` | Testes uma vez (CI). |
| `pnpm test:cov` | Testes com cobertura. |
| `pnpm lint` | Lint com Oxlint. |
| `pnpm format` | Formata com Prettier. |

## Qualidade e CI/CD

- Pre-commit com Husky e lint-staged: Oxlint e Prettier nos arquivos alterados.
- Commitlint valida a mensagem no padrão Conventional Commits.
- CI (`ci.yml`) roda lint, typecheck, testes e build em todo PR.
- Deploy (`deploy.yml`) publica no GitHub Pages a cada push na `main`.

## Fora de escopo

- Não é ferramenta de negociação.
- Não fornece recomendação de investimento nem análise de ativos.
- Não mostra preço em tempo real durante o pregão, apenas fechamento diário de dias já encerrados.
- Não cobre investimentos fora de ativos com ticker na B3.
