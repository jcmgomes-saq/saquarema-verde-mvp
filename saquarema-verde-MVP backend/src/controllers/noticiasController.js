"use strict";

const db = require("../database/connection");
const { exigirCampos, validarTexto } = require("../utils/validacao");

function listar(req, res) {
  const limite = Math.min(Number(req.query.limite) || 10, 50);
  const linhas = db.prepare("SELECT * FROM noticias ORDER BY criado_em DESC LIMIT ?").all(limite);
  return res.json({ total: linhas.length, noticias: linhas });
}

function criar(req, res) {
  exigirCampos(req.body, ["titulo", "conteudo"]);
  const dados = {
    titulo: validarTexto(req.body.titulo, { campo: "titulo", min: 5, max: 150 }),
    conteudo: validarTexto(req.body.conteudo, { campo: "conteudo", min: 10, max: 5000 }),
  };
  const info = db.prepare("INSERT INTO noticias (titulo, conteudo) VALUES (@titulo, @conteudo)").run(dados);
  const criada = db.prepare("SELECT * FROM noticias WHERE id = ?").get(info.lastInsertRowid);
  return res.status(201).json(criada);
}

module.exports = { listar, criar };
