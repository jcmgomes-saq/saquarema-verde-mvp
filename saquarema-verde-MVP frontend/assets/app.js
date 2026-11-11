/* Saquarema Verde Online — MVP Front-End
   SPA que consome a API real do MVP Back-End, incluindo tela de administração. */

const API_URL = window.SVQ_API_URL || "http://localhost:3000/api";
const CHAVE_TOKEN = "svq_token";

/* ---------- Camada de acesso à API ---------- */
async function api(caminho, opcoes = {}) {
  const resposta = await fetch(API_URL + caminho, {
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });
  if (resposta.status === 204) return null;
  let corpo = null;
  try { corpo = await resposta.json(); } catch { /* resposta vazia */ }
  if (!resposta.ok) {
    const detalhe = corpo?.erro || corpo?.erros?.join(" ") || `Erro ${resposta.status}`;
    throw new Error(detalhe);
  }
  return corpo;
}

const apiGet = (caminho) => api(caminho);
const apiPost = (caminho, dados) => api(caminho, { method: "POST", body: JSON.stringify(dados) });

/* ---------- Sessão do administrador ---------- */
function tokenAdmin() { return sessionStorage.getItem(CHAVE_TOKEN); }
function salvarToken(token) { sessionStorage.setItem(CHAVE_TOKEN, token); }
function limparSessao() { sessionStorage.removeItem(CHAVE_TOKEN); }

async function apiAutenticada(caminho, opcoes = {}) {
  const token = tokenAdmin();
  try {
    return await api(caminho, {
      ...opcoes,
      headers: { ...(opcoes.headers || {}), Authorization: `Bearer ${token}` },
    });
  } catch (erro) {
    if (/401/.test(erro.message)) {
      limparSessao();
      throw new Error("Sessão expirada. Faça login novamente.");
    }
    throw erro;
  }
}

/* ---------- Helpers de interface ---------- */
function escapeHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}

const seloCondicao = (condicao) => {
  const mapa = { "Aberta": "selo--aberta", "Manutenção": "selo--manutencao", "Fechada": "selo--fechada" };
  return `<span class="selo ${mapa[condicao] || "selo--aberta"}">${escapeHtml(condicao || "Aberta")}</span>`;
};

function estadoCarregando() {
  return `<section class="secao"><p>Carregando...</p></section>`;
}

function estadoErro(mensagem) {
  return `
    <section class="secao">
      <div class="mensagem mensagem--erro mensagem--visivel" role="alert">
        Não foi possível falar com a API (${escapeHtml(mensagem)}).
        Verifique se o back-end está rodando em <strong>${escapeHtml(API_URL)}</strong>
        e <a href="#" id="tentar-novamente">tente novamente</a>.
      </div>
    </section>`;
}

function ligarTentarNovamente() {
  document.getElementById("tentar-novamente")?.addEventListener("click", (e) => {
    e.preventDefault();
    roteador();
  });
}

function mostrarMensagem(id, texto, tipo = "ok") {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = texto;
  el.className = `mensagem mensagem--visivel${tipo === "erro" ? " mensagem--erro" : ""}`;
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove("mensagem--visivel"), 4000);
}

