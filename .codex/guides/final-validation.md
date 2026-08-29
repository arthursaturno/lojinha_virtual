# Validacao Final

Este gate deve ser aplicado antes de declarar qualquer alteracao como pronta.

## 1. Arquitetura

Verificar:

- `domain/` nao importa `data/`, `presentation/` nem `app/`.
- Feature nao importa outra feature.
- UseCase usa `call()`.
- Repository interface termina com `Repository`.
- Repository impl termina com `RepositoryImpl`.
- DTO nao vaza para UI.
- Entity nao conhece JSON.

## 2. MVVM

Verificar:

- Page conecta ViewModel e layout.
- Component recebe props/callbacks.
- ViewModel nao acessa DOM.
- ViewModel nao chama Supabase direto.
- State cobre loading, sucesso e erro.
- Efeitos one-shot sao limpos apos consumo.
- Erro visual e tratado pela Page.

## 3. UI

Verificar:

- Sem cores hardcoded desnecessarias.
- Sem tipografia hardcoded quando houver token.
- Sem espacamentos magicos espalhados.
- Component nomeavel em arquivo proprio.
- Component compartilhado em `core/ui/components/`.
- Page nao virou componente gigante.

## 4. Data

Verificar:

- DataSource fala com fonte externa.
- Repository converte DTO -> domain.
- Repository retorna `Result`.
- UseCase contem validacao de negocio.
- Nenhuma excecao crua atravessa para presentation como contrato.

## 5. Testes

Verificar:

- UseCase testado quando criado/alterado.
- ViewModel testado quando criado/alterado.
- Caminhos de erro cobertos.
- Loading coberto.
- Efeitos cobertos.
- Testes ficam em `test/` espelhando `src/`.

## 6. Comandos

Antes de finalizar, rodar:

```bash
npm run lint
npm run build
```

Se nao puder rodar, explicar o motivo.

## 7. Report Final

Resumo final deve citar:

- o que foi alterado;
- validacoes executadas;
- decisoes nao-obvias;
- riscos restantes, se houver.

Nao responda apenas "feito".
