# Ezzion Imports

Catálogo virtual responsivo para a **Ezzion Imports**, desenvolvido para permitir que clientes consultem os produtos disponíveis, visualizem suas características e entrem em contato diretamente com o vendedor por meio do WhatsApp.

O projeto tem como objetivo disponibilizar uma experiência simples de consulta de produtos, sem implementar um processo tradicional de comércio eletrônico.

O cliente poderá visualizar os produtos disponibilizados pelo administrador, utilizar filtros e pesquisar itens, consultar preços, cores, tamanhos e outras características e, após selecionar as opções necessárias, iniciar uma conversa com o vendedor pelo WhatsApp.

> **Status:** MVP em desenvolvimento.

---

## 1. Objetivo do projeto

O Ezzion Imports será uma plataforma de catálogo digital para divulgação dos produtos comercializados pela loja.

A aplicação será dividida em duas áreas principais:

- **Área pública:** destinada aos clientes;
- **Área administrativa:** destinada ao gerenciamento da loja.

O sistema não terá como objetivo realizar vendas diretamente pela plataforma. O processo comercial será finalizado por meio do contato entre cliente e vendedor através do WhatsApp.

### Fluxo principal

```text
Cliente
   │
   ▼
Acessa a loja
   │
   ▼
Visualiza produtos
   │
   ├── Pesquisa
   ├── Categorias
   └── Filtros
   │
   ▼
Seleciona um produto
   │
   ▼
Seleciona as opções disponíveis
   │
   ▼
Verifica disponibilidade
   │
   ▼
Falar com vendedor
   │
   ▼
WhatsApp
```

---

# 2. Escopo do MVP

## 2.1 Área pública

O cliente poderá:

- Acessar a loja sem realizar login;
- Visualizar os produtos disponíveis;
- Pesquisar produtos;
- Navegar por categorias;
- Utilizar filtros;
- Visualizar preço;
- Visualizar imagens;
- Visualizar descrição;
- Visualizar tamanhos disponíveis;
- Visualizar cores disponíveis;
- Visualizar outros atributos cadastrados;
- Selecionar combinações de atributos;
- Verificar a disponibilidade da combinação selecionada;
- Entrar em contato com o vendedor pelo WhatsApp.

### Exemplos de produtos

O sistema deverá permitir diferentes tipos de produtos, como:

```text
Calçados
Roupas
Camisas
Camisetas
Relógios
Colares
Bolsas
Acessórios
```

A estrutura não será limitada a esses tipos.

---

# 3. Produtos e atributos

Um dos principais requisitos do sistema é permitir que diferentes produtos possuam diferentes características.

Por esse motivo, os atributos não serão definidos exclusivamente no código da aplicação.

O administrador poderá definir quais características fazem sentido para cada produto.

### Exemplo — Camiseta

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

### Exemplo — Relógio

```text
Produto: Relógio X

Cor:
- Preto
- Dourado
- Prata
```

### Exemplo — Colar

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

Essa abordagem permite que novos tipos de produtos sejam adicionados sem a necessidade de modificar a estrutura principal da aplicação.

---

# 4. Controle de estoque

O estoque será controlado considerando as combinações de atributos do produto quando necessário.

### Exemplo

```text
Produto: Camiseta X

Preto + P  → 3 unidades
Preto + M  → 5 unidades
Preto + G  → 0 unidades

Branco + P → 2 unidades
Branco + M → 4 unidades
Branco + G → 1 unidade
```

Dessa forma, o cliente poderá visualizar somente combinações que estejam disponíveis.

Produtos que não possuem variações também poderão possuir controle de estoque simples.

---

# 5. WhatsApp

O sistema não realizará o processo de venda diretamente.

Após selecionar as opções necessárias do produto, o cliente poderá utilizar o botão:

```text
Falar com o vendedor
```

O sistema deverá gerar automaticamente uma mensagem contendo as informações selecionadas.

### Exemplo

```text
Olá! Tenho interesse no seguinte produto:

Produto: Tênis Nike
Cor: Preto
Tamanho: 40
Preço: R$ 299,90

Gostaria de saber mais informações.
```

O usuário será direcionado para o WhatsApp do vendedor.

### Regra

O botão de contato deverá permanecer indisponível enquanto existirem atributos obrigatórios que ainda não tenham sido selecionados.

Produtos sem atributos obrigatórios poderão permitir o contato diretamente.

---

# 6. Área administrativa

A aplicação contará com uma área administrativa exclusiva para o responsável pela loja.

O administrador será responsável por controlar todo o conteúdo disponibilizado na área pública.

## Funcionalidades

### Dashboard

Visualização de informações básicas:

- Quantidade de produtos;
- Produtos ativos;
- Produtos sem estoque;
- Quantidade de categorias.

---

### Produtos

O administrador poderá:

- Cadastrar produtos;
- Editar produtos;
- Ativar/desativar produtos;
- Excluir produtos;
- Alterar preços;
- Adicionar descrição;
- Adicionar imagens;
- Definir categoria;
- Criar atributos;
- Definir valores dos atributos;
- Gerenciar estoque.

---

### Categorias

O administrador poderá:

- Criar categorias;
- Editar categorias;
- Ativar/desativar categorias;
- Organizar produtos por categoria.

Exemplo:

```text
Calçados
Roupas
Relógios
Acessórios
```

---

### Estoque

O administrador poderá visualizar e alterar o estoque das diferentes combinações de produtos.

Exemplo:

```text
Tênis X

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

### Configurações

O administrador poderá configurar informações básicas da loja, principalmente:

- Número do WhatsApp;
- Nome da loja;
- Informações de contato;
- Informações utilizadas na apresentação da loja.

---

# 7. Autenticação

Somente o administrador terá acesso Ã  área administrativa.

O cliente não precisará criar uma conta.

### Área pública

```text
Sem autenticação
```

### Área administrativa

```text
E-mail
Senha
   ↓
Supabase Auth
   ↓
Painel administrativo
```

Inicialmente, o sistema será projetado para possuir apenas uma conta administrativa.

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

| Tecnologia | Utilização |
|---|---|
| Next.js | Framework da aplicação |
| React | Construção da interface |
| TypeScript | Tipagem e desenvolvimento |
| Tailwind CSS | Estilizacao responsiva da interface |
| React Icons | Icones da interface e WhatsApp |
| Supabase | Backend as a Service |
| PostgreSQL | Banco de dados |
| Supabase Auth | Autenticação administrativa |
| Supabase Storage | Armazenamento de imagens |
| WhatsApp | Comunicação entre cliente e vendedor |
| Git | Controle de versão |
| GitHub | Hospedagem do código |

---

# 13. Banco de dados

A estrutura inicial do banco será composta pelas seguintes entidades:

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
    │
    └──────── products
                  │
                  ├──────── product_images
                  │
                  ├──────── product_attributes
                  │                 │
                  │                 └── attribute_values
                  │
                  └──────── product_variants
                                    │
                                    └── variant_attribute_values
```

---

# 14. Modelo conceitual

### Product

```text
Product
├── id
├── category
├── name
├── slug
├── description
├── price
├── promotionalPrice
├── isActive
├── createdAt
└── updatedAt
```

### Category

```text
Category
├── id
├── name
├── slug
├── description
├── isActive
├── createdAt
└── updatedAt
```

### Product Image

```text
ProductImage
├── id
├── productId
├── url
├── sortOrder
└── createdAt
```

### Product Attribute

```text
ProductAttribute
├── id
├── productId
├── name
├── isRequired
└── sortOrder
```

### Attribute Value

```text
AttributeValue
├── id
├── attributeId
├── value
└── sortOrder
```

### Product Variant

```text
ProductVariant
├── id
├── productId
├── sku
├── price
├── stockQuantity
├── isActive
├── createdAt
└── updatedAt
```

---

# 15. Segurança

O sistema deverá utilizar as políticas de segurança disponibilizadas pelo Supabase, principalmente através de **Row Level Security (RLS)**.

A área pública poderá consultar somente informações necessárias para a apresentação da loja.

Operações administrativas deverão exigir autenticação e autorização.

Exemplo:

```text
Cliente
   │
   ├── SELECT produtos publicados
   ├── SELECT categorias ativas
   └── SELECT informações públicas
```

```text
Administrador
   │
   ├── CREATE
   ├── READ
   ├── UPDATE
   └── DELETE
```

As credenciais sensíveis do Supabase não deverão ser expostas no frontend.

---

# 16. Responsividade

A interface deverá ser desenvolvida com abordagem **responsiva**, permitindo utilização em:

- Smartphones;
- Tablets;
- Notebooks;
- Desktops.

O catálogo deverá se adaptar automaticamente ao tamanho da tela.

### Desktop

```text
┌─────────────────────────────────────────────┐
│ Logo                  Pesquisa       Menu   │
├───────────┬─────────────────────────────────┤
│ Filtros   │ Produto │ Produto │ Produto    │
│           │ Produto │ Produto │ Produto    │
│           │ Produto │ Produto │ Produto    │
└───────────┴─────────────────────────────────┘
```

### Mobile

