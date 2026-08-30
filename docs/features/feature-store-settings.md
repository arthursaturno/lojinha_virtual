# Feature Store Settings

## Objetivo

Permitir que o administrador configure o nome da loja e o WhatsApp de atendimento.

## Escopo atual

- Nome exibido da loja.
- Numero de WhatsApp para atendimento do cliente.
- O carregamento inicial alimenta a marca exibida na vitrine e no painel administrativo.
- Salvamento local durante a sessao do MVP.
- Sidebar administrativa compartilhada em `core/ui/components/admin-sidebar.tsx`.

## Fonte de dados

Supabase em `data/datasources/store-settings-supabase-datasource.ts`.

## Proximo passo sugerido

Execute `supabase/migrations/20260830150000_create_store_settings.sql` no SQL Editor do projeto antes do primeiro salvamento. O primeiro admin autenticado que salvar vira o dono da configuracao; mantenha o cadastro publico de usuarios desativado no Supabase.
