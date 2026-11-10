"use strict";

// Centraliza as configuracoes lidas de variaveis de ambiente.
module.exports = {
  porta: Number(process.env.PORTA) || 3000,
  jwtSecret: process.env.JWT_SECRET || "dev-apenas-altere-em-producao",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  adminSenhaPadrao: process.env.ADMIN_SENHA || "Admin@123",
  usaSecretPadrao: !process.env.JWT_SECRET,
};
