# Ezzion Imports

CatÃ¡logo virtual responsivo para a **Ezzion Imports**, desenvolvido para permitir que clientes consultem os produtos disponÃ­veis, visualizem suas caracterÃ­sticas e entrem em contato diretamente com o vendedor por meio do WhatsApp.

O projeto tem como objetivo disponibilizar uma experiÃªncia simples de consulta de produtos, sem implementar um processo tradicional de comÃ©rcio eletrÃ´nico.

O cliente poderÃ¡ visualizar os produtos disponibilizados pelo administrador, utilizar filtros e pesquisar itens, consultar preÃ§os, cores, tamanhos e outras caracterÃ­sticas e, apÃ³s selecionar as opÃ§Ãµes necessÃ¡rias, iniciar uma conversa com o vendedor pelo WhatsApp.

> **Status:** MVP em desenvolvimento.

---

## 1. Objetivo do projeto

O Ezzion Imports serÃ¡ uma plataforma de catÃ¡logo digital para divulgaÃ§Ã£o dos produtos comercializados pela loja.

A aplicaÃ§Ã£o serÃ¡ dividida em duas Ã¡reas principais:

- **Ãrea pÃºblica:** destinada aos clientes;
- **Ãrea administrativa:** destinada ao gerenciamento da loja.

O sistema nÃ£o terÃ¡ como objetivo realizar vendas diretamente pela plataforma. O processo comercial serÃ¡ finalizado por meio do contato entre cliente e vendedor atravÃ©s do WhatsApp.

### Fluxo principal

```text
Cliente
   â”‚
   â–¼
Acessa a loja
   â”‚
   â–¼
Visualiza produtos
   â”‚
   â”œâ”€â”€ Pesquisa
   â”œâ”€â”€ Categorias
   â””â”€â”€ Filtros
   â”‚
   â–¼
Seleciona um produto
   â”‚
   â–¼
Seleciona as opÃ§Ãµes disponÃ­veis
   â”‚
   â–¼
Verifica disponibilidade
   â”‚
   â–¼
Falar com vendedor
   â”‚
   â–¼
WhatsApp
```

---

# 2. Escopo do MVP

## 2.1 Ãrea pÃºblica

O cliente poderÃ¡:

- Acessar a loja sem realizar login;
- Visualizar os produtos disponÃ­veis;
- Pesquisar produtos;
- Navegar por categorias;
- Utilizar filtros;
- Visualizar preÃ§o;
- Visualizar imagens;
- Visualizar descriÃ§Ã£o;
- Visualizar tamanhos disponÃ­veis;
- Visualizar cores disponÃ­veis;
- Visualizar outros atributos cadastrados;
- Selecionar combinaÃ§Ãµes de atributos;
- Verificar a disponibilidade da combinaÃ§Ã£o selecionada;
- Entrar em contato com o vendedor pelo WhatsApp.

### Exemplos de produtos

O sistema deverÃ¡ permitir diferentes tipos de produtos, como:

```text
CalÃ§ados
Roupas
Camisas
Camisetas
RelÃ³gios
Colares
Bolsas
AcessÃ³rios
```

A estrutura nÃ£o serÃ¡ limitada a esses tipos.

---

# 3. Produtos e atributos

Um dos principais requisitos do sistema Ã© permitir que diferentes produtos possuam diferentes caracterÃ­sticas.

Por esse motivo, os atributos nÃ£o serÃ£o definidos exclusivamente no cÃ³digo da aplicaÃ§Ã£o.

O administrador poderÃ¡ definir quais caracterÃ­sticas fazem sentido para cada produto.

### Exemplo â€” Camiseta

```text
Produto: Camiseta Nike

Cor:
- Preto
- Branco
- Azul

Tamanho:
- P
- M
- G
- GG
```

### Exemplo â€” RelÃ³gio

```text
Produto: RelÃ³gio X

Cor:
- Preto
- Dourado
- Prata
```

### Exemplo â€” Colar

```text
Produto: Colar X

Modelo:
- A
- B
- C

Cor:
- Dourado
- Prata
```

Essa abordagem permite que novos tipos de produtos sejam adicionados sem a necessidade de modificar a estrutura principal da aplicaÃ§Ã£o.

---

# 4. Controle de estoque