```text
┌─────────────────────┐
│ Logo          Menu  │
├─────────────────────┤
│ 🔎 Pesquisar        │
├─────────────────────┤
│ Produto             │
│                     │
├─────────────────────┤
│ Produto             │
│                     │
├─────────────────────┤
│ Produto             │
└─────────────────────┘
```

---

# 17. Páginas

## Área pública

```text
/
```

Catálogo principal.

```text
/produto/[slug]
```

Detalhes do produto.

---

## Área administrativa

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

Edição de produto.

```text
/admin/categorias
```

Gerenciamento de categorias.

```text
/admin/configuracoes
```

Configurações da loja.

---

# 18. Requisitos funcionais

### RF01 — Catálogo

O sistema deverá permitir que visitantes visualizem os produtos publicados pelo administrador.

### RF02 — Pesquisa

O sistema deverá permitir pesquisar produtos pelo nome.

### RF03 — Categorias

O sistema deverá permitir filtrar produtos por categoria.

### RF04 — Filtros

O sistema deverá permitir filtrar produtos utilizando atributos cadastrados.

### RF05 — Detalhes

O sistema deverá apresentar as informações detalhadas de um produto.

### RF06 — Variações

O sistema deverá permitir selecionar atributos disponíveis de um produto.

### RF07 — Estoque

O sistema deverá apresentar a disponibilidade das combinações cadastradas.

### RF08 — WhatsApp

O sistema deverá permitir iniciar contato com o vendedor após o preenchimento das opções obrigatórias.

### RF09 — Autenticação

O sistema deverá permitir autenticação do administrador.

### RF10 — Produtos

O administrador deverá conseguir cadastrar, editar, ativar, desativar e excluir produtos.

### RF11 — Categorias

O administrador deverá conseguir gerenciar categorias.

### RF12 — Atributos

O administrador deverá conseguir cadastrar atributos e seus respectivos valores.

### RF13 — Estoque administrativo

O administrador deverá conseguir alterar a quantidade disponível de cada variante.

### RF14 — Imagens

O administrador deverá conseguir adicionar imagens aos produtos.

### RF15 — Configurações

O administrador deverá conseguir configurar o número de WhatsApp utilizado para contato.

---

# 19. Requisitos não funcionais

### RNF01 — Responsividade

A aplicação deverá funcionar adequadamente em dispositivos móveis e desktops.

### RNF02 — Segurança

Operações administrativas deverão exigir autenticação e autorização.

### RNF03 — Usabilidade

A interface deverá priorizar simplicidade e facilidade de navegação.

### RNF04 — Performance

A aplicação deverá otimizar carregamento de imagens e conteúdo.

### RNF05 — Manutenibilidade

O código deverá seguir a arquitetura modular, MVVM e Clean Architecture.

### RNF06 — Escalabilidade

A estrutura deverá permitir a inclusão de novos tipos de produtos e atributos sem alterações estruturais significativas.

### RNF07 — Disponibilidade

Os produtos publicados deverão estar disponíveis para consulta pública enquanto estiverem ativos.

---

# 20. Fora do escopo do MVP

Para manter o projeto simples e focado, os seguintes recursos não fazem parte do MVP:

- Carrinho de compras;
- Checkout;
- Pagamento online;
- PIX integrado;
- Cartão de crédito;
- Sistema de pedidos;
- Histórico de pedidos;
- Cálculo de frete;
- Integração com transportadoras;
- Cupons de desconto;
- Avaliações;
- Sistema de favoritos;
- Cadastro de clientes;
- Login de clientes;
- Marketplace;
- Múltiplos vendedores;
- Aplicativo mobile;
- Integração com ERP;
- WhatsApp Business API.

O processo de venda será realizado diretamente entre cliente e vendedor através do WhatsApp.

---

# 21. Backlog inicial

## Epic 01 — Configuração do projeto

- [ ] Criar projeto Next.js
- [ ] Configurar TypeScript
- [ ] Configurar estrutura modular
- [ ] Configurar arquitetura
- [ ] Configurar lint/format
- [ ] Configurar variáveis de ambiente
- [ ] Configurar Supabase

## Epic 02 — Banco de dados

- [ ] Criar tabelas
- [ ] Criar relacionamentos
- [ ] Criar índices
- [ ] Criar RLS
- [ ] Criar policies
- [ ] Configurar Storage

## Epic 03 — Autenticação

- [ ] Criar login administrativo
- [ ] Implementar sessão
- [ ] Implementar logout
- [ ] Proteger rotas administrativas

## Epic 04 — Categorias

- [ ] Listagem
- [ ] Cadastro
- [ ] Edição
- [ ] Ativação/desativação

## Epic 05 — Produtos

- [ ] Listagem administrativa
- [ ] Cadastro
- [ ] Edição
- [ ] Ativação/desativação
- [ ] Exclusão
- [ ] Upload de imagens

