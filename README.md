Portfólio Acadêmico - Vinicius Gregorio

Este repositório contém o projeto de um Portfólio e Currículo pessoal desenvolvido como atividade acadêmica para o curso de Análise e Desenvolvimento de Sistemas do Centro Universitário Braz Cubas.

O objetivo deste projeto é aplicar os conceitos fundamentais de desenvolvimento Front-end, criando páginas web semânticas, estilizadas e com integração de elementos multimídia e gráficos vetoriais.

🚀 Tecnologias Utilizadas

HTML5: Estruturação semântica do conteúdo, criação de formulários complexos, incorporação de mídias nativas (áudio/vídeo) e renderização de gráficos.

CSS3: Estilização responsiva com Flexbox, Grid e media queries, paleta de cores consistente, efeitos de transição e usabilidade.


📁 Estrutura de Arquivos

O projeto está dividido em módulos funcionais. O arquivo principal consolida as informações, enquanto os demais arquivos demonstram funcionalidades específicas de forma isolada:

index.html: A página principal do projeto, que atua como uma "One-Page" integrando todas as seções (Sobre, Formação, Tecnologias, Projetos, Formulário, Multimídia, Gráficos e Contato).

curriculo.html: Página dedicada exclusivamente à estrutura do currículo profissional e acadêmico.

formulario.html: Demonstração de uso de formulários em HTML5 com validações nativas (RegEx para CPF, CEP e Telefone), além de inputs específicos como datas, cores e controles deslizantes (range).

multimidia.html: Página focada na incorporação de mídias, incluindo o uso das tags <video>, <audio> e <iframe> (para incorporação de vídeos do YouTube).

graficos.html: Exploração de recursos gráficos nativos do HTML, renderizando formas geométricas de duas maneiras: utilizando a API Canvas (via Javascript) e SVG (vetorial e escalável).

css/estilos.css: Folha de estilo única de todas as páginas, com paleta de cores, cartões (cards), menu de navegação, tipografia e as regras responsivas.

🌟 Funcionalidades em Destaque

Navegação Fixa (Sticky Header): Um menu de navegação que acompanha o usuário no topo da tela com rolagem suave (smooth scroll) entre as seções da página principal.

Validação de Formulários: O formulário possui atributos pattern utilizando expressões regulares para validar formatos específicos do lado do cliente (como CPF 000.000.000-00 e CEP).

Gráficos HTML5:

Canvas: Formas geométricas criadas programaticamente via Javascript (fillRect, arc).

SVG: Formas desenhadas com tags baseadas em XML (<rect>, <circle>, <polygon>) com total responsividade.

Integração de Mídia: Reprodução de arquivos locais e conteúdos de terceiros incorporados diretamente no navegador.

🔧 Como Executar o Projeto

Como trata-se de um projeto estático em HTML e CSS não é necessário instalar dependências ou rodar um servidor local complexo.

Faça o clone ou baixe o .zip deste repositório.

Extraia os arquivos para uma pasta no seu computador.

Dê um duplo clique no arquivo index.html para abri-lo em seu navegador web padrão (Google Chrome, Firefox, Edge, etc.).

👨‍💻 Autor

Vinicius Gregorio Oliveira Sanches

Estudante de Análise e Desenvolvimento de Sistemas

LinkedIn


Localização: / Mogi das Cruzes, SP - 2026.


📱 CP2 — Interface responsiva

O site do CP1 foi evoluído com a abordagem mobile-first: o CSS base atende o celular e as media queries com min-width (768px e 1024px) adicionam colunas e reorganizam o layout em telas maiores. O HTML é o mesmo em qualquer tela; só o CSS muda.

Onde cada técnica foi aplicada:

Flexbox
- Cabeçalho e menu (.nav-container e header nav ul): logo e links alinhados, com flex-wrap para os itens quebrarem de linha no celular. Em 768px o menu passa a ficar em linha, com o logo à esquerda e os links à direita.
- Cartões de projetos (.projetos-lista): flex: 1 1 240px, com um cartão por linha no celular e dois lado a lado quando há espaço.
- Também em .graficos-grid, .perfil-container e .atalhos.

Grid
- curriculo.html (.curriculo): 1 coluna no celular; em 768px vira 2 colunas (lateral 1fr + principal 2fr), e em 1024px a proporção muda para 1fr / 2.2fr.
- index.html (.container): 1 coluna no celular e 2 colunas a partir de 768px, com a tabela de tecnologias e os projetos ocupando a largura toda.

Media queries (mobile-first)
- @media (min-width: 768px): menu em linha, cabeçalho fixo (sticky) e grades de 2 colunas.
- @media (min-width: 1024px): ajustes de espaçamento e de proporção das colunas.

Outros cuidados: meta viewport em todas as páginas, imagens, vídeos, canvas e SVG com max-width: 100%, tabela com rolagem horizontal dentro do próprio cartão e campos de formulário com fonte de 16px.

Como testar: abra o DevTools (F12), ative o modo dispositivo e redimensione a janela em torno de 768px para ver o layout mudar.



🚀 CP3 — Git, deploy e JavaScript

Site publicado: https://vinigregorio007.github.io/meu-portfolio/
Repositório: https://github.com/vinigregorio007/meu-portfolio
Tag da entrega: cp3-entrega

O que foi adicionado:
- Versionamento com Git/GitHub, com commits descritivos, .gitignore e a tag cp3-entrega.
- Deploy no GitHub Pages (HTTPS automático) com as 5 páginas interligadas: index, curriculo, formulario, multimidia e graficos.
- js/scripts.js, carregado em todas as páginas.

Feature JavaScript + localStorage

Três recursos usam o localStorage e funcionam em todas as páginas do site (exceto o rascunho, que existe só em formulario.html):

| Recurso | O que faz | Chave no localStorage |
|---|---|---|
| Tema claro/escuro | O botão no menu alterna a paleta e a escolha é lembrada na próxima visita. Na primeira visita usa a preferência do sistema. | cp3_tema ("light" ou "dark") |
| Boas-vindas | Na primeira visita pergunta o nome; depois mostra "Olá, [nome]!". O botão "Não sou eu" apaga o nome. | cp3_nome |
| Rascunho do formulário | Salva automaticamente o que foi digitado e restaura ao reabrir a página. É apagado ao enviar ou ao clicar em Limpar. | cp3_rascunho (JSON) |

Formulário com validação: formulario.html valida nome, e-mail, telefone, CPF (com dígitos verificadores), CEP, data de nascimento e mensagem. Os erros aparecem abaixo de cada campo, o campo fica destacado e há uma mensagem de sucesso ou de erro na tela (sem usar alert). CPF, CEP e telefone ganham máscara enquanto se digita.

Como testar
1. Abra o site, clique em "Tema escuro", informe seu nome na barra do topo e recarregue (F5): tema e saudação continuam.
2. Navegue para outra página: o tema e a saudação continuam os mesmos.
3. Em Formulário, digite algo sem enviar e recarregue: o rascunho é restaurado.
4. Envie o formulário vazio para ver os erros; depois preencha corretamente para ver a mensagem de sucesso.
5. Confira os dados em DevTools → Application → Local Storage.

Estrutura final
meu-portfolio/
├── index.html
├── curriculo.html
├── formulario.html
├── multimidia.html
├── graficos.html
├── css/estilos.css
├── js/scripts.js
├── img/foto.svg (coloque também img/foto.jpg com a sua foto)
├── .gitignore
└── README.md