O estoque serÃ¡ controlado considerando as combinaÃ§Ãµes de atributos do produto quando necessÃ¡rio.

### Exemplo

```text
Produto: Camiseta X

Preto + P  â†’ 3 unidades
Preto + M  â†’ 5 unidades
Preto + G  â†’ 0 unidades

Branco + P â†’ 2 unidades
Branco + M â†’ 4 unidades
Branco + G â†’ 1 unidade
```

Dessa forma, o cliente poderÃ¡ visualizar somente combinaÃ§Ãµes que estejam disponÃ­veis.

Produtos que nÃ£o possuem variaÃ§Ãµes tambÃ©m poderÃ£o possuir controle de estoque simples.

---

# 5. WhatsApp

O sistema nÃ£o realizarÃ¡ o processo de venda diretamente.

ApÃ³s selecionar as opÃ§Ãµes necessÃ¡rias do produto, o cliente poderÃ¡ utilizar o botÃ£o:

```text
Falar com o vendedor
```

O sistema deverÃ¡ gerar automaticamente uma mensagem contendo as informaÃ§Ãµes selecionadas.

### Exemplo

```text
OlÃ¡! Tenho interesse no seguinte produto:

Produto: TÃªnis Nike
Cor: Preto
Tamanho: 40
PreÃ§o: R$ 299,90

Gostaria de saber mais informaÃ§Ãµes.
```

O usuÃ¡rio serÃ¡ direcionado para o WhatsApp do vendedor.

### Regra

O botÃ£o de contato deverÃ¡ permanecer indisponÃ­vel enquanto existirem atributos obrigatÃ³rios que ainda nÃ£o tenham sido selecionados.

Produtos sem atributos obrigatÃ³rios poderÃ£o permitir o contato diretamente.

---

# 6. Ãrea administrativa

A aplicaÃ§Ã£o contarÃ¡ com uma Ã¡rea administrativa exclusiva para o responsÃ¡vel pela loja.

O administrador serÃ¡ responsÃ¡vel por controlar todo o conteÃºdo disponibilizado na Ã¡rea pÃºblica.

## Funcionalidades

### Dashboard

VisualizaÃ§Ã£o de informaÃ§Ãµes bÃ¡sicas:

- Quantidade de produtos;
- Produtos ativos;
- Produtos sem estoque;
- Quantidade de categorias.

---

### Produtos

O administrador poderÃ¡:

- Cadastrar produtos;
- Editar produtos;
- Ativar/desativar produtos;
- Excluir produtos;
- Alterar preÃ§os;
- Adicionar descriÃ§Ã£o;
- Adicionar imagens;
- Definir categoria;
- Criar atributos;
- Definir valores dos atributos;
- Gerenciar estoque.

---

### Categorias

O administrador poderÃ¡:

- Criar categorias;
- Editar categorias;
- Ativar/desativar categorias;
- Organizar produtos por categoria.

Exemplo:

```text
CalÃ§ados
Roupas
RelÃ³gios
AcessÃ³rios
```

---

### Estoque

O administrador poderÃ¡ visualizar e alterar o estoque das diferentes combinaÃ§Ãµes de produtos.

Exemplo:

```text
TÃªnis X

Cor: Preto
Tamanho: 39
Estoque: 2

Cor: Preto
Tamanho: 40
Estoque: 5

Cor: Branco
Tamanho: 39
Estoque: 0
```

---

### ConfiguraÃ§Ãµes

O administrador poderÃ¡ configurar informaÃ§Ãµes bÃ¡sicas da loja, principalmente:

- NÃºmero do WhatsApp;
- Nome da loja;
- InformaÃ§Ãµes de contato;
- InformaÃ§Ãµes utilizadas na apresentaÃ§Ã£o da loja.

---

# 7. AutenticaÃ§Ã£o

Somente o administrador terÃ¡ acesso Ã  Ã¡rea administrativa.

O cliente nÃ£o precisarÃ¡ criar uma conta.

### Ãrea pÃºblica

```text
Sem autenticaÃ§Ã£o
```

### Ãrea administrativa

```text
E-mail
Senha
   â†“
Supabase Auth
   â†“
Painel administrativo
```

Inicialmente, o sistema serÃ¡ projetado para possuir apenas uma conta administrativa.

---

