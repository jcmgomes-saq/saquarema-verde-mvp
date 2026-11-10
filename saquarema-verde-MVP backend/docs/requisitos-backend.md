##Requisitos do MVP Back-End — Saquarema Verde Online

##  Escopo (o que o MVP NÃO faz)
O escopo abaixo alinha as expectativas do cliente com a compreensão do problema pela equipe:

- Não realiza pagamentos, reservas ou venda de ingressos;
- Não envia e-mails nem notificações push;
- Não faz upload de fotos nos relatos;
- Não possui moderação de relatos nem cadastro de visitantes (qualquer pessoa publica);
- Não integra com sistemas externos (ex.: prefeitura, INEA) — dados são mantidos pelos administradores;
- Não inclui front-end (entregue em repositório separado) nem implantação em nuvem;
- Não implementa recuperação de senha do administrador (senha alterada manualmente).

##  Requisitos Funcionais (RF)

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF01 | A API deve listar as atrações com nome, categoria, descrição, dificuldade, duração, distância, condição e horários | Alta |
| RF02 | A API deve filtrar atrações por termo de busca (`?q=`) | Alta |
| RF03 | A API deve exibir o detalhe de uma atração incluindo eventos programados e últimos relatos | Alta |
| RF04 | O sistema deve disponibilizar login para administradores com e-mail e senha | Alta |
| RF05 | Administradores autenticados devem poder **atualizar a disponibilidade** das atrações (condição Aberta/Manutenção/Fechada, horários e descrição) | Alta |
| RF06 | Administradores autenticados devem poder cadastrar, atualizar e remover **eventos** e suas datas/horários | Alta |
| RF07 | Administradores autenticados devem poder publicar **novidades** sobre a região | Média |
| RF08 | A API deve permitir que visitantes publiquem **relatos** (nome, atração e texto) e listá-los do mais recente ao mais antigo | Alta |
| RF09 | A API deve validar todos os campos obrigatórios e formatos (e-mail, data/hora, condição) | Alta |
| RF10 | A API deve disponibilizar rota de verificação de saúde (`/api/saude`) para monitoramento | Baixa |

##  Requisitos Não-Funcionais (RNF) — exigências do desafio

| ID | Exigência | Requisito | Categoria |
|----|-----------|-----------|-----------|
| RNF01 | **Gestão de Disponibilidade** | Atualizações de condição/horários/eventos por administradores refletem imediatamente nas consultas públicas | Funcionalidade |
| RNF02 | **Desempenho Rápido** | Consultas com índices, paginação por limite, limite de corpo de 100 kb e respostas em JSON enxutas | Desempenho |
| RNF03 | **Interface Intuitiva** | API REST padronizada: rotas em português claro, verbos HTTP corretos, respostas com `total` + coleção, erros no formato `{erro}` ou `{erros: []}` | Usabilidade |
| RNF04 | **Segurança de Dados** | Senhas com bcrypt (custo 10), JWT com expiração, cabeçalhos helmet, rate limit no login (5 tentativas/10 min), validação e consultas parametrizadas (sem SQL injection) | Segurança |
| RNF05 | **Login para Administradores** | Autenticação JWT obrigatória em todas as rotas administrativas; rotas públicas sem token | Segurança |
| RNF06 | Persistência em banco relacional SQLite, sem dependência de serviços externos | Portabilidade |
| RNF07 | Código organizado em `src/`, `test/` e `data/`, com camadas (rotas → controladores → banco) | Manutenibilidade |
| RNF08 | Testes automatizados cobrindo autenticação, validação, regras de negócio e permissões | Qualidade |

##  Fora do escopo do MVP (evoluções futuras)
- Banco PostgreSQL em produção e migrations versionadas;
- Refresh tokens e recuperação de senha;
- Moderação de relatos e perfis de visitantes;
- Cache (Redis) e rate limiting distribuído;
- CI/CD e deploy automatizado.
