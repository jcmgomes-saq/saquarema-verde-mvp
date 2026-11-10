# 📋 Requisitos — Saquarema Verde Online (MVP Front-End)

## Requisitos Funcionais (RF)

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF01 | O sistema deve exibir uma tela inicial com campo de busca de atrações | Alta |
| RF02 | O sistema deve listar as atrações naturais e culturais de Saquarema com nome, categoria, resumo e condição da trilha | Alta |
| RF03 | O sistema deve filtrar atrações a partir do termo buscado pelo usuário | Alta |
| RF04 | O sistema deve exibir a página de detalhe de cada atração: condição, dificuldade, duração, distância, regras de visitação, dicas de segurança e eventos programados | Alta |
| RF05 | O sistema deve exibir um selo visual de condição da atração (Aberta / Manutenção / Fechada) | Média |
| RF06 | O sistema deve permitir que o usuário publique um relato (nome, atração visitada e texto) na área Comunidade | Alta |
| RF07 | O sistema deve exibir os relatos publicados em ordem do mais recente para o mais antigo | Média |
| RF08 | O sistema deve validar os campos obrigatórios do formulário de relato (nome, atração e texto) | Alta |
| RF09 | O sistema deve exibir mensagem de confirmação após a publicação de um relato | Média |
| RF10 | O sistema deve permitir navegação entre as telas Início, Atrações e Comunidade sem recarregar a página (SPA) | Média |

## Requisitos Não-Funcionais (RNF)

| ID | Requisito | Categoria |
|----|-----------|-----------|
| RNF01 | O front-end deve ser executado localmente sem necessidade de instalação de dependências (site estático) | Portabilidade |
| RNF02 | A interface deve ser responsiva, funcionando em celulares, tablets e desktops (mobile-first) | Usabilidade |
| RNF03 | O sistema deve seguir boas práticas de acessibilidade (landmarks ARIA, rótulos em formulários, contraste mínimo de 4,5:1) | Acessibilidade |
| RNF04 | O código deve ser organizado em HTML, CSS e JS separados, com nomenclatura clara e comentários | Manutenibilidade |
| RNF05 | A identidade visual deve usar paleta de cores ligada à natureza (tons de verde) | Identidade visual |
| RNF06 | O sistema deve ser desenvolvido com tecnologias web padrão (HTML5, CSS3, JavaScript) | Compatibilidade |
| RNF07 | O repositório deve estar versionado no GitHub com README informativo | Organização |
| RNF08 | O sistema deve carregar a primeira tela em menos de 3 segundos em conexão comum | Desempenho |
| RNF09 | O sistema deve exibir mensagens amigáveis para estados vazios (ex.: busca sem resultados) | Usabilidade |
| RNF10 | No MVP, os dados são mockados no front-end, sem persistência em banco de dados (registrado como limitação) | Escopo |

## 🔀 Requisitos fora do escopo do MVP (evoluções futuras)
- Back-end com API REST e banco de dados;
- Autenticação de usuários e moderação de relatos;
- Mapa interativo com geolocalização;
- Painel administrativo para atualizar condições das trilhas;
- Agendamento de visitas guiadas.
