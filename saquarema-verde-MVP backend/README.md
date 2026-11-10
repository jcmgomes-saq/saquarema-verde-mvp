#  Saquarema Verde Online — MVP Back-End

##  Dados dos integrantes
| Nome | Matrícula | Curso/Turma |
|------|-----------|-------------|
| JOSE CESAR MEDEIROS GOMES | 06012011 | Analise e Desenvolvimento de Software — 4º |
| DOUGLAS STEFANIE DE SOUZA | 000000 | Analise e Desenvolvimento de Software — 4º | |
| VINÍCIUS JOSÉ DE ALMEIDA DE FREITAS | 000000 | Analise e Desenvolvimento de Software — 4º | |

##  Situação-problema escolhida
**Situação-Problema #3: Circuito Saquarema Verde.** Turistas e moradores têm dificuldade para acessar informações atualizadas sobre as atrações naturais e culturais de Saquarema/RJ — condições das trilhas, eventos programados, dicas de segurança e regras de visitação do Parque Estadual da Costa do Sol e da Reserva Ecológica Estadual de Jacarepia.

##  Descrição sucinta do MVP
API REST que serve o front-end "Saquarema Verde Online". Permite a **consulta pública** de atrações, eventos e relatos da comunidade, e oferece **área restrita a administradores** (login com JWT) para a **gestão de disponibilidade**: atualizar condição das trilhas (Aberta/Manutenção/Fechada), horários de funcionamento, eventos e novidades.

Atende às exigências do desafio: gestão de disponibilidade, desempenho rápido (índices + paginação), interface intuitiva (REST padronizado), segurança de dados (bcrypt + JWT + rate limit) e login para administradores.

## Como executar localmente
Pré-requisito: Node.js 18 ou superior.

```bash
npm install          # instala as dependências
npm run seed         # (opcional) popula o banco — também roda automaticamente ao iniciar
npm start            # inicia a API em http://localhost:3000/api
```

Configuração (opcional): copie `.env.example` para `.env` e ajuste `JWT_SECRET` e `ADMIN_SENHA`. As variáveis também podem ser exportadas no terminal.

### Acesso do administrador (seed)
| Campo | Valor |
|-------|-------|
| E-mail | `admin@saquaremaverde.local` |
| Senha | `Admin@123` (ou valor de `ADMIN_SENHA`) |

⚠️ Altere essas credenciais antes de qualquer ambiente compartilhado.

##  Testes
```bash
npm test
```
Suite com `node:test` cobrindo: listagem/filtro de atrações, detalhe com eventos e relatos, validação de relatos, login, proteção de rotas administrativas e gestão de disponibilidade.

##  Estrutura de diretórios
```
saquarema-verde-backend/
├── src/
│   ├── config/         # variáveis de ambiente
│   ├── database/       # conexão SQLite + seed
│   ├── middlewares/    # auth JWT, rate limit, tratamento de erros
│   ├── controllers/    # regras de negócio
│   ├── routes/         # definição das rotas
│   ├── utils/          # validações
│   ├── app.js          # configuração do Express
│   └── server.js       # ponto de entrada
├── test/               # testes automatizados (node:test)
├── data/               # banco SQLite gerado em runtime
├── docs/
│   └── requisitos-backend.md   # escopo + RF/RNF
├── .env.example
├── package.json
└── README.md
```

##  Principais rotas

### Públicas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/saude` | Verificação de saúde |
| GET | `/api/atracoes?q=` | Lista de atrações (com filtro opcional) |
| GET | `/api/atracoes/:id` | Detalhe com eventos e últimos relatos |
| GET | `/api/eventos` | Eventos futuros |
| GET | `/api/relatos` | Relatos recentes (`?limite=`) |
| POST | `/api/relatos` | Publicar relato |
| GET | `/api/noticias` | Novidades |
| POST | `/api/auth/login` | Login do administrador |

### Administrativas (Bearer token)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/atracoes` | Cadastrar atração |
| PUT | `/api/atracoes/:id` | Atualizar condição/horários/descrição |
| POST/PUT/DELETE | `/api/eventos[/:id]` | Gerenciar eventos |
| POST | `/api/noticias` | Publicar novidade |

### Exemplos rápidos
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"admin@saquaremaverde.local","senha":"Admin@123"}'

# Atualizar disponibilidade da trilha (use o token do login)
curl -X PUT http://localhost:3000/api/atracoes/3   -H "Content-Type: application/json"   -H "Authorization: Bearer SEU_TOKEN"   -d '{"condicao":"Aberta","horarios":"07:00 às 16:00"}'

# Publicar relato (público)
curl -X POST http://localhost:3000/api/relatos   -H "Content-Type: application/json"   -d '{"nome":"Ana P.","atracao_id":1,"texto":"Passeio maravilhoso, trilha bem sinalizada!"}'
```

##  Tecnologias
Node.js, Express, SQLite (better-sqlite3), bcryptjs, jsonwebtoken, helmet. Testes com `node:test`.

##  Informações adicionais
- O banco é criado automaticamente em `data/saquarema.db` no primeiro start;
- A API já libera CORS para facilitar a integração com o front-end local;
- O front-end do MVP (repositório/entrega separada) consome esta API — basta apontar as chamadas de `fetch` para `http://localhost:3000/api`;
- Projeto desenvolvido para fins acadêmicos.

##  Versionamento no GitHub
```bash
git init
git add .
git commit -m "MVP Back-End Saquarema Verde Online"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/saquarema-verde-backend.git
git push -u origin main
```