# 8. Arquitetura

O projeto sera desenvolvido utilizando uma combinacao de:

- **Modularidade por feature**
- **MVVM**
- **Clean Architecture**
- **Core compartilhado**

A arquitetura foi baseada nas rules do projeto **MarqueAqui**, adaptada para a stack deste projeto: **Next.js App Router, React, TypeScript e Supabase**.

O objetivo e manter o codigo organizado, testavel, desacoplado e facil de evoluir. A regra principal e nao implementar atalhos fora das camadas definidas.

---

# 9. Organizacao dos modulos

A aplicacao sera dividida por features de negocio. Codigo realmente compartilhado ficara em `core/`.

```text
src/
  app/
  core/
    config/
    di/
    error/
    network/
    result/
    router/
    theme/
    ui/
      components/
    utils/
      date/
      format/
      masks/
      numbers/
      validators/
  features/
    catalog/
    product/
    authentication/
    administration/
    store-settings/
```

## Catalog

Responsavel por:

- Listagem de produtos;
- Pesquisa;
- Categorias;
- Filtros;
- Paginacao.

## Product

Responsavel por:

- Detalhes do produto;
- Imagens;
- Atributos;
- Variacoes;
- Disponibilidade;
- Geracao do contato via WhatsApp.

## Authentication

Responsavel por:

- Login;
- Sessao;
- Logout;
- Controle de acesso administrativo.

## Administration

Responsavel por:

- Gerenciamento de produtos;
- Categorias;
- Atributos;
- Estoque.

## Store Settings

Responsavel pelas configuracoes da loja.

---

# 10. Estrutura interna das features

Cada feature devera seguir a separacao definida pela Clean Architecture.

```text
feature/
  router/
  domain/
    entities/
    repositories/
    usecases/
  data/
    datasources/
    dtos/
    repositories/
  presentation/
    components/
    pages/
    viewmodels/
```

### Domain

Contem as regras de negocio da aplicacao e nao deve depender de React, Next, Supabase, `data/`, `presentation/` ou outra feature.

### Data

Responsavel pela comunicacao com fontes externas, como Supabase, APIs e storage. Contem DTOs, datasources e implementacoes de repositories.

### Presentation

Responsavel pela interface, Components, Pages, ViewModels, estados e interacao do usuario.

### Router

Responsavel por declarar caminhos e helpers de rota da feature. O `src/app/` do Next expoe a rota real e delega para a Page da feature.

### Core

Responsavel por codigo transversal:

- `config/`: configuracoes do app;
- `di/`: injecao/composicao de dependencias;
- `error/`: failures e erros conhecidos;
- `network/`: clientes externos, Supabase e HTTP;
- `result/`: tipo `Result`;
- `router/`: agregacao de rotas/helpers globais;
- `theme/`: tokens visuais;
- `ui/components/`: componentes usados por mais de uma feature;
- `utils/`: formatadores, validadores, datas, mascaras e numeros.

---

# 11. MVVM

A camada de apresentacao utilizara o padrao **Model-View-ViewModel**.

No React, o ViewModel sera implementado por hooks ou funcoes/classes de coordenacao em `presentation/viewmodels`.

Fluxo:

```text
Page / Component
 |
 v
ViewModel
 |
 v
Use Case
 |
 v
Repository
 |
 v
Data Source
 |
 v
Supabase
```

A View sera responsavel pela apresentacao.

O ViewModel sera responsavel pelo estado, loading, erro, efeitos de UI e coordenacao das acoes da interface.

As regras de negocio permanecerao nos UseCases e entidades do dominio.

Regras principais:

- Todo input relevante da UI vira intent/acao no ViewModel;
- ViewModel nao chama Supabase diretamente;
- Component nao contem regra de negocio;
- Repository retorna `Result`, nao excecao crua;
- DTO nao vaza para `domain/` nem `presentation/`;
- Feature nao importa outra feature;
- Codigo compartilhado por duas ou mais features deve ir para `core/`.

---
# 12. Tecnologias

