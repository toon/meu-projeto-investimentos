const express = require("express");
const router = express.Router();

// Importação das rotas individuais
const autenticacaoRoutes = require("./autenticacaoRoutes");
const portfolioRoutes = require("./portfolioRoutes");
const classeAtivoRoutes = require("./classeAtivoRoutes");
const categoriaAtivoRoutes = require("./categoriaAtivoRoutes");
const corretoraRoutes = require("./corretoraRoutes");


// Definição dos prefixos (Onde a mágica acontece)
router.use("/auth", autenticacaoRoutes);
router.use("/portfolios", portfolioRoutes);
router.use("/classes-ativos", classeAtivoRoutes);
router.use("/corretoras", corretoraRoutes);

// Se ela for "dependente" de portfólio (ex: /portfolios/:id/categorias-ativos),
// o ideal é registrá-la dentro do portfolioRoutes.js ou aqui com o path completo.

module.exports = router;
