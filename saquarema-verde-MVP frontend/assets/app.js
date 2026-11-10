/* Saquarema Verde Online — MVP Front-End
   SPA simples com roteamento por hash e dados mockados. */

const ATRACOES = [
  {
    id: "costa-do-sol",
    nome: "Parque Estadual da Costa do Sol",
    categoria: "Trilha",
    imagem: "assets/img/costa-do-sol.svg",
    resumo: "Trilhas costeiras com mirantes, praias desertas e observação de aves.",
    condicao: "Aberta",
    dificuldade: "Moderada",
    duracao: "2h30",
    distancia: "4,5 km",
    regras: ["Não alimentar a fauna", "Levar de volta todo o lixo", "Ficar nas trilhas demarcadas", "Proibido som alto"],
    dicas: ["Levar água e protetor solar", "Calçado fechado recomendado", "Evitar horário de maior calor"],
    eventos: ["Observação de aves — sábados 7h", "Limpeza de praia — 1º domingo do mês"]
  },
  {
    id: "jacarepia",
    nome: "Reserva Ecológica Estadual de Jacarepia",
    categoria: "Reserva",
    imagem: "assets/img/jacarepia.svg",
    resumo: "Área de preservação com vegetação de restinga, lagoas e fauna silvestre.",
    condicao: "Aberta",
    dificuldade: "Fácil",
    duracao: "1h30",
    distancia: "2,8 km",
    regras: ["Visitas somente com guia", "Limite de 20 visitantes por grupo", "Proibido drone sem autorização"],
    dicas: ["Agendar com antecedência", "Levar repelente", "Roupas claras e confortáveis"],
    eventos: ["Trilha interpretativa com guia — quartas e domingos"]
  },
  {
    id: "pedra-do-padrao",
    nome: "Pedra do Padrão",
    categoria: "Mirante",
    imagem: "assets/img/pedra-do-padrao.svg",
    resumo: "Mirante com vista panorâmica de Saquarema e do litoral fluminense.",
    condicao: "Manutenção",
    dificuldade: "Difícil",
    duracao: "3h",
    distancia: "5,2 km",
    regras: ["Visitar somente em dia seco", "Grupos de até 10 pessoas"],
    dicas: ["Não recomendado após chuva (escorregadia)", "Levar lanterna para retornos tardios"],
    eventos: []
  },
  {
    id: "praca-santana",
    nome: "Centro Histórico e Igreja de Sant'Ana",
    categoria: "Cultural",
    imagem: "assets/img/centro-historico.svg",
    resumo: "Centro histórico, arquitetura colonial e vista clássica sobre a Lagoa de Saquarema.",
    condicao: "Aberta",
    dificuldade: "Fácil",
    duracao: "1h",
    distancia: "1,5 km",
    regras: ["Respeitar horários de visitação da igreja"],
    dicas: ["Ótimo pôr do sol na orla da lagoa", "Comércio local ao redor"],
    eventos: ["Feira de artesanato — fins de semana"]
  }
];

const COMENTARIOS = [
  { autor: "Mariana L.", quando: "12/10/2026", texto: "Trilha da Costa do Sol incrível! O mirante no final vale cada passo." },
  { autor: "Rafael T.", quando: "05/10/2026", texto: "A reserva de Jacarepia é um tesouro. O guia explicou muito sobre a restinga." }
];

const rotas = {
  home: renderHome,
  atracoes: renderAtracoes,
  comunidade: renderComunidade
};

/* ---------- Helpers ---------- */
const seloCondicao = (condicao) => {
  const mapa = { "Aberta": "selo--aberta", "Manutenção": "selo--manutencao", "Fechada": "selo--fechada" };
  return `<span class="selo ${mapa[condicao] || "selo--aberta"}">${condicao}</span>`;
};

function escapeHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function encontrarAtracao(id) {
  return ATRACOES.find((a) => a.id === id);
}

