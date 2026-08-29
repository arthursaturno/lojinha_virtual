Implemente o MVP da Ezzion Imports usando a imagem `docs/design/street-drop-reference.png` como fonte visual principal.

Antes de alterar o código:

1. Leia completamente o `AGENTS.md`, o `README.md` e o `docs/design/DESIGN_SPEC.md`.
2. Inspecione a imagem de referência diretamente.
3. Analise o projeto existente e apresente um plano curto.
4. Não comece a implementação até compreender a estrutura visual e funcional.

Objetivo:

Criar um catálogo responsivo para desktop e celular. O cliente deve pesquisar e filtrar produtos, abrir os detalhes, selecionar todas as variações obrigatórias e entrar em contato pelo WhatsApp. Não haverá carrinho, checkout, pagamento ou login de cliente.

Direção visual:

* Reproduza fielmente o conceito Street Drop.
* Use roupas como foco principal da loja.
* Não use rostos identificáveis nas imagens; os modelos devem aparecer cortados do pescoço para baixo.
* Preserve a identidade preta, branca e verde-lima.
* Extraia a cor verde exata da referência; não escolha um verde aproximado.
* Identifique e utilize fontes equivalentes às da referência.
* O título principal deve utilizar uma fonte condensada e pesada.
* Os filtros de categoria devem ser checkboxes quadrados, pretos e personalizados como na referência.
* Não substitua os checkboxes por botões de rádio nativos.
* Use um ícone oficial do WhatsApp proveniente de uma biblioteca de ícones.
* O botão do WhatsApp deve reproduzir cor, ícone, altura, espaçamento e tipografia da referência.
* Não utilize emojis ou caracteres de texto como ícones.
* Não crie gradientes, sombras, bordas ou arredondamentos que não estejam presentes na referência.

Funcionalidades da vitrine:

* Pesquisa de produtos.
* Filtros por categoria, tamanho, cor, modelo e preço.
* Ordenação.
* Catálogo responsivo.
* Detalhes do produto em drawer ou modal.
* Seleção obrigatória de tamanho, cor e modelo.
* Atualização de preço e estoque conforme a variante.
* Botão do WhatsApp desabilitado até todas as opções obrigatórias serem selecionadas.
* Mensagem do WhatsApp preenchida com produto, tamanho, cor, modelo, preço e link.
* Não implementar carrinho, checkout, pagamento ou login.

Painel administrativo:

* Produtos.
* Categorias.
* Atributos dinâmicos.
* Variantes.
* Preço e estoque por variante.
* Imagens.
* Configurações da loja.
* Número do WhatsApp.
* Tabela de produtos e editor de variantes seguindo a referência.

Stack:

* Next.js com App Router.
* React.
* TypeScript.
* Supabase.
* Componentes reutilizáveis.
* Tipagem estrita.
* Responsividade mobile-first.

Critérios de conclusão:

* Compare a implementação com a imagem de referência em desktop e mobile.
* Tire capturas nas mesmas dimensões da referência.
* Corrija diferenças de fonte, cores, alinhamento, espaçamento, imagens, filtros e botões.
* Teste pesquisa, filtros, produto, variações e painel.
* Execute lint, verificação de tipos, testes e build.
* Não considere concluído apenas porque o código compila.
* Considere concluído somente quando não houver diferenças visuais relevantes em relação à referência.

Durante a implementação, não invente decisões visuais. Quando a referência não for suficiente, pergunte antes de alterar a direção.
