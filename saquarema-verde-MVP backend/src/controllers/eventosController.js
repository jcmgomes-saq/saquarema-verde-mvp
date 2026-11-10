"use strict";

const db = require("../database/connection");
const { exigirCampos, validarTexto, validarDataHora } = require("../utils/validacao");

class ErroNaoEncontrado extends Error {
  constructor(msg) { super(msg); this.status = 404; }
}

function buscarPorId(id) {
  const evento = db.prepare(`
    SELECT e.*, a.nome AS atracao_nome FROM eventos e
    JOIN atracoes a ON a.id = e.atracao_id WHERE e.id = ?
  `).get(id);
  if (!evento) throw new ErroNaoEncontrado("Evento não encontrado.");
  return evento;
}

function listar(req, res) {
  const atracaoId = req.query.atracao_id ? Number(req.query.atracao_id) : null;
  let linhas;
  if (atracaoId) {
    linhas = db.prepare(`
      SELECT e.*, a.nome AS atracao_nome FROM eventos e
      JOIN atracoes a ON a.id = e.atracao_id
      WHERE e.atracao_id = ? ORDER BY e.data_hora
    `).all(atracaoId);
  } else {
    linhas = db.prepare(`
      SELECT e.*, a.nome AS atracao_nome FROM eventos e
      JOIN atracoes a ON a.id = e.atracao_id
      WHERE e.data_hora >= datetime('now','localtime') ORDER BY e.data_hora LIMIT 50
    `).all();
  }
  return res.json({ total: linhas.length, eventos: linhas });
}

function criar(req, res) {
  exigirCampos(req.body, ["atracao_id", "titulo", "data_hora"]);
  const atracaoId = Number(req.body.atracao_id);
  const atracao = db.prepare("SELECT id FROM atracoes WHERE id = ?").get(atracaoId);
  if (!atracao) return res.status(400).json({ erros: ["atracao_id não corresponde a uma atração existente."] });
  const dados = {
    atracao_id: atracaoId,
    titulo: validarTexto(req.body.titulo, { campo: "titulo", min: 3, max: 120 }),
    data_hora: validarDataHora(req.body.data_hora),
    descricao: validarTexto(req.body.descricao || "", { campo: "descricao", min: 0, max: 1000 }),
  };
  const info = db.prepare(
    "INSERT INTO eventos (atracao_id, titulo, data_hora, descricao) VALUES (@atracao_id, @titulo, @data_hora, @descricao)"
  ).run(dados);
  return res.status(201).json(buscarPorId(info.lastInsertRowid));
}

function atualizar(req, res) {
  buscarPorId(req.params.id);
  const atualizacoes = {};
  if (req.body.titulo !== undefined) atualizacoes.titulo = validarTexto(req.body.titulo, { campo: "titulo", min: 3, max: 120 });
  if (req.body.data_hora !== undefined) atualizacoes.data_hora = validarDataHora(req.body.data_hora);
  if (req.body.descricao !== undefined) atualizacoes.descricao = validarTexto(req.body.descricao, { campo: "descricao", min: 0, max: 1000 });
  if (Object.keys(atualizacoes).length === 0) {
    return res.status(400).json({ erros: ["Nada para atualizar. Envie titulo, data_hora e/ou descricao."] });
  }
  const campos = Object.keys(atualizacoes).map((c) => `${c} = @${c}`).join(", ");
  db.prepare(`UPDATE eventos SET ${campos} WHERE id = @id`).run({ ...atualizacoes, id: req.params.id });
  return res.json(buscarPorId(req.params.id));
}

function remover(req, res) {
  buscarPorId(req.params.id);
  db.prepare("DELETE FROM eventos WHERE id = ?").run(req.params.id);
  return res.status(204).send();
}

module.exports = { listar, criar, atualizar, remover };
