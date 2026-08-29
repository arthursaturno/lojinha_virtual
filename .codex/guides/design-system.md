# Design System

Todo codigo de UI deve nascer seguindo esta regra: valores visuais vem do design system, nao de literais espalhados.

## Regras Absolutas

- Evitar cor hardcoded em componente.
- Evitar tipografia inline se houver token.
- Evitar padding/gap/radius magic number direto em componentes reutilizaveis.
- Toda tela deve usar a base visual padrao do app quando ela existir.
- Erros ao usuario usam componente/feedback padrao.
- Sem demos ou componentes temporarios dentro da feature.

## Tokens Esperados

Estrutura sugerida:

```text
src/core/theme/
  colors.ts
  text-styles.ts
  spacing.ts
  radius.ts
  dimensions.ts
  theme.ts
```

Tokens esperados:

- `colors`: cores semanticas.
- `textStyles`: estilos de texto.
- `spacing`: espacamentos (`xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`).
- `radius`: raios de borda.
- `dimensions`: larguras, alturas e constraints reutilizaveis.

## Cores

Use nomes semanticos, nao nomes por valor:

- `primary`
- `onPrimary`
- `background`
- `surface`
- `onSurface`
- `textPrimary`
- `textSecondary`
- `border`
- `error`
- `success`
- `warning`

Se uma cor nova for necessaria, adicione token semantico antes de usar.

## Componentes

Componentes compartilhados devem ficar em `core/ui/components/`.

Componentes esperados ao longo do projeto:

- `AppButton`
- `AppTextField`
- `AppIconButton`
- `AppDropdown`
- `AppDialog`
- `AppSnackbar`
- `AppShell`
- `AppLoading`
- `AppEmptyState`

Feature nao deve usar componente cru quando ja existir componente do app para o mesmo papel.

## Strings

Por enquanto, textos podem ficar hardcoded em PT-BR. Se internacionalizacao entrar no escopo, esta regra deve ser revisada e centralizada.
