const express = require("express");
const router = express.Router();
const posicaoAtivoController = require("../controllers/posicaoAtivoController");
const { autenticar, autorizacaoPortfolio } = require("../middlewares");

// 1. Por Portfolio: GET /api/portfolios/:idPortfolio/posicoes
// router.get(
//   "/",
//   autenticar,
//   autorizacaoPortfolio,
//   posicaoAtivoController.listarPorPortfolio,
// );

// GET /api/posicoes/consolidado
router.get(
  "/",
  autenticar,
  posicaoAtivoController.listarConsolidadoGeral
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