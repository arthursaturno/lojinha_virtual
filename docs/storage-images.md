# Storage E Imagens

Este documento registra as decisoes iniciais para uso de imagens no MVP da Ezzion Imports.

## Stack

Para o MVP, o projeto usara:

- Vercel para hospedagem do Next.js;
- Supabase para banco, autenticacao e storage;
- Supabase Storage para imagens dos produtos.

Essa combinacao e suficiente para o volume inicial esperado de aproximadamente 20 usuarios por dia, desde que as imagens sejam otimizadas antes ou durante o upload.

## Limites Do Plano Gratis

Limites considerados para o Supabase Free:

- 500 MB de banco de dados;
- 1 GB de file storage;
- 5 GB de egress;
- 5 GB de cached egress;
- 50.000 usuarios ativos por mes no Auth.

O principal risco para o plano gratis nao e a quantidade de usuarios inicial, mas o tamanho das imagens e o trafego gerado por elas.

## Estimativa De Uso

Com 20 usuarios por dia:

```text
20 usuarios/dia x 30 dias = 600 usuarios/visitas por mes
```

Exemplo com imagens otimizadas:

```text
20 usuarios x 10 imagens x 500 KB = 100 MB/dia
100 MB/dia x 30 dias = 3 GB/mes
```

Nesse cenario, o uso ainda fica dentro do plano gratis.

Exemplo com imagens pesadas:

```text
20 usuarios x 10 imagens x 3 MB = 600 MB/dia
600 MB/dia x 30 dias = 18 GB/mes
```

Nesse cenario, o plano gratis pode estourar rapidamente.

## Qualidade Das Imagens

Otimizar imagem nao deve significar deixar a foto ruim. A ideia e remover excesso que o usuario nao percebe na tela.

Configuracao recomendada:

```text
Formato: WebP
Largura maxima: 1200px a 1600px
Qualidade: 75% a 85%
Peso ideal: 200 KB a 700 KB por foto
```

Evitar:

- qualidade abaixo de 70%;
- imagem menor que 1000px de largura para detalhe de produto;
- subir fotos originais direto do celular sem compressao;
- carregar todas as imagens de todos os produtos de uma vez.

## Versoes Por Imagem

Quando implementarmos upload, a estrategia recomendada e gerar duas versoes:

- Thumbnail/listagem: imagem menor e leve para cards do catalogo;
- Detalhe do produto: imagem maior e com melhor qualidade.

Isso permite que a home carregue rapido e que a pagina do produto continue exibindo uma foto bonita.

## Regras Para Implementacao

- Validar tamanho maximo no upload;
- Preferir WebP;
- Redimensionar imagem antes de salvar ou no fluxo de upload;
- Usar lazy loading na listagem;
- Paginar ou limitar produtos carregados por vez;
- Nunca armazenar chaves secretas do Supabase no frontend;
- Usar apenas `anon public` no cliente;
- Manter RLS e policies configuradas antes de expor buckets/tabelas publicamente.

## Quando Reavaliar

Reavaliar storage/custo quando acontecer qualquer um dos pontos abaixo:

- storage passar de 700 MB;
- egress mensal chegar perto de 4 GB;
- catalogo passar de algumas centenas de fotos;
- imagens precisarem de transformacoes dinamicas;
- projeto passar a ser usado comercialmente em producao com trafego real.

Nesse momento, as opcoes sao:

- migrar para Supabase Pro;
- mover apenas as imagens para outro storage/CDN;
- manter Supabase para banco/auth e usar um servico dedicado para midia.