/* ---------- Tela 1: Home ---------- */
function renderHome() {
  const destaques = ATRACOES.slice(0, 3)
    .map(
      (a) => `
      <article class="cartao">
        <img src="${a.imagem}" alt="Imagem ilustrativa de ${a.nome}" />
        ${seloCondicao(a.condicao)}
        <h3>${a.nome}</h3>
        <p>${a.resumo}</p>
        <a class="btn" href="#/atracao/${a.id}">Ver detalhes</a>
      </article>`
    )
    .join("");

  return `
    <section class="hero">
      <h1>Descubra Saquarema com turismo sustentável</h1>
      <p>Trilhas, eventos, condições atualizadas e regras de visitação do Parque Estadual da Costa do Sol e da Reserva Ecológica de Jacarepia, em um só lugar.</p>
      <form class="busca" id="form-busca" role="search">
        <input id="campo-busca" type="search" placeholder="Buscar atração, trilha ou evento..." aria-label="Buscar atração" />
        <button type="submit">Buscar</button>
      </form>
    </section>

    <section class="secao">
      <h2>Atrações em destaque</h2>
      <div class="grade">${destaques}</div>
    </section>

    <section class="secao">
      <h2>Por que Saquarema Verde Online?</h2>
      <div class="grade">
        <div class="cartao"><h3>📍 Planeje sua visita</h3><p>Duração, dificuldade e distância das trilhas para escolher o passeio ideal.</p></div>
        <div class="cartao"><h3>🛡️ Segurança em 1º lugar</h3><p>Condições atualizadas das trilhas e dicas de segurança antes de sair de casa.</p></div>
        <div class="cartao"><h3>🤝 Comunidade</h3><p>Relatos de visitantes e eventos que aproximam turistas e moradores.</p></div>
      </div>
    </section>`;
}

/* ---------- Tela 2: Atrações (lista + detalhe) ---------- */
function renderAtracoes(filtro = "") {
  const termo = filtro.toLowerCase();
  const lista = ATRACOES.filter(
    (a) =>
      a.nome.toLowerCase().includes(termo) ||
      a.categoria.toLowerCase().includes(termo) ||
      a.resumo.toLowerCase().includes(termo)
  );

  if (lista.length === 0) {
    return `
      <section class="secao">
        <h2>Nenhuma atração encontrada</h2>
        <p>Tente buscar por outro termo ou <a href="#/atracoes">ver todas as atrações</a>.</p>
      </section>`;
  }

  const cartoes = lista
    .map(
      (a) => `
      <article class="cartao">
        <img src="${a.imagem}" alt="Imagem ilustrativa de ${a.nome}" />
        ${seloCondicao(a.condicao)}
        <h3>${a.nome}</h3>
        <p><strong>${a.categoria}</strong> · ${a.dificuldade} · ${a.duracao} · ${a.distancia}</p>
        <p>${a.resumo}</p>
        <a class="btn" href="#/atracao/${a.id}">Ver detalhes</a>
      </article>`
    )
    .join("");

  return `
    <section class="secao">
      <h2>Atrações naturais e culturais de Saquarema</h2>
      ${filtro ? `<p>Resultados para: <strong>"${escapeHtml(filtro)}"</strong></p>` : ""}
      <div class="grade">${cartoes}</div>
    </section>`;
}

function renderDetalhe(id) {
  const a = encontrarAtracao(id);
  if (!a) return `<section class="secao"><h2>Atração não encontrada</h2><a href="#/atracoes">Voltar para atrações</a></section>`;

  const eventos = a.eventos.length
    ? `<ul>${a.eventos.map((e) => `<li>${e}</li>`).join("")}</ul>`
    : "<p>Nenhum evento programado no momento. Volte em breve!</p>";

  return `
    <section class="secao detalhe">
      <a href="#/atracoes">← Voltar para atrações</a>
      <br /><br />
      <img src="${a.imagem}" alt="Imagem ilustrativa de ${a.nome}" />
      <h2>${a.nome}</h2>
      <p>${seloCondicao(a.condicao)} &nbsp; <strong>${a.categoria}</strong> · Dificuldade: ${a.dificuldade} · Duração: ${a.duracao} · Distância: ${a.distancia}</p>
      <p>${a.resumo}</p>

      <h3>Regras de visitação</h3>
      <ul class="lista-dicas">${a.regras.map((r) => `<li>${r}</li>`).join("")}</ul>

      <h3>Dicas de segurança</h3>
      <ul class="lista-dicas">${a.dicas.map((d) => `<li>${d}</li>`).join("")}</ul>

      <h3>Eventos programados</h3>
      ${eventos}
    </section>`;
}

