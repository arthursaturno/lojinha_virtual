# Feature Administration

## Objetivo

Painel administrativo da Ezzion Imports para operacao interna do catalogo.

Preparado para whitelabel: cada ambiente pode apontar para um Supabase diferente, com seu proprio admin e seu proprio catalogo.

## Escopo atual

- Sidebar administrativa compartilhada em `core/ui/components`, com Produtos e Configuracoes.
- Header com CTA de novo produto.
- Busca local de produtos.
- Tabela paginada em blocos de 10 produtos, com hover e abertura de drawer lateral ao clicar no item.
- Drawer lateral com formulario guiado: categoria por selecao, descricao, preco com mascara PT-BR, estoque por stepper, status ativo/pausado, tamanhos/cores/modelos por clique e ate 3 fotos via upload do aparelho, com recorte em popup separado e preview na mesma proporcao do card da vitrine.
- Criacao, edicao e exclusao em memoria, para validar a experiencia antes do Supabase.
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

## Fonte de dados

Supabase em `data/datasources/administration-products-supabase-datasource.ts`.

## Proximo passo sugerido

Execute `supabase/migrations/20260830160000_create_products.sql` no SQL Editor antes do primeiro cadastro. A vitrine consulta as mesmas tabelas e so recebe produtos ativos pelas policies RLS.
