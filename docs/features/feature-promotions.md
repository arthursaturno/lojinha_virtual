# Feature: Promocoes

## Objetivo

Permitir que o administrador cadastre campanhas e regras comerciais sem depender de IA ou checkout proprio.

## Tipos de campanha

- `popup`: uma imagem exibida uma vez por sessao do navegador;
- `product_discount`: desconto percentual, valor fixo ou preco fixo para um produto;
- `quantity_discount`: leve uma quantidade e pague outra, para o mesmo produto;
- `cart_benefit`: desconto selecionavel no carrinho, com titulo e descricao visiveis para o cliente;
- `free_shipping`: modalidade de `Beneficios do carrinho`, selecionavel no mesmo editor e informada no resumo para confirmacao com o vendedor.

Cada tipo possui uma campanha-raiz por loja. Ao abrir um tipo existente, o administrador gerencia suas regras internas em vez de criar outra campanha: o popup concentra sua galeria e os tipos de desconto acumulam varias regras de produto, categoria ou marca.

As ofertas de produto e de quantidade podem apontar para um produto, uma categoria ou uma marca. A marca e um campo opcional do produto, seguindo o mesmo modelo simples ja usado pela categoria no MVP.

## Seguranca

As tabelas usam `owner_id` e RLS. Imagens sao enviadas ao bucket `promotion-images` dentro da pasta do administrador autenticado. O navegador envia apenas IDs de variantes, quantidades e o ID do beneficio selecionado para as RPCs; o banco calcula os totais usando os precos reais das variantes.

## Limites do MVP

O carrinho e local ao navegador e nao reserva estoque. O pedido continua sendo confirmado pelo vendedor no WhatsApp. Frete gratis deve ser aplicado apenas quando a loja puder cumprir as condicoes informadas.

## Banco de dados

Se a base de promocoes ainda nao existir, execute no SQL Editor nesta ordem:

1. `supabase/migrations/20260901090000_create_promotions.sql` para criar a base de campanhas e o bucket de imagens;
2. `supabase/migrations/20260905140000_add_cart_benefit_promotion_kind.sql` para registrar o novo tipo de campanha;
3. `supabase/migrations/20260905150000_finish_selectable_promotions.sql` para habilitar beneficios selecionaveis, alvos por produto/categoria/marca e as RPCs usadas pelo carrinho.
4. `supabase/migrations/20260905160000_add_promotion_images.sql` para permitir uma galeria de ate cinco fotos por popup.
5. `supabase/migrations/20260905170000_allow_multiple_cart_benefits.sql` para permitir varios itens em Beneficios do carrinho.
6. `supabase/migrations/20260905180000_fix_cart_benefits_and_shipping.sql` para identificar cada beneficio individualmente, calcular frete fixo e criar `store_shipping_settings`.
7. `supabase/migrations/20260905190000_add_shipping_value_to_benefits.sql` para exibir a economia de frete a partir da configuracao global da loja.
8. `supabase/migrations/20260905210000_restore_global_shipping_and_discount_benefits.sql` para migrar valores antigos de frete para a configuracao global e corrigir beneficios de desconto.

Se as tabelas `promotions`, `promotion_products` e `promotion_coupons` ja existirem, execute somente os arquivos 2 e 3.

O cliente pode selecionar apenas um beneficio por carrinho. O banco identifica o item pelo ID de `promotion_benefits`, aplica desconto ou frete gratis e calcula o total final a partir dos precos reais. O frete fixo e informado pelo administrador em Configuracoes da loja e fica em `store_shipping_settings`.

Para conferir a instalacao, execute:

```sql
select to_regclass('public.promotions') as promotions,
       to_regclass('public.promotion_products') as promotion_products,
       to_regclass('public.promotion_benefits') as promotion_benefits,
       to_regclass('public.store_shipping_settings') as store_shipping_settings;

select column_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'products'
  and column_name = 'brand';

select routine_name
from information_schema.routines
where routine_schema = 'public'
  and routine_name in ('list_available_cart_benefits', 'validate_promotion_cart_benefit');
```

O resultado deve conter as tres tabelas, a coluna `brand` e as duas RPCs.
