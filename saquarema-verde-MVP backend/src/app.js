"use strict";

const express = require("express");
const helmet = require("helmet");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

function criarApp() {
  const app = express();

  app.use(helmet());
  app.use(express.json({ limit: "100kb" }));

  // CORS simples para integracao com o front-end local
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    return next();
  });

  app.use("/api", routes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { criarApp };
