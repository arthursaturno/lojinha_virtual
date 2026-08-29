# Como Criar Uma Nova Feature

Ordem obrigatoria de criacao:

```text
[ ] 1. router/
[ ] 2. domain/entities
[ ] 3. domain/repositories
[ ] 4. domain/usecases
[ ] 5. data/dtos
[ ] 6. data/datasources
[ ] 7. data/repositories
[ ] 8. presentation/viewmodels
[ ] 9. presentation/pages
[ ] 10. presentation/components
[ ] 11. conectar rota em src/app/
[ ] 12. criar testes espelhados em test/features/<feature>/
```

## Router

Cada feature tem sua pasta `router/`.

Padrao:

```text
features/catalog/router/catalog-routes.ts
```

Regras:

- Path, nomes e builders/helpers ficam declarados na feature.
- `src/app/` apenas expoe a rota do Next e delega para a Page da feature.
- Nao navegue dentro do ViewModel; a Page trata efeitos e usa APIs de navegacao do Next quando necessario.

## Domain

Arquivos esperados:

```text
domain/entities/product.ts
domain/repositories/products-repository.ts
domain/usecases/get-products-usecase.ts
```

Regras:

- Entity e TypeScript puro.
- Repository e interface/contrato.
- UseCase tem uma responsabilidade.
- UseCase usa `call()`.
- Validacao de negocio fica no UseCase, nao no ViewModel.

## Data

Arquivos esperados:

```text
data/dtos/product-dto.ts
data/datasources/products-remote-datasource.ts
data/datasources/products-remote-datasource-impl.ts
data/repositories/products-repository-impl.ts
```

Regras:

- DTO possui mapper para dominio.
- DataSource faz chamada externa/local.
- RepositoryImpl captura excecao e retorna `Result`.
- RepositoryImpl nao guarda estado de sessao.

## Presentation

Arquivos esperados:

```text
presentation/viewmodels/use-products-viewmodel.ts
presentation/viewmodels/products-view-state.ts
presentation/pages/products-page.tsx
presentation/components/products-header.tsx
```

Regras:

- Page conecta ViewModel, efeitos e layout.
- Component recebe props e callbacks.
- Componente nomeavel sai para arquivo proprio.
- ViewModel nao recebe detalhes de infraestrutura.
- Todo input relevante do usuario vira intent/acao.
- Todo erro de UI vira estado/efeito tratado pela Page.

## Checklist De Feature

- [ ] Nenhum import entre features.
- [ ] Domain sem React, Next, Supabase e DTO.
- [ ] UseCases com `call()`.
- [ ] Repository retorna `Result`.
- [ ] ViewModel cobre loading, sucesso e erro.
- [ ] Page trata efeitos de UI.
- [ ] Rota conectada em `src/app/`.
- [ ] Testes criados no espelho de `test/`.
- [ ] Documentacao da feature criada em `docs/features/feature-<nome>.md` quando a feature existir.
