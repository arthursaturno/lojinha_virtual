# Seguranca

## Camadas Ativas

- O painel administrativo e protegido no proxy e novamente nas paginas do servidor.
- A autorizacao dos dados e feita por RLS no Supabase; esconder uma rota nao e controle de acesso.
- A sessao administrativa e verificada no servidor pelo e-mail configurado em `ADMIN_EMAIL`.
- O navegador recebe somente a URL e a chave publica do Supabase. Nunca use `service_role` no frontend.
- Cabecalhos de seguranca bloqueiam iframe, MIME sniffing e recursos inesperados.
- O Storage de produtos aceita operacoes apenas quando a primeira pasta do objeto corresponde ao `auth.uid()` autenticado.

## Configuracao Obrigatoria

Configure estas variaveis na Vercel e no ambiente local:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ADMIN_EMAIL=
```

Depois de configurar `ADMIN_EMAIL`, remova `NEXT_PUBLIC_ADMIN_EMAIL` da Vercel. O fallback existe apenas para transicao de ambientes antigos.

Execute no SQL Editor do Supabase a migration local:

```text
supabase/migrations/20260902113000_harden_product_images_storage_policies.sql
```

## Dashboard Do Supabase

- Desative cadastro publico em Authentication se somente o administrador usa login.
- Mantenha confirmacao de e-mail ativa e uma senha longa e exclusiva para o administrador.
- Habilite protecao contra captchas e limites de tentativas de login quando disponiveis.
- Revise regularmente RLS de tabelas e buckets; a chave `service_role` nunca deve entrar na Vercel como variavel publica.

## Limites Conhecidos

- Produtos e imagens sao publicos por decisao do catalogo. Nao use esse bucket para documentos privados.
- O projeto nao possui API publica propria para aplicar rate limit distribuido. Para ataques de volumetria, use as protecoes de firewall/rate limit da Vercel e do Supabase.
