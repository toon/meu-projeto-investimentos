const express = require("express");
const router = express.Router({ mergeParams: true });
const { posicaoAtivoController } = require("../controllers");
const { autenticar, autorizacaoPortfolio } = require("../middlewares");

// 1. Por Portfolio: GET /api/portfolios/:idPortfolio/posicoes
router.get(
  "/",
  autenticar,
  autorizacaoPortfolio,
  posicaoAtivoController.listarPorPortfolio,
);

// 2. Por Investidor: GET /api/portfolios/:idPortfolio/posicoes/investidor/:idInvestidor
router.get(
  "/investidor/:idInvestidor",
  autenticar,
  autorizacaoPortfolio,
  posicaoAtivoController.listarPorInvestidor,
);

// 3. Por Ativo: GET /api/portfolios/:idPortfolio/posicoes/ativo/:idAtivo
router.get(
  "/ativo/:idAtivo",
  autenticar,
  autorizacaoPortfolio,
  posicaoAtivoController.listarPorAtivo,
);

module.exports = router;
