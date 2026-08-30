# Feature Administration

## Objetivo

Painel administrativo da Ezzion Imports para operacao interna do catalogo.

Preparado para whitelabel: cada ambiente pode apontar para um Supabase diferente, com seu proprio admin e seu proprio catalogo.

## Escopo atual

- Sidebar administrativa com secoes principais do painel.
- Header com CTA de novo produto.
- Busca local de produtos.
- Tabela de produtos com abertura de drawer lateral ao clicar no item.
- Drawer lateral com formulario guiado: categoria por selecao, preco com mascara PT-BR, estoque por stepper, tamanhos/cores/modelos por clique e ate 3 fotos via upload do aparelho, com recorte em popup separado e preview na mesma proporcao do card da vitrine.
- Logout administrativo.

## Estrutura

```text
src/features/administration/
  router/
  domain/
    entities/
    repositories/
    usecases/
  data/
    datasources/
    dtos/
    repositories/
  presentation/
    components/
    pages/
    viewmodels/
```

## Fonte de dados atual

Mock local em `data/datasources/administration-products-mock-datasource.ts`.

## Proximo passo sugerido

Substituir o mock por leitura e persistencia reais no Supabase, mantendo o mesmo fluxo de edicao em drawer.
