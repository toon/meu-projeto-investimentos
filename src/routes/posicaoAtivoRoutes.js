const express = require("express");
const router = express.Router();
const posicaoAtivoController = require("../controllers/posicaoAtivoController");
const { autenticar, escopoPortfolios } = require("../middlewares");

// 1. Por Portfolio: GET /api/portfolios/:idPortfolio/posicoes
// router.get(
//   "/",
//   autenticar,
//   autorizacaoPortfolio,
//   posicaoAtivoController.listarPorPortfolio,
// );

// 1. Consolidado Geral: GET /api/posicoes/
router.get(
  "/",
  autenticar,
  escopoPortfolios,
  posicaoAtivoController.listarConsolidadoGeral
);

// 2. Por Investidor (Global): GET /api/posicoes/investidor/:idInvestidor
router.get(
  "/investidor/:idInvestidor",
  autenticar,
  escopoPortfolios,
  posicaoAtivoController.listarPorInvestidor,
);

// 3. Por Ativo (Global): GET /api/posicoes/ativo/:idAtivo
router.get(
  "/ativo/:idAtivo",
  autenticar,
  escopoPortfolios,
  posicaoAtivoController.listarPorAtivo,
);

// 4. Por portfolio (Global): GET /api/posicoes/portfolio/:idPortfolio
router.get(
  "/portfolio/:idPortfolio",
  autenticar,
  escopoPortfolios,
  posicaoAtivoController.listarPorPortfolio,
);

module.exports = router;