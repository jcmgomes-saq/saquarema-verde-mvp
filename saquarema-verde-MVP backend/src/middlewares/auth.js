"use strict";

const jwt = require("jsonwebtoken");
const config = require("../config");

function autenticarAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");
  if (!token) {
    return res.status(401).json({ erro: "Token de autenticação não fornecido." });
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    if (payload.papel !== "admin") {
      return res.status(403).json({ erro: "Acesso restrito a administradores." });
    }
    req.usuario = payload;
    return next();
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}

module.exports = { autenticarAdmin };
