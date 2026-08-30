# Feature Store Settings

## Objetivo

Permitir que o administrador configure o nome da loja e o WhatsApp de atendimento.

## Escopo atual

- Nome exibido da loja.
- Numero de WhatsApp para atendimento do cliente.
- Salvamento local durante a sessao do MVP.
- Sidebar administrativa compartilhada em `core/ui/components/admin-sidebar.tsx`.

## Fonte de dados atual

Mock local em `data/datasources/store-settings-mock-datasource.ts`.

## Proximo passo sugerido

Persistir as configuracoes no Supabase por ambiente whitelabel.
