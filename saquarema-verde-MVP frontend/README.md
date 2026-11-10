# Saquarema Verde — MVP Front-End

## Dados dos integrantes
| Nome | Matrícula | Curso/Semestre |
|------|-----------|-------------|
| Jose Cesar Medeiros Gomes | 06012011 | Análise e Desenvolvimento de Software — 4º |

## Situação-problema escolhida
**Situação-Problema #3: Circuito Saquarema Verde.** Turistas e moradores de Saquarema/RJ têm dificuldade para acessar informações atualizadas sobre as atrações naturais e culturais da região (condições das trilhas, eventos programados, dicas de segurança e regras de visitação do Parque Estadual da Costa do Sol e da Reserva Ecológica de Jacarepia).

## Descrição sucinta do MVP
Plataforma web (SPA) que centraliza informações sobre as atrações de Saquarema, permitindo:
1. **Buscar e descobrir** atrações naturais e culturais (tela inicial);
2. **Consultar detalhes** de cada atração: condição da trilha, dificuldade, duração, regras de visitação e eventos programados;
3. **Interagir com a comunidade**, publicando relatos sobre as visitas.

O MVP é 100% front-end, com dados mockados em JavaScript, roteamento por hash e design responsivo.

## Prototipação (3 telas)
1. **Tela Inicial (Home)** — hero com busca, atrações em destaque e proposta de valor;
2. **Tela Atrações** — lista com filtros e página de detalhe de cada atração;
3. **Tela Comunidade** — formulário de relato + feed de comentários.

Protótipo navegável desenvolvido no **Figma** (link do projeto no repositório: `docs/prototipo.md`).

## Como executar localmente
Como é um site estático, basta abrir o `index.html` no navegador. Para uma melhor experiência (evitando bloqueios de CORS em alguns navegadores), use um servidor local:

```bash
# Python 3
python -m http.server 5500
# Acesse http://localhost:5500

# ou Node.js
npx serve .
```

## Estrutura do projeto
```
saquarema-verde-online/
├── index.html          # Estrutura da SPA
├── assets/
│   ├── style.css       # Estilos e responsividade
│   └── app.js          # Dados mockados, rotas e interações
├── docs/
│   └── requisitos.md   # Requisitos funcionais e não-funcionais
│   └── prototipo.md    # Link e descrição das telas do protótipo
└── README.md
```

## Requisitos
Veja a lista completa em [`docs/requisitos.md`](docs/requisitos.md).

## Tecnologias
HTML5, CSS3 e JavaScript puro (sem frameworks), para máxima leveza e fácil execução local.

## Informações adicionais
- MVP desenvolvido para fins acadêmicos;
- Acessibilidade: landmarks ARIA, foco gerenciado, contraste adequado;
- Próximos passos: back-end com API real, autenticação, mapa interativo e integração com agendamento de guias.
