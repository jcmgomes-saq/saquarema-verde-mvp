"use strict";

const db = require("../database/connection");
const { exigirCampos, validarTexto } = require("../utils/validacao");

function listar(req, res) {
  const limite = Math.min(Number(req.query.limite) || 20, 100);
  const linhas = db.prepare(`
    SELECT r.id, r.nome, r.texto, r.criado_em, a.nome AS atracao_nome
    FROM relatos r JOIN atracoes a ON a.id = r.atracao_id
    ORDER BY r.criado_em DESC LIMIT ?
  `).all(limite);
  return res.json({ total: linhas.length, relatos: linhas });
}

function criar(req, res) {
  exigirCampos(req.body, ["nome", "atracao_id", "texto"]);
  const atracaoId = Number(req.body.atracao_id);
  const atracao = db.prepare("SELECT id FROM atracoes WHERE id = ?").get(atracaoId);
  if (!atracao) return res.status(400).json({ erros: ["atracao_id não corresponde a uma atração existente."] });
  const dados = {
    atracao_id: atracaoId,
    nome: validarTexto(req.body.nome, { campo: "nome", min: 2, max: 60 }),
    texto: validarTexto(req.body.texto, { campo: "texto", min: 10, max: 500 }),
  };
  const info = db.prepare(
    "INSERT INTO relatos (atracao_id, nome, texto) VALUES (@atracao_id, @nome, @texto)"
  ).run(dados);
  const criado = db.prepare(`
    SELECT r.id, r.nome, r.texto, r.criado_em, a.nome AS atracao_nome
    FROM relatos r JOIN atracoes a ON a.id = r.atracao_id WHERE r.id = ?
  `).get(info.lastInsertRowid);
  return res.status(201).json(criado);
}

module.exports = { listar, criar };
