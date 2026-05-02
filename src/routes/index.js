const express = require("express");
const router = express.Router();

// Importação das rotas individuais
const autenticacaoRoutes = require("./autenticacaoRoutes");
const portfolioRoutes = require("./portfolioRoutes");
const classeAtivoRoutes = require("./classeAtivoRoutes");
const categoriaAtivoRoutes = require("./categoriaAtivoRoutes");
const corretoraRoutes = require("./corretoraRoutes");
const investidorRoutes = require("./investidorRoutes");
const ativoRoutes = require("./ativoRoutes");
const transacaoRoutes = require("./transacaoRoutes");
const posicaoAtivoRoutes = require("./posicaoAtivoRoutes");


// Definição dos prefixos (Onde a mágica acontece)
router.use("/auth", autenticacaoRoutes);
router.use("/portfolios", portfolioRoutes);
router.use("/classes-ativos", classeAtivoRoutes);
router.use("/corretoras", corretoraRoutes);
router.use("/investidores", investidorRoutes);
router.use("/ativos", ativoRoutes);
router.use("/transacoes", transacaoRoutes);
router.use("/posicoes", posicaoAtivoRoutes);

// Se ela for "dependente" de portfólio (ex: /portfolios/:id/categorias-ativos),
// o ideal é registrá-la dentro do portfolioRoutes.js ou aqui com o path completo.

module.exports = router;