| Tecnologia | UtilizaÃ§Ã£o |
|---|---|
| Next.js | Framework da aplicaÃ§Ã£o |
| React | ConstruÃ§Ã£o da interface |
| TypeScript | Tipagem e desenvolvimento |
| Tailwind CSS | Estilizacao responsiva da interface |
| React Icons | Icones da interface e WhatsApp |
| Supabase | Backend as a Service |
| PostgreSQL | Banco de dados |
| Supabase Auth | AutenticaÃ§Ã£o administrativa |
| Supabase Storage | Armazenamento de imagens |
| WhatsApp | ComunicaÃ§Ã£o entre cliente e vendedor |
| Git | Controle de versÃ£o |
| GitHub | Hospedagem do cÃ³digo |

---

# 13. Banco de dados

A estrutura inicial do banco serÃ¡ composta pelas seguintes entidades:

```text
profiles
categories
products
product_images
product_attributes
attribute_values
product_variants
variant_attribute_values
store_settings
```

### Relacionamento simplificado

```text
categories
    â”‚
    â””â”€â”€â”€â”€â”€â”€â”€â”€ products
                  â”‚
                  â”œâ”€â”€â”€â”€â”€â”€â”€â”€ product_images
                  â”‚
                  â”œâ”€â”€â”€â”€â”€â”€â”€â”€ product_attributes
                  â”‚                 â”‚
                  â”‚                 â””â”€â”€ attribute_values
                  â”‚
                  â””â”€â”€â”€â”€â”€â”€â”€â”€ product_variants
                                    â”‚
                                    â””â”€â”€ variant_attribute_values
```

---

# 14. Modelo conceitual

### Product

```text
Product
â”œâ”€â”€ id
â”œâ”€â”€ category
â”œâ”€â”€ name
â”œâ”€â”€ slug
â”œâ”€â”€ description
â”œâ”€â”€ price
â”œâ”€â”€ promotionalPrice
â”œâ”€â”€ isActive
â”œâ”€â”€ createdAt
â””â”€â”€ updatedAt
```

### Category

```text
Category
â”œâ”€â”€ id
â”œâ”€â”€ name
â”œâ”€â”€ slug
â”œâ”€â”€ description
â”œâ”€â”€ isActive
â”œâ”€â”€ createdAt
â””â”€â”€ updatedAt
```

### Product Image

```text
ProductImage
â”œâ”€â”€ id
â”œâ”€â”€ productId
â”œâ”€â”€ url
â”œâ”€â”€ sortOrder
â””â”€â”€ createdAt
```

### Product Attribute

```text
ProductAttribute
â”œâ”€â”€ id
â”œâ”€â”€ productId
â”œâ”€â”€ name
â”œâ”€â”€ isRequired
â””â”€â”€ sortOrder
```

### Attribute Value

```text
AttributeValue
â”œâ”€â”€ id
â”œâ”€â”€ attributeId
â”œâ”€â”€ value
â””â”€â”€ sortOrder
```

### Product Variant

```text
ProductVariant
â”œâ”€â”€ id
â”œâ”€â”€ productId
â”œâ”€â”€ sku
â”œâ”€â”€ price
â”œâ”€â”€ stockQuantity
â”œâ”€â”€ isActive
â”œâ”€â”€ createdAt
â””â”€â”€ updatedAt
```

---

# 15. SeguranÃ§a

O sistema deverÃ¡ utilizar as polÃ­ticas de seguranÃ§a disponibilizadas pelo Supabase, principalmente atravÃ©s de **Row Level Security (RLS)**.

A Ã¡rea pÃºblica poderÃ¡ consultar somente informaÃ§Ãµes necessÃ¡rias para a apresentaÃ§Ã£o da loja.

OperaÃ§Ãµes administrativas deverÃ£o exigir autenticaÃ§Ã£o e autorizaÃ§Ã£o.

Exemplo:

```text
Cliente
   â”‚
   â”œâ”€â”€ SELECT produtos publicados
   â”œâ”€â”€ SELECT categorias ativas
   â””â”€â”€ SELECT informaÃ§Ãµes pÃºblicas
```

```text
Administrador
   â”‚
   â”œâ”€â”€ CREATE
   â”œâ”€â”€ READ
   â”œâ”€â”€ UPDATE
   â””â”€â”€ DELETE
```

As credenciais sensÃ­veis do Supabase nÃ£o deverÃ£o ser expostas no frontend.

---

# 16. Responsividade

A interface deverÃ¡ ser desenvolvida com abordagem **responsiva**, permitindo utilizaÃ§Ã£o em:

