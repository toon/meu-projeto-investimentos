const express = require("express");
const router = express.Router({ mergeParams: true });
const { categoriaAtivoController } = require("../controllers");
const { autenticar, autorizacaoPortfolio } = require("../middlewares");

// Rota: /api/portfolios/:idPortfolio/categorias
// GET: Lista as categorias do portfólio
router.get(
  "/",
  autenticar,
  autorizacaoPortfolio,
  categoriaAtivoController.listar,
);

// POST: Cria uma nova categoria no portfólio
router.post(
  "/",
  autenticar,
  autorizacaoPortfolio,
  categoriaAtivoController.criar,
);

module.exports = router;
