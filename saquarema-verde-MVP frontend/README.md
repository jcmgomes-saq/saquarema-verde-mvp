# 🌿 Saquarema Verde Online — MVP Front-End (integrado à API)

## 👥 Dados dos integrantes
| Nome | Matrícula | Curso/Turma |
|------|-----------|-------------|
| Nome do integrante 1 | 000000 | Sistemas de Informação — Turma X |
| Nome do integrante 2 | 000000 | Sistemas de Informação — Turma X |
| Nome do integrante 3 | 000000 | Sistemas de Informação — Turma X |

## 🎯 Situação-problema escolhida
**Situação-Problema #3: Circuito Saquarema Verde.** Turistas e moradores de Saquarema/RJ têm dificuldade para acessar informações atualizadas sobre as atrações naturais e culturais da região (condições das trilhas, eventos programados, dicas de segurança e regras de visitação do Parque Estadual da Costa do Sol e da Reserva Ecológica Estadual de Jacarepia).

## 💡 Descrição sucinta do MVP
SPA que consome a **API REST do MVP Back-End** para centralizar informações sobre as atrações de Saquarema:
1. **Buscar e descobrir** atrações naturais e culturais (tela inicial);
2. **Consultar detalhes** de cada atração: condição da trilha, horários, dificuldade, duração e eventos programados;
3. **Interagir com a comunidade**, publicando relatos sobre as visitas.

Os dados vêm de `fetch` para a API (não há mais dados mockados). Se a API estiver offline, a tela exibe mensagem amigável com opção de tentar novamente.

## ▶️ Como executar localmente
Pré-requisito: o **back-end** rodando em `http://localhost:3000/api` (veja o repositório `saquarema-verde-backend`: `npm install && npm start`).

Como é um site estático, basta abrir o `index.html` no navegador. Para uma melhor experiência, use um servidor local:

```bash
# Python 3
python -m http.server 5500
# Acesse http://localhost:5500

# ou Node.js
npx serve .
```

### Trocar a URL da API
Por padrão o front aponta para `http://localhost:3000/api`. Para usar outra URL (ex.: API em produção), defina antes de carregar o `app.js`:

```html
<script>window.SVQ_API_URL = "https://sua-api.com/api";</script>
```

## 🖥️ Prototipação (3 telas)
1. **Tela Inicial (Home)** — hero com busca, atrações em destaque, novidades e proposta de valor;
2. **Tela Atrações** — lista com filtros e página de detalhe de cada atração (eventos + relatos);
3. **Tela Comunidade** — formulário de relato + feed de comentários;
4. **Tela Administração (extra)** — login do administrador (JWT) e painel para gerenciar disponibilidade das trilhas (condição e horários), criar/editar/excluir eventos e publicar novidades.

Protótipo navegável desenvolvido no **Figma** (link do projeto no repositório: `docs/prototipo.md`).

## 📁 Estrutura do projeto
```
saquarema-verde-online/
├── index.html          # Estrutura da SPA
├── assets/
│   ├── style.css       # Estilos e responsividade
│   ├── app.js          # Rotas, chamadas fetch à API e interações
│   └── img/            # Ilustrações SVG das atrações
├── docs/
│   ├── requisitos.md   # Requisitos funcionais e não-funcionais
│   └── prototipo.md    # Link e descrição das telas do protótipo
└── README.md
```

## 🔌 Integração com a API (resumo)
| Tela | Endpoint(s) consumido(s) |
|------|--------------------------|
| Início | `GET /atracoes`, `GET /noticias?limite=3` |
| Atrações | `GET /atracoes`, `GET /atracoes?q=`, `GET /atracoes/:id` |
| Comunidade | `GET /relatos?limite=20`, `POST /relatos` |
| Administração | `POST /auth/login`, `PUT /atracoes/:id`, `GET/POST/PUT/DELETE /eventos`, `POST /noticias` |

## 📋 Requisitos
Veja a lista completa em [`docs/requisitos.md`](docs/requisitos.md).

## 🛠️ Tecnologias
HTML5, CSS3 e JavaScript puro (sem frameworks), consumindo a API REST do MVP Back-End.

## ℹ️ Informações adicionais
- MVP desenvolvido para fins acadêmicos;
- Acessibilidade: landmarks ARIA, foco gerenciado, contraste adequado;
- O CORS da API já está liberado para facilitar a integração local;
- O token do administrador fica em `sessionStorage` e expira conforme `JWT_EXPIRES_IN` do back-end;
- Evoluções futuras: edição de atrações completas, moderação de relatos, mapa interativo, paginação e cache.

## 🔀 Versionamento no GitHub
```bash
git init
git add .
git commit -m "MVP Front-End Saquarema Verde Online (consumindo API)"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/saquarema-verde-online.git
git push -u origin main
```
