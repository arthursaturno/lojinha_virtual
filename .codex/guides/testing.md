# Testes

Os testes devem espelhar a estrutura de `src/`.

## Localizacao

```text
test/
  features/
    catalog/
      data/
      domain/
      presentation/
      router/
```

Um arquivo de teste por conceito principal:

- `get-products-usecase.test.ts`
- `use-products-viewmodel.test.ts`
- `products-repository-impl.test.ts`

## Bibliotecas Esperadas

Quando adicionarmos dependencias de teste, preferir:

- Vitest
- Testing Library
- MSW quando houver chamadas externas relevantes

## UseCase Test

Cobrir:

- sucesso;
- falha retornada pelo repository;
- validacao de entrada;
- garantia de que input invalido nao chama repository.

## ViewModel Test

Cobrir:

- estado inicial;
- loading -> success;
- loading -> failure;
- erro mapeado para erro de UI;
- efeitos one-shot;
- limpar efeito apos consumo;
- wizard: avancar, voltar, historico vazio.

## RepositoryImpl Test

Cobrir:

- datasource retorna DTO e repository retorna entidade de dominio;
- datasource falha e repository retorna `Result.failure`;
- mapper DTO -> domain.

## Convencoes

- Nome de teste em ingles.
- Nao testar detalhe visual sem necessidade.
- Testes de Page/Component so quando houver comportamento visual importante.

## Regra De Atualizacao

Ao criar, renomear ou remover teste, atualize a documentacao de testes do projeto quando ela existir.

Documento esperado:

```text
docs/tests.md
```

Ele deve ser inventario atual, nao changelog.
