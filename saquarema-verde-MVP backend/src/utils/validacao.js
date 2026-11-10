"use strict";

// Validacoes simples e reutilizaveis. Lanca erro com status para o tratador central.

class ErroValidacao extends Error {
  constructor(mensagens) {
    super("Dados inválidos.");
    this.status = 400;
    this.mensagens = mensagens;
  }
}

const CONDICOES = ["Aberta", "Manutenção", "Fechada"];

function exigirCampos(corpo, campos) {
  const faltantes = campos.filter((c) => corpo[c] === undefined || corpo[c] === null || String(corpo[c]).trim() === "");
  if (faltantes.length > 0) {
    throw new ErroValidacao(faltantes.map((c) => `Campo obrigatório ausente: ${c}.`));
  }
}

function validarTexto(valor, { campo, min = 1, max = 255 }) {
  const v = String(valor ?? "").trim();
  if (v.length < min) throw new ErroValidacao([`${campo} deve ter no mínimo ${min} caracteres.`]);
  if (v.length > max) throw new ErroValidacao([`${campo} deve ter no máximo ${max} caracteres.`]);
  return v;
}

function validarEmail(email) {
  const v = String(email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) throw new ErroValidacao(["E-mail inválido."]);
  return v;
}

function validarCondicao(condicao) {
  if (!CONDICOES.includes(condicao)) {
    throw new ErroValidacao([`Condição deve ser uma de: ${CONDICOES.join(", ")}.`]);
  }
  return condicao;
}

function validarDataHora(valor, campo = "data_hora") {
  const v = String(valor ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}( \d{2}:\d{2})?$/.test(v)) {
    throw new ErroValidacao([`${campo} deve estar no formato AAAA-MM-DD ou AAAA-MM-DD HH:MM.`]);
  }
  return v;
}

module.exports = { ErroValidacao, exigirCampos, validarTexto, validarEmail, validarCondicao, validarDataHora };
