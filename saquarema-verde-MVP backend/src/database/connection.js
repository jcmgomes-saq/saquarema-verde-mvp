"use strict";

const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");

const dbPath = process.env.DB_PATH || path.join(__dirname, "..", "..", "data", "saquarema.db");

if (dbPath !== ":memory:") {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS administradores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  papel TEXT NOT NULL DEFAULT 'admin',
  criado_em TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS atracoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  descricao TEXT NOT NULL,
  dificuldade TEXT NOT NULL,
  duracao TEXT NOT NULL,
  distancia TEXT NOT NULL,
  condicao TEXT NOT NULL CHECK (condicao IN ('Aberta','Manutenção','Fechada')),
  horarios TEXT NOT NULL DEFAULT '08:00 às 17:00',
  atualizado_em TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS eventos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  atracao_id INTEGER NOT NULL REFERENCES atracoes(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  data_hora TEXT NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  criado_em TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS relatos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  atracao_id INTEGER NOT NULL REFERENCES atracoes(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  texto TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS noticias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE INDEX IF NOT EXISTS idx_eventos_atracao ON eventos(atracao_id);
CREATE INDEX IF NOT EXISTS idx_relatos_atracao ON relatos(atracao_id);
CREATE INDEX IF NOT EXISTS idx_relatos_criado ON relatos(criado_em);
`);

module.exports = db;