/* ---------- Tela 1: Home ---------- */
async function renderHome() {
  const [{ atracoes }, { noticias }] = await Promise.all([
    apiGet("/atracoes"),
    apiGet("/noticias?limite=3"),
  ]);

  const destaques = atracoes.slice(0, 3)
    .map(
      (a) => `
      <article class="cartao">
        <img src="assets/img/${a.slug}.svg" alt="Imagem ilustrativa de ${escapeHtml(a.nome)}" onerror="this.style.display='none'"/>
        ${seloCondicao(a.condicao)}
        <h3>${escapeHtml(a.nome)}</h3>
        <p>${escapeHtml(a.descricao)}</p>
        <p><small>${escapeHtml(a.horarios)}</small></p>
        <a class="btn" href="#/atracao/${a.id}">Ver detalhes</a>
      </article>`
    )
    .join("");

  const novidades = noticias.length
    ? noticias.map((n) => `<div class="cartao"><h3>${escapeHtml(n.titulo)}</h3><p>${escapeHtml(n.conteudo)}</p><small>Publicado em ${escapeHtml(n.criado_em)}</small></div>`).join("")
    : `<div class="cartao"><p>Nenhuma novidade publicada ainda.</p></div>`;

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
      <h2>Novidades</h2>
      <div class="grade">${novidades}</div>
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
async function renderAtracoes(filtro = "") {
  const { atracoes } = filtro
    ? await apiGet(`/atracoes?q=${encodeURIComponent(filtro)}`)
    : await apiGet("/atracoes");

  if (atracoes.length === 0) {
    return `
      <section class="secao">
        <h2>Nenhuma atração encontrada</h2>
        <p>Tente buscar por outro termo ou <a href="#/atracoes">ver todas as atrações</a>.</p>
      </section>`;
  }

  const cartoes = atracoes
    .map(
      (a) => `
      <article class="cartao">
        <img src="assets/img/${a.slug}.svg" alt="Imagem ilustrativa de ${escapeHtml(a.nome)}" onerror="this.style.display='none'"/>
        ${seloCondicao(a.condicao)}
        <h3>${escapeHtml(a.nome)}</h3>
        <p><strong>${escapeHtml(a.categoria)}</strong> · ${escapeHtml(a.dificuldade)} · ${escapeHtml(a.duracao)} · ${escapeHtml(a.distancia)}</p>
        <p>${escapeHtml(a.descricao)}</p>
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

async function renderDetalhe(id) {
  const a = await apiGet(`/atracoes/${id}`);

  const eventos = a.eventos.length
    ? `<ul>${a.eventos.map((e) => `<li><strong>${escapeHtml(e.titulo)}</strong> — ${escapeHtml(e.data_hora)}${e.descricao ? ` · ${escapeHtml(e.descricao)}` : ""}</li>`).join("")}</ul>`
    : "<p>Nenhum evento programado no momento. Volte em breve!</p>";

  return `
    <section class="secao detalhe">
      <a href="#/atracoes">← Voltar para atrações</a>
      <br /><br />
      <img src="assets/img/${a.slug}.svg" alt="Imagem ilustrativa de ${escapeHtml(a.nome)}" onerror="this.style.display='none'"/>
      <h2>${escapeHtml(a.nome)}</h2>
      <p>${seloCondicao(a.condicao)} &nbsp; <strong>${escapeHtml(a.categoria)}</strong> · Dificuldade: ${escapeHtml(a.dificuldade)} · Duração: ${escapeHtml(a.duracao)} · Distância: ${escapeHtml(a.distancia)}</p>
      <p>${escapeHtml(a.descricao)}</p>
      <p><strong>Horários:</strong> ${escapeHtml(a.horarios)}</p>

      <h3>Eventos programados</h3>
      ${eventos}

      <h3>Últimos relatos</h3>
      ${a.relatos.length
        ? a.relatos.map((r) => `<div class="comentario"><strong>${escapeHtml(r.nome)}</strong><small>${escapeHtml(r.criado_em)}</small><p>${escapeHtml(r.texto)}</p></div>`).join("")
        : "<p>Seja a primeira pessoa a contar sua experiência!</p>"}
    </section>`;
}

/* ---------- Tela 3: Comunidade ---------- */
async function renderComunidade() {
  const [{ atracoes }, { relatos }] = await Promise.all([
    apiGet("/atracoes"),
    apiGet("/relatos?limite=20"),
  ]);

  const comentarios = relatos.length
    ? relatos.map(
        (c) => `<div class="comentario"><strong>${escapeHtml(c.nome)}</strong><small>${escapeHtml(c.atracao_nome)} · ${escapeHtml(c.criado_em)}</small><p>${escapeHtml(c.texto)}</p></div>`
      ).join("")
    : `<p>Nenhum relato ainda. Publique o primeiro!</p>`;

  return `
    <section class="secao">
      <h2>Comunidade Saquarema Verde</h2>
      <p>Compartilhe sua experiência e fique por dentro da preservação da nossa região.</p>
    </section>

    <section class="secao">
      <div id="msg-sucesso" class="mensagem" role="status"></div>
      <div id="msg-erro" class="mensagem mensagem--erro" role="alert"></div>
      <form class="formulario" id="form-comentario">
        <div>
          <label for="nome">Nome</label>
          <input id="nome" name="nome" type="text" required minlength="2" maxlength="60" placeholder="Seu nome" />
        </div>
        <div>
          <label for="atracao">Atração visitada</label>
          <select id="atracao" name="atracao" required>
            <option value="">Selecione...</option>
            ${atracoes.map((a) => `<option value="${a.id}">${escapeHtml(a.nome)}</option>`).join("")}
          </select>
        </div>
        <div>
          <label for="relato">Relato</label>
          <textarea id="relato" name="relato" rows="4" required minlength="10" maxlength="500" placeholder="Como foi sua visita? (mínimo 10 caracteres)"></textarea>
        </div>
        <button class="btn" type="submit">Publicar relato</button>
      </form>
    </section>

    <section class="secao">
      <h2>Relatos recentes</h2>
      <div id="lista-comentarios">${comentarios}</div>
    </section>`;
}

/* ---------- Tela 4: Administração (login + painel) ---------- */
function renderAdminLogin() {
  return `
    <section class="secao">
      <h2>Área do Administrador</h2>
      <p>Faça login para gerenciar a disponibilidade das trilhas, eventos e novidades.</p>
      <br />
      <div id="msg-erro" class="mensagem mensagem--erro" role="alert"></div>
      <form class="formulario" id="form-login-admin">
        <div>
          <label for="email-admin">E-mail</label>
          <input id="email-admin" type="email" required placeholder="admin@saquaremaverde.local" autocomplete="username" />
        </div>
        <div>
          <label for="senha-admin">Senha</label>
          <input id="senha-admin" type="password" required minlength="6" placeholder="••••••••" autocomplete="current-password" />
        </div>
        <button class="btn" type="submit">Entrar</button>
      </form>
    </section>`;
}

async function renderAdminPainel() {
  const [{ atracoes }, { eventos }, { noticias }] = await Promise.all([
    apiAutenticada("/atracoes"),
    apiAutenticada("/eventos"),
    apiAutenticada("/noticias?limite=3"),
  ]);

  const opcoesCondicao = (atual) =>
    ["Aberta", "Manutenção", "Fechada"]
      .map((c) => `<option value="${c}"${c === atual ? " selected" : ""}>${c}</option>`)
      .join("");

  const linhasAtracoes = atracoes
    .map(
      (a) => `
      <tr data-id="${a.id}">
        <td><strong>${escapeHtml(a.nome)}</strong><br /><small>${escapeHtml(a.categoria)}</small></td>
        <td><select class="adm-condicao" aria-label="Condição de ${escapeHtml(a.nome)}">${opcoesCondicao(a.condicao)}</select></td>
        <td><input class="adm-horarios" type="text" value="${escapeHtml(a.horarios)}" aria-label="Horários de ${escapeHtml(a.nome)}" /></td>
        <td><button class="btn btn--pequeno btn-salvar-disponibilidade" data-id="${a.id}">Salvar</button></td>
      </tr>`
    )
    .join("");

  const linhasEventos = eventos.length
    ? eventos
        .map(
          (e) => `
        <tr data-id="${e.id}">
          <td><strong>${escapeHtml(e.titulo)}</strong><br /><small>${escapeHtml(e.atracao_nome)}</small></td>
          <td>${escapeHtml(e.data_hora)}</td>
          <td class="adm-acoes">
            <button class="btn btn--pequeno btn-editar-evento" data-id="${e.id}"
              data-titulo="${escapeHtml(e.titulo)}" data-data-hora="${escapeHtml(e.data_hora)}"
              data-descricao="${escapeHtml(e.descricao)}" data-atracao="${e.atracao_id}">Editar</button>
            <button class="btn btn--pequeno btn--perigo btn-excluir-evento" data-id="${e.id}">Excluir</button>
          </td>
        </tr>`
        )
        .join("")
    : `<tr><td colspan="3">Nenhum evento futuro cadastrado.</td></tr>`;

  const opcoesAtracao = atracoes
    .map((a) => `<option value="${a.id}">${escapeHtml(a.nome)}</option>`)
    .join("");

  return `
    <section class="secao">
      <div class="adm-cabecalho">
        <h2>Painel do Administrador</h2>
        <button class="btn btn--pequeno btn--perigo" id="btn-sair">Sair</button>
      </div>
      <div id="msg-adm" class="mensagem" role="status"></div>
      <div id="msg-adm-erro" class="mensagem mensagem--erro" role="alert"></div>
    </section>

    <section class="secao detalhe">
      <h3>Disponibilidade das trilhas</h3>
      <div class="tabela-container">
        <table class="tabela">
          <thead>
            <tr><th>Atração</th><th>Condição</th><th>Horários</th><th></th></tr>
          </thead>
          <tbody>${linhasAtracoes}</tbody>
        </table>
      </div>
    </section>

    <section class="secao detalhe">
      <h3 id="titulo-evento-form">Novo evento</h3>
      <form class="formulario" id="form-evento">
        <input type="hidden" id="evento-id" />
        <div>
          <label for="evento-atracao">Atração</label>
          <select id="evento-atracao" required>${opcoesAtracao}</select>
        </div>
        <div>
          <label for="evento-titulo">Título</label>
          <input id="evento-titulo" type="text" required minlength="3" maxlength="120" placeholder="Ex.: Observação de aves" />
        </div>
        <div>
          <label for="evento-data">Data e hora</label>
          <input id="evento-data" type="datetime-local" required />
        </div>
        <div>
          <label for="evento-descricao">Descrição (opcional)</label>
          <textarea id="evento-descricao" rows="2" maxlength="1000" placeholder="Detalhes do evento"></textarea>
        </div>
        <div class="adm-acoes">
          <button class="btn" type="submit">Salvar evento</button>
          <button class="btn btn--pequeno" type="button" id="btn-cancelar-edicao" style="display:none">Cancelar edição</button>
        </div>
      </form>
      <br />
      <div class="tabela-container">
        <table class="tabela">
          <thead>
            <tr><th>Evento</th><th>Data/hora</th><th>Ações</th></tr>
          </thead>
          <tbody>${linhasEventos}</tbody>
        </table>
      </div>
    </section>

    <section class="secao detalhe">
      <h3>Publicar novidade</h3>
      <form class="formulario" id="form-noticia">
        <div>
          <label for="noticia-titulo">Título</label>
          <input id="noticia-titulo" type="text" required minlength="5" maxlength="150" placeholder="Ex.: Temporada de baleias começa" />
        </div>
        <div>
          <label for="noticia-conteudo">Conteúdo</label>
          <textarea id="noticia-conteudo" rows="3" required minlength="10" maxlength="5000" placeholder="Texto da novidade"></textarea>
        </div>
        <button class="btn" type="submit">Publicar</button>
      </form>
      <br />
      <h4>Últimas novidades</h4>
      ${noticias.length
        ? noticias.map((n) => `<div class="comentario"><strong>${escapeHtml(n.titulo)}</strong><small>${escapeHtml(n.criado_em)}</small><p>${escapeHtml(n.conteudo)}</p></div>`).join("")
        : "<p>Nenhuma novidade publicada.</p>"}
    </section>`;
}

async function renderAdmin() {
  if (!tokenAdmin()) return renderAdminLogin();
  return renderAdminPainel();
}

/* ---------- Roteamento ---------- */
async function roteador() {
  const hash = location.hash.replace(/^#\/?/, "");
  const conteudo = document.getElementById("conteudo");
  const [rota, parametro] = hash.split("/");

  conteudo.innerHTML = estadoCarregando();

  try {
    let html = "";
    if (rota === "atracao") html = await renderDetalhe(parametro);
    else if (rota === "atracoes") html = await renderAtracoes();
    else if (rota === "comunidade") html = await renderComunidade();
    else if (rota === "admin") html = await renderAdmin();
    else html = await renderHome();

    conteudo.innerHTML = html;
    configurarEventosDaTela(rota);
  } catch (erro) {
    conteudo.innerHTML = estadoErro(erro.message);
    ligarTentarNovamente();
  }

  conteudo.focus({ preventScroll: true });
  const paginaAtiva = ["atracoes", "comunidade", "admin"].includes(rota) ? rota : "home";
  document.querySelectorAll(".menu a").forEach((link) => {
    if (link.dataset.rota === paginaAtiva) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
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
      apiGet(`/atracoes?q=${encodeURIComponent(termo)}`)
        .then(({ atracoes }) => {
          const conteudo = document.getElementById("conteudo");
          conteudo.innerHTML = atracoes.length
            ? `<section class="secao">
                 <h2>Atrações naturais e culturais de Saquarema</h2>
                 <p>Resultados para: <strong>"${escapeHtml(termo)}"</strong></p>
                 <div class="grade">${atracoes.map((a) => `
                   <article class="cartao">
                     ${seloCondicao(a.condicao)}
                     <h3>${escapeHtml(a.nome)}</h3>
                     <p><strong>${escapeHtml(a.categoria)}</strong> · ${escapeHtml(a.dificuldade)} · ${escapeHtml(a.duracao)}</p>
                     <p>${escapeHtml(a.descricao)}</p>
                     <a class="btn" href="#/atracao/${a.id}">Ver detalhes</a>
                   </article>`).join("")}</div>
               </section>`
            : `<section class="secao"><h2>Nenhuma atração encontrada</h2>
               <p>Tente buscar por outro termo ou <a href="#/atracoes">ver todas as atrações</a>.</p></section>`;
        })
        .catch(() => roteador());
    }
  }

  if (rota === "comunidade") {
    const form = document.getElementById("form-comentario");
    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const botao = form.querySelector("button");
      const dados = {
        nome: document.getElementById("nome").value.trim(),
        atracao_id: Number(document.getElementById("atracao").value),
        texto: document.getElementById("relato").value.trim(),
      };
      botao.disabled = true;
      botao.textContent = "Publicando...";
      try {
        const criado = await apiPost("/relatos", dados);
        const novo = `<div class="comentario"><strong>${escapeHtml(criado.nome)}</strong><small>${escapeHtml(criado.atracao_nome)} · ${escapeHtml(criado.criado_em)}</small><p>${escapeHtml(criado.texto)}</p></div>`;
        document.getElementById("lista-comentarios").insertAdjacentHTML("afterbegin", novo);
        form.reset();
        mostrarMensagem("msg-sucesso", "Obrigado! Seu relato foi publicado.");
      } catch (erro) {
        mostrarMensagem("msg-erro", erro.message, "erro");
      } finally {
        botao.disabled = false;
        botao.textContent = "Publicar relato";
      }
    });
  }

  if (rota === "admin") configurarEventosAdmin();
}

/* ---------- Interações da tela Admin ---------- */
function configurarEventosAdmin() {
  // Login
  const formLogin = document.getElementById("form-login-admin");
  formLogin?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const botao = formLogin.querySelector("button");
    botao.disabled = true;
    try {
      const { token } = await apiPost("/auth/login", {
        email: document.getElementById("email-admin").value.trim(),
        senha: document.getElementById("senha-admin").value,
      });
      salvarToken(token);
      roteador();
    } catch (erro) {
      mostrarMensagem("msg-erro", erro.message, "erro");
    } finally {
      botao.disabled = false;
    }
  });

  if (!tokenAdmin()) return;

  // Logout
  document.getElementById("btn-sair")?.addEventListener("click", () => {
    limparSessao();
    roteador();
  });

  // Salvar disponibilidade por linha
  document.querySelectorAll(".btn-salvar-disponibilidade").forEach((botao) => {
    botao.addEventListener("click", async () => {
      const linha = botao.closest("tr");
      const id = linha.dataset.id;
      botao.disabled = true;
      try {
        await apiAutenticada(`/atracoes/${id}`, {
          method: "PUT",
          body: JSON.stringify({
            condicao: linha.querySelector(".adm-condicao").value,
            horarios: linha.querySelector(".adm-horarios").value.trim(),
          }),
        });
        mostrarMensagem("msg-adm", "Disponibilidade atualizada com sucesso!");
      } catch (erro) {
        mostrarMensagem("msg-adm-erro", erro.message, "erro");
      } finally {
        botao.disabled = false;
      }
    });
  });

  // Criar / editar evento
  const formEvento = document.getElementById("form-evento");
  formEvento?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const idEdicao = document.getElementById("evento-id").value;
    const dataHora = document.getElementById("evento-data").value.replace("T", " ");
    const dados = {
      atracao_id: Number(document.getElementById("evento-atracao").value),
      titulo: document.getElementById("evento-titulo").value.trim(),
      data_hora: dataHora,
      descricao: document.getElementById("evento-descricao").value.trim(),
    };
    const botao = formEvento.querySelector("button[type=submit]");
    botao.disabled = true;
    try {
      if (idEdicao) {
        await apiAutenticada(`/eventos/${idEdicao}`, { method: "PUT", body: JSON.stringify(dados) });
      } else {
        await apiAutenticada("/eventos", { method: "POST", body: JSON.stringify(dados) });
      }
      roteador();
    } catch (erro) {
      mostrarMensagem("msg-adm-erro", erro.message, "erro");
      botao.disabled = false;
    }
  });

  // Preencher formulário para edição
  document.querySelectorAll(".btn-editar-evento").forEach((botao) => {
    botao.addEventListener("click", () => {
      document.getElementById("evento-id").value = botao.dataset.id;
      document.getElementById("evento-atracao").value = botao.dataset.atracao;
      document.getElementById("evento-titulo").value = botao.dataset.titulo;
      document.getElementById("evento-data").value = botao.dataset.dataHora.replace(" ", "T").slice(0, 16);
      document.getElementById("evento-descricao").value = botao.dataset.descricao;
      document.getElementById("titulo-evento-form").textContent = `Editando evento #${botao.dataset.id}`;
      document.getElementById("btn-cancelar-edicao").style.display = "inline-block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  document.getElementById("btn-cancelar-edicao")?.addEventListener("click", () => roteador());

  // Excluir evento
  document.querySelectorAll(".btn-excluir-evento").forEach((botao) => {
    botao.addEventListener("click", async () => {
      if (!confirm("Excluir este evento?")) return;
      try {
        await apiAutenticada(`/eventos/${botao.dataset.id}`, { method: "DELETE" });
        roteador();
      } catch (erro) {
        mostrarMensagem("msg-adm-erro", erro.message, "erro");
      }
    });
  });

  // Publicar novidade
  const formNoticia = document.getElementById("form-noticia");
  formNoticia?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const botao = formNoticia.querySelector("button");
    botao.disabled = true;
    try {
      await apiAutenticada("/noticias", {
        method: "POST",
        body: JSON.stringify({
          titulo: document.getElementById("noticia-titulo").value.trim(),
          conteudo: document.getElementById("noticia-conteudo").value.trim(),
        }),
      });
      roteador();
    } catch (erro) {
      mostrarMensagem("msg-adm-erro", erro.message, "erro");
      botao.disabled = false;
    }
  });
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
