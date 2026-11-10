"use strict";

// Configura o banco em memoria ANTES de importar o app.
process.env.DB_PATH = ":memory:";
process.env.JWT_SECRET = "segredo-de-teste";

const test = require("node:test");
const assert = require("node:assert/strict");

const { executarSeed } = require("../src/database/seed");
const { criarApp } = require("../src/app");

let servidor;
let baseUrl;

test.before(async () => {
  executarSeed();
  const app = criarApp();
  await new Promise((resolve) => {
    servidor = app.listen(0, "127.0.0.1", resolve);
  });
  baseUrl = `http://127.0.0.1:${servidor.address().port}/api`;
});

test.after(() => servidor.close());

async function chamar(metodo, caminho, { corpo, token } = {}) {
  const resposta = await fetch(baseUrl + caminho, {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  const texto = await resposta.text();
  return { status: resposta.status, json: texto ? JSON.parse(texto) : null };
}

async function loginAdmin() {
  const { status, json } = await chamar("POST", "/auth/login", {
    corpo: { email: "admin@saquaremaverde.local", senha: "Admin@123" },
  });
  assert.equal(status, 200);
  return json.token;
}

test("GET /api/saude responde ok", async () => {
  const { status, json } = await chamar("GET", "/saude");
  assert.equal(status, 200);
  assert.equal(json.status, "ok");
});

test("GET /api/atracoes lista atrações do seed", async () => {
  const { status, json } = await chamar("GET", "/atracoes");
  assert.equal(status, 200);
  assert.equal(json.total, 4);
});

test("GET /api/atracoes?q= filtra por termo", async () => {
  const { status, json } = await chamar("GET", "/atracoes?q=jacarepia");
  assert.equal(status, 200);
  assert.equal(json.total, 1);
  assert.match(json.atracoes[0].nome, /Jacarepia/);
});

test("GET /api/atracoes/2 retorna detalhe com eventos e relatos", async () => {
  const { status, json } = await chamar("GET", "/atracoes/2");
  assert.equal(status, 200);
  assert.ok(Array.isArray(json.eventos));
  assert.ok(Array.isArray(json.relatos));
});

test("GET /api/atracoes/999 retorna 404", async () => {
  const { status } = await chamar("GET", "/atracoes/999");
  assert.equal(status, 404);
});

test("POST /api/relatos cria relato e valida campos", async () => {
  const criado = await chamar("POST", "/relatos", {
    corpo: { nome: "Ana P.", atracao_id: 1, texto: "Passeio maravilhoso com a família, trilha bem sinalizada." },
  });
  assert.equal(criado.status, 201);
  assert.equal(criado.json.nome, "Ana P.");

  const invalido = await chamar("POST", "/relatos", {
    corpo: { nome: "A", atracao_id: 1, texto: "curto" },
  });
  assert.equal(invalido.status, 400);
  assert.ok(invalido.json.erros.length >= 2);
});

test("POST /api/auth/login rejeita senha errada", async () => {
  const { status } = await chamar("POST", "/auth/login", {
    corpo: { email: "admin@saquaremaverde.local", senha: "senhaErrada1" },
  });
  assert.equal(status, 401);
});

test("rotas administrativas exigem token", async () => {
  const { status } = await chamar("PUT", "/atracoes/3", { corpo: { condicao: "Aberta" } });
  assert.equal(status, 401);
});

test("admin atualiza condicao da trilha (gestao de disponibilidade)", async () => {
  const token = await loginAdmin();
  const { status, json } = await chamar("PUT", "/atracoes/3", {
    corpo: { condicao: "Aberta", horarios: "07:00 às 16:00" },
    token,
  });
  assert.equal(status, 200);
  assert.equal(json.condicao, "Aberta");
  assert.equal(json.horarios, "07:00 às 16:00");
});

test("admin cria evento e novidade", async () => {
  const token = await loginAdmin();
  const evento = await chamar("POST", "/eventos", {
    corpo: { atracao_id: 1, titulo: "Pôr do sol no mirante", data_hora: "2026-12-20 17:30" },
    token,
  });
  assert.equal(evento.status, 201);
  assert.equal(evento.json.atracao_nome, "Parque Estadual da Costa do Sol");

  const noticia = await chamar("POST", "/noticias", {
    corpo: { titulo: "Temporada de baleias começa", conteudo: "Avistamentos já são registrados na costa de Saquarema." },
    token,
  });
  assert.equal(noticia.status, 201);

  const lista = await chamar("GET", "/noticias");
  assert.equal(lista.json.total, 1);
});

test("condicao invalida retorna 400", async () => {
  const token = await loginAdmin();
  const { status } = await chamar("PUT", "/atracoes/1", {
    corpo: { condicao: "Interditada" },
    token,
  });
  assert.equal(status, 400);
});
