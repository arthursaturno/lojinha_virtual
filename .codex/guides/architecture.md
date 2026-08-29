# Arquitetura - Next.js, Clean Architecture, MVVM

Este projeto segue Clean Architecture, MVVM e modularidade por feature. No React, o ViewModel e implementado por hooks ou classes/funcoes de coordenacao da camada `presentation/viewmodels`: recebe intents da UI, orquestra UseCases e expoe estado para Pages/Components.

## Estrutura De Pastas

Estrutura minima:

```text
src/
  app/
  core/
    config/
    di/
    error/
    network/
    result/
    router/
    theme/
    ui/
      components/
    utils/
      date/
      format/
      masks/
      numbers/
      validators/
  features/
    catalog/
      router/
      data/
        datasources/
        dtos/
        repositories/
      domain/
        entities/
        repositories/
        usecases/
      presentation/
        components/
        pages/
        viewmodels/
```

Testes espelham a estrutura da feature:

```text
test/
  features/
    catalog/
      data/
      domain/
      presentation/
      router/
```

## Responsabilidade Por Camada

`domain/`:

- TypeScript puro, sem React, Next, Supabase ou DOM.
- Contem `entities`, contratos de `repositories` e `usecases`.
- Nao importa `data/`, `presentation/`, `app/` ou outra feature.
- UseCase expoe `call(...)` e retorna `Result<T>` ou `Promise<Result<T>>`.

`data/`:

- Implementa contratos do dominio.
- Contem DTOs, data sources e repository impl.
- DTO conhece JSON e mapeia para entidade de dominio.
- Repository captura excecoes e retorna `Result`, nunca joga erro cru para cima.

`presentation/`:

- Contem Pages, Components e ViewModels.
- Page monta layout e conecta ViewModel.
- Components renderizam estado e disparam callbacks/intents.
- ViewModel nao recebe `NextRequest`, `Response`, `router` global ou detalhes de infraestrutura.
- Navegacao e erro visual sao efeitos de UI tratados pela Page.

`router/`:

- Cada feature declara seus metadados de rota e helpers de path.
- O App Router do Next fica em `src/app/` e delega para pages da feature.
- Parametros de rota sao parseados em `src/app/` ou na Page e enviados ao ViewModel.

`core/`:

- Codigo compartilhado e realmente transversal.
- Componentes reutilizados por duas ou mais features ficam em `core/ui/components/`.
- Tokens de tema ficam em `core/theme/`.
- Resultado, erros, cliente HTTP/Supabase, DI e helpers compartilhados ficam aqui.

## Regras Clean Architecture

1. `domain/` nao depende de `data/`, `presentation/` nem `app/`.
2. Features nao importam outras features. Se duas features precisam do mesmo conceito, mova para `core/`.
3. Repositories do dominio terminam com `Repository`; implementacoes em data terminam com `RepositoryImpl`.
4. UseCases usam `call()`, nunca `execute()`, `run()` ou `handle()`.
5. DTO nao vaza para presentation/domain como modelo de tela.
6. Entity de dominio nao tem schema de API, JSON ou anotacao de serializacao.

## MVVM Com ViewModel

Convencao por feature:

```text
presentation/viewmodels/
  use-catalog-viewmodel.ts
  catalog-view-state.ts
```

Regras:

- Todo input relevante da UI entra como intent/acao do ViewModel.
- ViewModel orquestra UseCases e atualiza estado.
- Estado deve ser imutavel no consumo da View.
- Components nao contem regra de negocio.
- ViewModel nao acessa DOM diretamente.
- ViewModel nao chama Supabase direto; usa UseCase.
- Navegacao e mensagens ao usuario devem ser efeitos one-shot tratados pela Page.

## Estado

Todo state deve ter valores padrao claros:

- `status`: enum/string union (`initial`, `loading`, `success`, `failure`) ou status especifico da tela.
- Dados da tela.
- Erro de UI opcional.
- Evento/efeito one-shot opcional, quando necessario.

Nao deixe loading preso. Todo fluxo que inicia loading deve finalizar em sucesso ou erro.

## Data

Fluxo padrao:

```text
SupabaseClient/ApiClient
  -> RemoteDataSource
  -> DTO.toDomain()
  -> RepositoryImpl returns Result<Domain>
  -> UseCase
  -> ViewModel
  -> Page/Components
```

## Utils

Antes de criar helper novo, procure em `core/utils/`.

Categorias esperadas:

- `format/`
- `validators/`
- `date/`
- `masks/`
- `numbers/`

Nao crie helper privado em Page/Component para formatacao, validacao, parse ou calculo reutilizavel. Extraia para `core/utils/<categoria>/`.
