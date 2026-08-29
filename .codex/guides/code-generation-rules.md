# Regras De Geracao De Codigo

Estas regras valem para todo codigo TypeScript/React gerado neste projeto.

## 1. Nao Crie Codigo Fora Da Arquitetura

Antes de criar arquivo, identifique a camada:

- `domain`: regra de negocio e contratos.
- `data`: DTO, datasource, repository impl.
- `presentation`: ViewModel, Page, Components.
- `router`: rotas/helpers da feature.
- `core`: compartilhado real.
- `app`: rotas e layouts do Next.

Se uma classe/funcao nao se encaixa em nenhuma camada, pare e reavalie o design.

## 2. Um Conceito Por Arquivo

O nome do arquivo deve representar o tipo principal.

Pode coabitar:

- DTO principal + mapper `toDomain()`.
- State + tipos pequenos usados somente por aquele State.

Deve ir para arquivo proprio:

- ViewModel/hook.
- Entity.
- UseCase.
- Repository interface.
- Repository impl.
- Datasource interface e impl, se crescerem.
- Component nomeavel.
- Tipo usado por mais de uma camada.

## 3. ViewModel Como Coordenador

Obrigatorio:

- Entrada por intents/acoes.
- Saida por state imutavel.
- Sem chamada direta a Supabase no ViewModel.
- Sem regra de negocio em Component.
- Sem formatacao visual complexa no ViewModel quando for responsabilidade de utils ou UI.

## 4. UI Sem Valores Magicos

Nao usar diretamente em componentes:

- cores hardcoded;
- tipografia inline quando existir token;
- padding/gap/radius magic number espalhado;
- widths/heights sem token ou constante quando forem recorrentes.

Use tokens do design system em `core/theme/`.

## 5. Components

`Page` nao deve virar arquivo gigante.

Sai para `presentation/components/`:

- Header.
- Card.
- Empty state.
- Row complexa.
- Section.
- Form field composto.
- Dialog/popup especifico.
- Qualquer componente nomeavel.

Vai para `core/ui/components/` quando for usado por duas ou mais features.

Nao crie wrapper fino sobre componente base que apenas repassa parametros. Wrapper so existe se agrega layout, estado ou comportamento real.

## 6. Utils

Nao crie helper privado em Page/Component para:

- formatar numero/data/moeda/documento;
- validar input;
- aplicar mascara;
- calcular progresso;
- montar label reutilizavel.

Crie ou reutilize em `core/utils/<categoria>/`.

## 7. Erros

- Repository retorna `Result.failure`, nao lanca excecao para cima.
- ViewModel mapeia falhas para erro de UI.
- Page mostra feedback visual.
- Nada de `console.log` solto em codigo de producao.

## 8. Comentarios

Comentario so quando explica o motivo nao-obvio.

Proibido:

- comentario narrando o que o codigo faz;
- bloco de codigo comentado;
- TODO/FIXME fora da tarefa;
- comentario de historico tipo "removido", "antigo", "antes".

Se precisa comentar o obvio, renomeie ou extraia.

## 9. Testes No Mesmo Turno

Ao criar ou alterar UseCase ou ViewModel, crie/ajuste testes no mesmo turno.

Cobertura minima:

- caminho feliz;
- erro;
- validacao de entrada;
- loading;
- efeitos one-shot;
- wizard, quando existir.

## 10. Antes De Dizer Pronto

Obrigatorio executar ou justificar:

- `npm run lint`
- `npm run build`
- testes especificos quando existirem

No resumo final, diga decisoes nao-obvias: token criado, util extraido, componente separado, escolha entre UseCase e ViewModel.
