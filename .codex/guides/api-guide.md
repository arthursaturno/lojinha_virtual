# Guia De API E Dados

Este guia define o fluxo de dados quando a feature falar com Supabase, API, storage local ou qualquer fonte externa.

## Fluxo

```text
SupabaseClient/ApiClient
  -> RemoteDataSource
  -> DTO
  -> RepositoryImpl
  -> Result<Domain>
  -> UseCase
  -> ViewModel
```

## ApiClient

O cliente compartilhado fica em `core/network/`.

Regras:

- Headers, auth, timeout e interceptors ficam no core/network.
- Feature nao instancia cliente externo direto.
- Feature pode declarar endpoints ou datasource especifico.

## DTO

DTO fica em:

```text
features/<feature>/data/dtos/
```

Regras:

- DTO conhece JSON.
- DTO possui mapper para dominio.
- DTO nao aparece em `presentation/`.

## DataSource

Datasource fica em:

```text
features/<feature>/data/datasources/
```

Regras:

- Interface define contrato da fonte.
- Impl chama API, Supabase ou local storage.
- Impl e dona de serializacao bruta.
- Erros externos podem ser convertidos para failures conhecidas.

## RepositoryImpl

Repository impl fica em:

```text
features/<feature>/data/repositories/
```

Regras:

- Implementa interface de `domain/repositories`.
- Converte DTO para Entity.
- Captura excecoes.
- Retorna `Result`.
- Nao conhece UI.
- Nao mostra erro.
- Nao navega.

## Result E Failures

Definir em `core/result/` e `core/error/`.

Padrao esperado:

- `Result.success(data)`
- `Result.failure(failure)`
- `Failure` com tipos semanticos: network, timeout, unauthorized, validation, unknown.

Nao use `Error("erro")` ad-hoc como contrato entre camadas.

## Checklist De Fonte Nova

- [ ] DTO criado.
- [ ] Datasource interface e impl criados.
- [ ] Repository interface no domain.
- [ ] RepositoryImpl retorna `Result`.
- [ ] UseCase criado.
- [ ] ViewModel mapeia sucesso/erro/loading.
- [ ] Testes de UseCase e ViewModel atualizados.