## Epic 06 — Atributos e variantes

- [ ] Cadastro de atributos
- [ ] Cadastro de valores
- [ ] Criação de variantes
- [ ] Controle de estoque
- [ ] Validação de combinações

## Epic 07 — Catálogo

- [ ] Layout responsivo
- [ ] Listagem
- [ ] Pesquisa
- [ ] Categorias
- [ ] Filtros
- [ ] Ordenação

## Epic 08 — Produto

- [ ] Página de detalhes
- [ ] Galeria de imagens
- [ ] Seleção de atributos
- [ ] Validação de disponibilidade
- [ ] Botão WhatsApp

## Epic 09 — Configurações

- [ ] Número WhatsApp
- [ ] Informações da loja
- [ ] Configurações públicas

## Epic 10 — Deploy

- [ ] Configurar ambiente de produção
- [ ] Configurar domínio
- [ ] Configurar HTTPS
- [ ] Configurar variáveis de ambiente
- [ ] Realizar testes de produção
- [ ] Monitorar aplicação

---

# 22. Estrutura de alto nível

```text
                         ┌─────────────────────┐
                         │       Cliente       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Next.js        │
                         │       React         │
                         │     TypeScript      │
                         └──────────┬──────────┘
                                    │
                   ┌────────────────┴────────────────┐
                   │                                 │
                   ▼                                 ▼
          ┌─────────────────┐              ┌─────────────────┐
          │ Área Pública    │              │ Área Admin      │
          │                 │              │                 │
          │ Catálogo        │              │ Produtos        │
          │ Produtos        │              │ Categorias      │
          │ Filtros         │              │ Estoque         │
          │ WhatsApp        │              │ Configurações   │
          └────────┬────────┘              └────────┬────────┘
                   │                                │
                   └────────────────┬───────────────┘
                                    │
                                    ▼
                           ┌─────────────────┐
                           │    Supabase     │
                           │                 │
                           │ PostgreSQL      │
                           │ Auth            │
                           │ Storage         │
                           │ RLS             │
                           └─────────────────┘
```

---

# 23. Estrutura de desenvolvimento

O desenvolvimento será realizado de forma incremental, priorizando inicialmente as funcionalidades essenciais para funcionamento do catálogo.

### Fase 1 — Fundação

```text
Next.js
TypeScript
Arquitetura
Supabase
Banco
Autenticação
```

### Fase 2 — Administração

```text
Categorias
Produtos
Imagens
Atributos
Variantes
Estoque
```

### Fase 3 — Catálogo

```text
Home
Produtos
Pesquisa
Filtros
Detalhes
```

### Fase 4 — Integração

```text
WhatsApp
Configurações
Validações
```

### Fase 5 — Qualidade

```text
Testes
Responsividade
Performance
Segurança
Deploy
```

---

# 24. Critério de conclusão do MVP

O MVP será considerado funcional quando:

- [ ] O administrador conseguir acessar o painel;
- [ ] O administrador conseguir criar categorias;
- [ ] O administrador conseguir cadastrar produtos;
- [ ] O administrador conseguir adicionar imagens;
- [ ] O administrador conseguir definir atributos;
- [ ] O administrador conseguir configurar variantes;
- [ ] O administrador conseguir controlar estoque;
- [ ] Produtos ativos aparecerem no catálogo;
- [ ] O cliente conseguir pesquisar produtos;
- [ ] O cliente conseguir utilizar filtros;
- [ ] O cliente conseguir visualizar detalhes;
- [ ] O cliente conseguir selecionar as opções disponíveis;
- [ ] O sistema impedir contato sem selecionar opções obrigatórias;
- [ ] O cliente conseguir abrir o WhatsApp com uma mensagem preenchida;
- [ ] A aplicação funcionar em desktop e mobile;
- [ ] As regras de segurança do banco estiverem configuradas;
- [ ] A aplicação estiver disponível em ambiente de produção.

---

# 25. Considerações

O Ezzion Imports foi planejado como um **catálogo virtual**, e não como uma plataforma completa de comércio eletrônico.

A principal finalidade do sistema é facilitar a divulgação dos produtos da loja e aproximar o cliente do vendedor.

A arquitetura foi planejada de forma modular para permitir futuras expansões, como:

- Carrinho;
- Pedidos;
- Pagamentos;
- Clientes cadastrados;
- Histórico de compras;
- Controle de vendas;
- Integrações externas;
- Aplicação mobile;
- Novos tipos de produtos.

Entretanto, essas funcionalidades permanecerão fora do escopo inicial para garantir que o MVP seja simples, funcional e adequado ao objetivo proposto.