- Smartphones;
- Tablets;
- Notebooks;
- Desktops.

O catÃ¡logo deverÃ¡ se adaptar automaticamente ao tamanho da tela.

### Desktop

```text
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Logo                  Pesquisa       Menu   â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ Filtros   â”‚ Produto â”‚ Produto â”‚ Produto    â”‚
â”‚           â”‚ Produto â”‚ Produto â”‚ Produto    â”‚
â”‚           â”‚ Produto â”‚ Produto â”‚ Produto    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Mobile

```text
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Logo          Menu  â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ ðŸ”Ž Pesquisar        â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ Produto             â”‚
â”‚                     â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ Produto             â”‚
â”‚                     â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ Produto             â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

# 17. PÃ¡ginas

## Ãrea pÃºblica

```text
/
```

CatÃ¡logo principal.

```text
/produto/[slug]
```

Detalhes do produto.

---

## Ãrea administrativa

```text
/admin/login
```

Login administrativo.

```text
/admin
```

Dashboard.

```text
/admin/produtos
```

Gerenciamento de produtos.

```text
/admin/produtos/novo
```

Cadastro de produto.

```text
/admin/produtos/[id]
```

EdiÃ§Ã£o de produto.

```text
/admin/categorias
```

Gerenciamento de categorias.

```text
/admin/configuracoes
```

ConfiguraÃ§Ãµes da loja.

---

# 18. Requisitos funcionais

### RF01 â€” CatÃ¡logo

O sistema deverÃ¡ permitir que visitantes visualizem os produtos publicados pelo administrador.

### RF02 â€” Pesquisa

O sistema deverÃ¡ permitir pesquisar produtos pelo nome.

### RF03 â€” Categorias

O sistema deverÃ¡ permitir filtrar produtos por categoria.

### RF04 â€” Filtros

O sistema deverÃ¡ permitir filtrar produtos utilizando atributos cadastrados.

### RF05 â€” Detalhes

O sistema deverÃ¡ apresentar as informaÃ§Ãµes detalhadas de um produto.

### RF06 â€” VariaÃ§Ãµes

O sistema deverÃ¡ permitir selecionar atributos disponÃ­veis de um produto.

### RF07 â€” Estoque

O sistema deverÃ¡ apresentar a disponibilidade das combinaÃ§Ãµes cadastradas.

### RF08 â€” WhatsApp

O sistema deverÃ¡ permitir iniciar contato com o vendedor apÃ³s o preenchimento das opÃ§Ãµes obrigatÃ³rias.

### RF09 â€” AutenticaÃ§Ã£o

O sistema deverÃ¡ permitir autenticaÃ§Ã£o do administrador.

### RF10 â€” Produtos

O administrador deverÃ¡ conseguir cadastrar, editar, ativar, desativar e excluir produtos.

### RF11 â€” Categorias

O administrador deverÃ¡ conseguir gerenciar categorias.

### RF12 â€” Atributos

O administrador deverÃ¡ conseguir cadastrar atributos e seus respectivos valores.

### RF13 â€” Estoque administrativo

O administrador deverÃ¡ conseguir alterar a quantidade disponÃ­vel de cada variante.

### RF14 â€” Imagens

O administrador deverÃ¡ conseguir adicionar imagens aos produtos.

### RF15 â€” ConfiguraÃ§Ãµes

O administrador deverÃ¡ conseguir configurar o nÃºmero de WhatsApp utilizado para contato.

---

# 19. Requisitos nÃ£o funcionais

### RNF01 â€” Responsividade

A aplicaÃ§Ã£o deverÃ¡ funcionar adequadamente em dispositivos mÃ³veis e desktops.

### RNF02 â€” SeguranÃ§a

OperaÃ§Ãµes administrativas deverÃ£o exigir autenticaÃ§Ã£o e autorizaÃ§Ã£o.

### RNF03 â€” Usabilidade

A interface deverÃ¡ priorizar simplicidade e facilidade de navegaÃ§Ã£o.

### RNF04 â€” Performance

A aplicaÃ§Ã£o deverÃ¡ otimizar carregamento de imagens e conteÃºdo.

### RNF05 â€” Manutenibilidade

O cÃ³digo deverÃ¡ seguir a arquitetura modular, MVVM e Clean Architecture.