/* ---------- Tela 3: Comunidade ---------- */
function renderComunidade() {
  const comentarios = COMENTARIOS.map(
    (c) => `<div class="comentario"><strong>${escapeHtml(c.autor)}</strong><small>${c.quando}</small><p>${escapeHtml(c.texto)}</p></div>`
  ).join("");

  return `
    <section class="secao">
      <h2>Comunidade Saquarema Verde</h2>
      <p>Compartilhe sua experiência e fique por dentro da preservação da nossa região.</p>
    </section>

    <section class="secao">
      <div id="msg-sucesso" class="mensagem" role="status">Obrigado! Seu relato foi publicado (MVP: salvo apenas nesta sessão).</div>
      <form class="formulario" id="form-comentario">
        <div>
          <label for="nome">Nome</label>
          <input id="nome" name="nome" type="text" required maxlength="60" placeholder="Seu nome" />
        </div>
        <div>
          <label for="atracao">Atração visitada</label>
          <select id="atracao" name="atracao" required>
            <option value="">Selecione...</option>
            ${ATRACOES.map((a) => `<option value="${a.id}">${a.nome}</option>`).join("")}
          </select>
        </div>
        <div>
          <label for="relato">Relato</label>
          <textarea id="relato" name="relato" rows="4" required maxlength="500" placeholder="Como foi sua visita?"></textarea>
        </div>
        <button class="btn" type="submit">Publicar relato</button>
      </form>
    </section>

    <section class="secao">
      <h2>Relatos recentes</h2>
      <div id="lista-comentarios">${comentarios}</div>
    </section>`;
}

/* ---------- Roteamento ---------- */
function roteador() {
  const hash = location.hash.replace(/^#\/?/, "");
  const conteudo = document.getElementById("conteudo");
  const [rota, parametro] = hash.split("/");

  let html = "";
  if (rota === "atracao") html = renderDetalhe(parametro);
  else if (rota === "atracoes") html = renderAtracoes();
  else if (rota === "comunidade") html = renderComunidade();
  else html = renderHome();

  conteudo.innerHTML = html;
  conteudo.focus({ preventScroll: true });

  const paginaAtiva = ["atracoes", "comunidade"].includes(rota) ? rota : "home";
  document.querySelectorAll(".menu a").forEach((link) => {
    if (link.dataset.rota === paginaAtiva) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  configurarEventosDaTela(rota);
  window.scrollTo({ top: 0 });
}

/* ---------- Interações por tela ---------- */
function configurarEventosDaTela(rota) {
  if (rota === "" || rota === "home") {
    const form = document.getElementById("form-busca");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const termo = document.getElementById("campo-busca").value.trim();
      location.hash = termo ? `#/atracoes?q=${encodeURIComponent(termo)}` : "#/atracoes";
    });
  }

  if (rota === "atracoes") {
    const [, query = ""] = location.hash.split("?");
    const termo = new URLSearchParams(query).get("q") || "";
    if (termo) {
      document.getElementById("conteudo").innerHTML = renderAtracoes(termo);
    }
  }

  if (rota === "comunidade") {
    const form = document.getElementById("form-comentario");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = document.getElementById("nome").value.trim();
      const relato = document.getElementById("relato").value.trim();
      if (!nome || !relato) return;

      const data = new Date().toLocaleDateString("pt-BR");
      const novo = `<div class="comentario"><strong>${escapeHtml(nome)}</strong><small>${data}</small><p>${escapeHtml(relato)}</p></div>`;
      document.getElementById("lista-comentarios").insertAdjacentHTML("afterbegin", novo);
      form.reset();
      const msg = document.getElementById("msg-sucesso");
      msg.classList.add("mensagem--visivel");
      setTimeout(() => msg.classList.remove("mensagem--visivel"), 4000);
    });
  }
}

/* ---------- Menu mobile ---------- */
const menuToggle = document.querySelector(".menu-toggle");
menuToggle?.addEventListener("click", () => {
  const menu = document.getElementById("menu-principal");
  const aberto = menu.classList.toggle("menu--aberto");
  menuToggle.setAttribute("aria-expanded", String(aberto));
});

window.addEventListener("hashchange", roteador);
roteador();
