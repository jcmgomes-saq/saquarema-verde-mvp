"use strict";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/connection");
const config = require("../config");
const { exigirCampos, validarEmail, validarTexto } = require("../utils/validacao");
const { registrarFalhaLogin, limparTentativas } = require("../middlewares/rateLimiter");

function login(req, res) {
  exigirCampos(req.body, ["email", "senha"]);
  const email = validarEmail(req.body.email);
  const senha = validarTexto(req.body.senha, { campo: "senha", min: 6, max: 100 });

  const usuario = db.prepare("SELECT * FROM administradores WHERE email = ?").get(email);
  if (!usuario || !bcrypt.compareSync(senha, usuario.senha_hash)) {
    registrarFalhaLogin(req.registroLogin.chave);
    return res.status(401).json({ erro: "E-mail ou senha incorretos." });
  }

  limparTentativas(req.registroLogin.chave);
  const token = jwt.sign(
    { sub: usuario.id, nome: usuario.nome, papel: usuario.papel },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
  return res.json({
    token,
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel },
  });
}

module.exports = { login };
