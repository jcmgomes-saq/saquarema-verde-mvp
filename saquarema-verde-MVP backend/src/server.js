"use strict";

const { executarSeed } = require("./database/seed");
const { criarApp } = require("./app");
const config = require("./config");

executarSeed();

if (config.usaSecretPadrao) {
  console.warn("[aviso] JWT_SECRET nao definido. Defina a variavel de ambiente em producao.");
}

const app = criarApp();
const servidor = app.listen(config.porta, () => {
  console.log(`Saquarema Verde Online API em http://localhost:${config.porta}/api`);
});

module.exports = servidor;
