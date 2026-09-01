# Feature: Promocoes

## Objetivo

Permitir que o administrador cadastre campanhas e regras comerciais sem depender de IA ou checkout proprio.

## Tipos de campanha

- `popup`: uma imagem exibida uma vez por sessao do navegador;
- `product_discount`: desconto percentual, valor fixo ou preco fixo para um produto;
- `quantity_discount`: leve uma quantidade e pague outra, para o mesmo produto;
- `coupon`: desconto aplicado ao carrinho;
- `free_shipping`: beneficio informado no resumo e confirmado pelo vendedor.

## Seguranca

As tabelas usam `owner_id` e RLS. Imagens sao enviadas ao bucket `promotion-images` dentro da pasta do administrador autenticado. O navegador envia apenas codigo e variantes para a RPC `validate_promotion_cart_coupon`; o banco calcula os totais usando os precos reais das variantes.

## Limites do MVP

O carrinho e local ao navegador e nao reserva estoque. O pedido continua sendo confirmado pelo vendedor no WhatsApp. Frete gratis deve ser aplicado apenas quando a loja puder cumprir as condicoes informadas.
