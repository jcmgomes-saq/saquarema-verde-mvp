"use strict";

const express = require("express");
const auth = require("../controllers/authController");
const atracoes = require("../controllers/atracoesController");
const eventos = require("../controllers/eventosController");
const relatos = require("../controllers/relatosController");
const noticias = require("../controllers/noticiasController");
const { autenticarAdmin } = require("../middlewares/auth");
const { limitarTentativasLogin } = require("../middlewares/rateLimiter");

const router = express.Router();

router.get("/saude", (req, res) => res.json({ status: "ok" }));

// Autenticacao
router.post("/auth/login", limitarTentativasLogin, auth.login);

// Atracoes (leitura publica / escrita restrita)
router.get("/atracoes", atracoes.listar);
router.get("/atracoes/:id", atracoes.detalhar);
router.post("/atracoes", autenticarAdmin, atracoes.criar);
router.put("/atracoes/:id", autenticarAdmin, atracoes.atualizar);

// Eventos (leitura publica / escrita restrita)
router.get("/eventos", eventos.listar);
router.post("/eventos", autenticarAdmin, eventos.criar);
router.put("/eventos/:id", autenticarAdmin, eventos.atualizar);
router.delete("/eventos/:id", autenticarAdmin, eventos.remover);

// Relatos (publicos)
router.get("/relatos", relatos.listar);
router.post("/relatos", relatos.criar);

// Novidades (leitura publica / escrita restrita)
router.get("/noticias", noticias.listar);
router.post("/noticias", autenticarAdmin, noticias.criar);

module.exports = router;