### RNF06 â€” Escalabilidade

A estrutura deverÃ¡ permitir a inclusÃ£o de novos tipos de produtos e atributos sem alteraÃ§Ãµes estruturais significativas.

### RNF07 â€” Disponibilidade

Os produtos publicados deverÃ£o estar disponÃ­veis para consulta pÃºblica enquanto estiverem ativos.

---

# 20. Fora do escopo do MVP

Para manter o projeto simples e focado, os seguintes recursos nÃ£o fazem parte do MVP:

- Carrinho de compras;
- Checkout;
- Pagamento online;
- PIX integrado;
- CartÃ£o de crÃ©dito;
- Sistema de pedidos;
- HistÃ³rico de pedidos;
- CÃ¡lculo de frete;
- IntegraÃ§Ã£o com transportadoras;
- Cupons de desconto;
- AvaliaÃ§Ãµes;
- Sistema de favoritos;
- Cadastro de clientes;
- Login de clientes;
- Marketplace;
- MÃºltiplos vendedores;
- Aplicativo mobile;
- IntegraÃ§Ã£o com ERP;
- WhatsApp Business API.

O processo de venda serÃ¡ realizado diretamente entre cliente e vendedor atravÃ©s do WhatsApp.

---

# 21. Backlog inicial

## Epic 01 â€” ConfiguraÃ§Ã£o do projeto

- [ ] Criar projeto Next.js
- [ ] Configurar TypeScript
- [ ] Configurar estrutura modular
- [ ] Configurar arquitetura
- [ ] Configurar lint/format
- [ ] Configurar variÃ¡veis de ambiente
- [ ] Configurar Supabase

## Epic 02 â€” Banco de dados

- [ ] Criar tabelas
- [ ] Criar relacionamentos
- [ ] Criar Ã­ndices
- [ ] Criar RLS
- [ ] Criar policies
- [ ] Configurar Storage

## Epic 03 â€” AutenticaÃ§Ã£o

- [ ] Criar login administrativo
- [ ] Implementar sessÃ£o
- [ ] Implementar logout
- [ ] Proteger rotas administrativas

## Epic 04 â€” Categorias

- [ ] Listagem
- [ ] Cadastro
- [ ] EdiÃ§Ã£o
- [ ] AtivaÃ§Ã£o/desativaÃ§Ã£o

## Epic 05 â€” Produtos

- [ ] Listagem administrativa
- [ ] Cadastro
- [ ] EdiÃ§Ã£o
- [ ] AtivaÃ§Ã£o/desativaÃ§Ã£o
- [ ] ExclusÃ£o
- [ ] Upload de imagens

## Epic 06 â€” Atributos e variantes

- [ ] Cadastro de atributos
- [ ] Cadastro de valores
- [ ] CriaÃ§Ã£o de variantes
- [ ] Controle de estoque
- [ ] ValidaÃ§Ã£o de combinaÃ§Ãµes

## Epic 07 â€” CatÃ¡logo

- [ ] Layout responsivo
- [ ] Listagem
- [ ] Pesquisa
- [ ] Categorias
- [ ] Filtros
- [ ] OrdenaÃ§Ã£o

## Epic 08 â€” Produto

- [ ] PÃ¡gina de detalhes
- [ ] Galeria de imagens
- [ ] SeleÃ§Ã£o de atributos
- [ ] ValidaÃ§Ã£o de disponibilidade
- [ ] BotÃ£o WhatsApp

## Epic 09 â€” ConfiguraÃ§Ãµes

- [ ] NÃºmero WhatsApp
- [ ] InformaÃ§Ãµes da loja
- [ ] ConfiguraÃ§Ãµes pÃºblicas

## Epic 10 â€” Deploy

- [ ] Configurar ambiente de produÃ§Ã£o
- [ ] Configurar domÃ­nio
- [ ] Configurar HTTPS
- [ ] Configurar variÃ¡veis de ambiente
- [ ] Realizar testes de produÃ§Ã£o
- [ ] Monitorar aplicaÃ§Ã£o

---

# 22. Estrutura de alto nÃ­vel

