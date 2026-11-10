"use strict";

const db = require("../database/connection");
const { exigirCampos, validarTexto, validarCondicao } = require("../utils/validacao");

class ErroNaoEncontrado extends Error {
  constructor(msg) { super(msg); this.status = 404; }
}

function listar(req, res) {
  const termo = String(req.query.q ?? "").trim();
  let linhas;
  if (termo) {
    const like = `%${termo}%`;
    linhas = db.prepare(`
      SELECT * FROM atracoes
      WHERE nome LIKE ? OR categoria LIKE ? OR descricao LIKE ?
      ORDER BY nome
    `).all(like, like, like);
  } else {
    linhas = db.prepare("SELECT * FROM atracoes ORDER BY nome").all();
  }
  return res.json({ total: linhas.length, atracoes: linhas });
}

function detalhar(req, res) {
  const atracao = buscarPorId(req.params.id);
  const eventos = db.prepare(
    "SELECT id, titulo, data_hora, descricao FROM eventos WHERE atracao_id = ? ORDER BY data_hora"
  ).all(atracao.id);
  const relatos = db.prepare(
    "SELECT id, nome, texto, criado_em FROM relatos WHERE atracao_id = ? ORDER BY criado_em DESC LIMIT 10"
  ).all(atracao.id);
  return res.json({ ...atracao, eventos, relatos });
}

function buscarPorId(id) {
  const atracao = db.prepare("SELECT * FROM atracoes WHERE id = ?").get(id);
  if (!atracao) throw new ErroNaoEncontrado("Atração não encontrada.");
  return atracao;
}

function criar(req, res) {
  exigirCampos(req.body, ["slug", "nome", "categoria", "descricao", "dificuldade", "duracao", "distancia"]);
  const dados = {
    slug: validarTexto(req.body.slug, { campo: "slug", min: 2, max: 80 }),
    nome: validarTexto(req.body.nome, { campo: "nome", min: 3, max: 120 }),
    categoria: validarTexto(req.body.categoria, { campo: "categoria", min: 2, max: 40 }),
    descricao: validarTexto(req.body.descricao, { campo: "descricao", min: 10, max: 1000 }),
    dificuldade: validarTexto(req.body.dificuldade, { campo: "dificuldade", min: 2, max: 30 }),
    duracao: validarTexto(req.body.duracao, { campo: "duracao", min: 1, max: 20 }),
    distancia: validarTexto(req.body.distancia, { campo: "distancia", min: 1, max: 20 }),
    condicao: validarCondicao(req.body.condicao || "Aberta"),
    horarios: validarTexto(req.body.horarios || "08:00 às 17:00", { campo: "horarios", min: 3, max: 120 }),
  };
  try {
    const info = db.prepare(`
      INSERT INTO atracoes (slug, nome, categoria, descricao, dificuldade, duracao, distancia, condicao, horarios)
      VALUES (@slug, @nome, @categoria, @descricao, @dificuldade, @duracao, @distancia, @condicao, @horarios)
    `).run(dados);
    return res.status(201).json(buscarPorId(info.lastInsertRowid));
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      return res.status(409).json({ erro: "Já existe atração com esse slug." });
    }
    throw err;
  }
}

// Gestao de disponibilidade: administradores atualizam condicao, horarios e descricao.
function atualizar(req, res) {
  buscarPorId(req.params.id);
  const atualizacoes = {};
  if (req.body.condicao !== undefined) atualizacoes.condicao = validarCondicao(req.body.condicao);
  if (req.body.horarios !== undefined) atualizacoes.horarios = validarTexto(req.body.horarios, { campo: "horarios", min: 3, max: 120 });
  if (req.body.descricao !== undefined) atualizacoes.descricao = validarTexto(req.body.descricao, { campo: "descricao", min: 10, max: 1000 });
  if (Object.keys(atualizacoes).length === 0) {
    return res.status(400).json({ erros: ["Nada para atualizar. Envie condicao, horarios e/ou descricao."] });
  }
  const campos = Object.keys(atualizacoes).map((c) => `${c} = @${c}`).join(", ");
  db.prepare(`UPDATE atracoes SET ${campos}, atualizado_em = datetime('now','localtime') WHERE id = @id`)
    .run({ ...atualizacoes, id: req.params.id });
  return res.json(buscarPorId(req.params.id));
}

module.exports = { listar, detalhar, criar, atualizar };
