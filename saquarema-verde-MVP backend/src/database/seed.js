"use strict";

const bcrypt = require("bcryptjs");
const db = require("./connection");
const config = require("../config");

function executarSeed() {
  const adminExiste = db.prepare("SELECT COUNT(*) AS total FROM administradores").get().total > 0;
  if (!adminExiste) {
    const hash = bcrypt.hashSync(config.adminSenhaPadrao, 10);
    db.prepare(
      "INSERT INTO administradores (nome, email, senha_hash, papel) VALUES (?, ?, ?, 'admin')"
    ).run("Administrador Saquarema Verde", "admin@saquaremaverde.local", hash);
    console.log("[seed] Administrador criado (email: admin@saquaremaverde.local).");
  }

  const atracaoExiste = db.prepare("SELECT COUNT(*) AS total FROM atracoes").get().total > 0;
  if (!atracaoExiste) {
    const inserir = db.prepare(`
      INSERT INTO atracoes (slug, nome, categoria, descricao, dificuldade, duracao, distancia, condicao, horarios)
      VALUES (@slug, @nome, @categoria, @descricao, @dificuldade, @duracao, @distancia, @condicao, @horarios)
    `);
    const atracoes = [
      { slug: "costa-do-sol", nome: "Parque Estadual da Costa do Sol", categoria: "Trilha",
        descricao: "Trilhas costeiras com mirantes, praias desertas e observação de aves.",
        dificuldade: "Moderada", duracao: "2h30", distancia: "4,5 km", condicao: "Aberta", horarios: "08:00 às 17:00" },
      { slug: "jacarepia", nome: "Reserva Ecológica Estadual de Jacarepia", categoria: "Reserva",
        descricao: "Área de preservação com vegetação de restinga, lagoas e fauna silvestre.",
        dificuldade: "Fácil", duracao: "1h30", distancia: "2,8 km", condicao: "Aberta", horarios: "09:00 às 15:00 (somente com guia)" },
      { slug: "pedra-do-padrao", nome: "Pedra do Padrão", categoria: "Mirante",
        descricao: "Mirante com vista panorâmica de Saquarema e do litoral fluminense.",
        dificuldade: "Difícil", duracao: "3h", distancia: "5,2 km", condicao: "Manutenção", horarios: "Indisponível" },
      { slug: "centro-historico", nome: "Centro Histórico e Igreja de Sant'Ana", categoria: "Cultural",
        descricao: "Centro histórico, arquitetura colonial e vista clássica sobre a Lagoa de Saquarema.",
        dificuldade: "Fácil", duracao: "1h", distancia: "1,5 km", condicao: "Aberta", horarios: "Livre" },
    ];
    for (const a of atracoes) inserir.run(a);
    console.log(`[seed] ${atracoes.length} atrações inseridas.`);
  }

  const eventoExiste = db.prepare("SELECT COUNT(*) AS total FROM eventos").get().total > 0;
  if (!eventoExiste) {
    const inserir = db.prepare(
      "INSERT INTO eventos (atracao_id, titulo, data_hora, descricao) VALUES (?, ?, ?, ?)"
    );
    inserir.run(1, "Observação de aves", "2026-11-14 07:00", "Passeio guiado com binóculos fornecidos.");
    inserir.run(1, "Limpeza de praia", "2026-11-02 08:00", "Mutirão mensal com a comunidade local.");
    inserir.run(2, "Trilha interpretativa com guia", "2026-11-12 09:00", "Conheça a restinga e a fauna da reserva.");
    console.log("[seed] Eventos inseridos.");
  }

  const relatoExiste = db.prepare("SELECT COUNT(*) AS total FROM relatos").get().total > 0;
  if (!relatoExiste) {
    const inserir = db.prepare(
      "INSERT INTO relatos (atracao_id, nome, texto) VALUES (?, ?, ?)"
    );
    inserir.run(1, "Mariana L.", "Trilha da Costa do Sol incrível! O mirante no final vale cada passo.");
    inserir.run(2, "Rafael T.", "A reserva de Jacarepia é um tesouro. O guia explicou muito sobre a restinga.");
    console.log("[seed] Relatos inseridos.");
  }
}

module.exports = { executarSeed };

if (require.main === module) {
  executarSeed();
  console.log("[seed] Concluído.");
}