```text
                         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                         â”‚       Cliente       â”‚
                         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                    â”‚
                                    â–¼
                         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                         â”‚      Next.js        â”‚
                         â”‚       React         â”‚
                         â”‚     TypeScript      â”‚
                         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                    â”‚
                   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                   â”‚                                 â”‚
                   â–¼                                 â–¼
          â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”              â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
          â”‚ Ãrea PÃºblica    â”‚              â”‚ Ãrea Admin      â”‚
          â”‚                 â”‚              â”‚                 â”‚
          â”‚ CatÃ¡logo        â”‚              â”‚ Produtos        â”‚
          â”‚ Produtos        â”‚              â”‚ Categorias      â”‚
          â”‚ Filtros         â”‚              â”‚ Estoque         â”‚
          â”‚ WhatsApp        â”‚              â”‚ ConfiguraÃ§Ãµes   â”‚
          â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”˜              â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                   â”‚                                â”‚
                   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                    â”‚
                                    â–¼
                           â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                           â”‚    Supabase     â”‚
                           â”‚                 â”‚
                           â”‚ PostgreSQL      â”‚
                           â”‚ Auth            â”‚
                           â”‚ Storage         â”‚
                           â”‚ RLS             â”‚
                           â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

# 23. Estrutura de desenvolvimento

O desenvolvimento serÃ¡ realizado de forma incremental, priorizando inicialmente as funcionalidades essenciais para funcionamento do catÃ¡logo.

### Fase 1 â€” FundaÃ§Ã£o

```text
Next.js
TypeScript
Arquitetura
Supabase
Banco
AutenticaÃ§Ã£o
```

### Fase 2 â€” AdministraÃ§Ã£o

```text
Categorias
Produtos
Imagens
Atributos
Variantes
Estoque
```

### Fase 3 â€” CatÃ¡logo

```text
Home
Produtos
Pesquisa
Filtros
Detalhes
```

### Fase 4 â€” IntegraÃ§Ã£o

```text
WhatsApp
ConfiguraÃ§Ãµes
ValidaÃ§Ãµes
```

### Fase 5 â€” Qualidade

```text
Testes
Responsividade
Performance
SeguranÃ§a
Deploy
```

---

# 24. CritÃ©rio de conclusÃ£o do MVP

O MVP serÃ¡ considerado funcional quando:

- [ ] O administrador conseguir acessar o painel;
- [ ] O administrador conseguir criar categorias;
- [ ] O administrador conseguir cadastrar produtos;
- [ ] O administrador conseguir adicionar imagens;
- [ ] O administrador conseguir definir atributos;
- [ ] O administrador conseguir configurar variantes;
- [ ] O administrador conseguir controlar estoque;
- [ ] Produtos ativos aparecerem no catÃ¡logo;
- [ ] O cliente conseguir pesquisar produtos;
- [ ] O cliente conseguir utilizar filtros;
- [ ] O cliente conseguir visualizar detalhes;
- [ ] O cliente conseguir selecionar as opÃ§Ãµes disponÃ­veis;
- [ ] O sistema impedir contato sem selecionar opÃ§Ãµes obrigatÃ³rias;
- [ ] O cliente conseguir abrir o WhatsApp com uma mensagem preenchida;
- [ ] A aplicaÃ§Ã£o funcionar em desktop e mobile;
- [ ] As regras de seguranÃ§a do banco estiverem configuradas;
- [ ] A aplicaÃ§Ã£o estiver disponÃ­vel em ambiente de produÃ§Ã£o.

---

# 25. ConsideraÃ§Ãµes

O Ezzion Imports foi planejado como um **catÃ¡logo virtual**, e nÃ£o como uma plataforma completa de comÃ©rcio eletrÃ´nico.

A principal finalidade do sistema Ã© facilitar a divulgaÃ§Ã£o dos produtos da loja e aproximar o cliente do vendedor.

A arquitetura foi planejada de forma modular para permitir futuras expansÃµes, como:

- Carrinho;
- Pedidos;
- Pagamentos;
- Clientes cadastrados;
- HistÃ³rico de compras;
- Controle de vendas;
- IntegraÃ§Ãµes externas;
- AplicaÃ§Ã£o mobile;
- Novos tipos de produtos.

Entretanto, essas funcionalidades permanecerÃ£o fora do escopo inicial para garantir que o MVP seja simples, funcional e adequado ao objetivo proposto.
