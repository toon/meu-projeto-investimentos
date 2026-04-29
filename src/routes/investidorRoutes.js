const express = require("express");
const router = express.Router({ mergeParams: true });
const { investidorController } = require("../controllers");
const { autorizacaoPortfolio } = require("../middlewares");

// Rotas: /api/portfolios/:idPortfolio/investidores
router.post("/", autorizacaoPortfolio, investidorController.criar);
router.get("/", autorizacaoPortfolio, investidorController.listar);

module.exports = router;
