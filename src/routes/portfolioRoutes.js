const express = require("express");
const router = express.Router({ mergeParams: true });
const portfolioController = require("../controllers/portfolioController");
// const transacaoController = require('../controllers/transacaoController'); // Novo Controller
const { autenticar, autorizacaoPortfolio } = require("../middlewares");

const categoriaAtivoRoutes = require("./categoriaAtivoRoutes");
const investidorRoutes = require("./investidorRoutes");

// Criar um novo portfólio (POST /api/portfolios)
router.post("/", autenticar, portfolioController.criarPortfolio);

// Listar os portfólios que eu tenho acesso (GET /api/portfolios)
router.get(
  "/",
  autenticar,
  portfolioController.listarMeusPortfolios,
);

// --- Gestão de Transações (O "Filme") ---
// // POST /api/portfolios/:idPortfolio/transacoes
// router.post(
//   "/:idPortfolio/transacoes",
//   autenticar,
//   autorizacaoPortfolio,
//   transacaoController.registrar,
// );

// --- Visão Consolidada (A "Foto" / Saldo / PM) ---
// GET /api/portfolios/:idPortfolio/posicao
router.get(
  "/:idPortfolio/posicao",
  autenticar,
  autorizacaoPortfolio,
  portfolioController.obterPosicaoAtual,
);

router.use(
  "/:idPortfolio/categorias-ativos",
  autenticar,
  autorizacaoPortfolio,
  categoriaAtivoRoutes,
);

router.use(
  "/:idPortfolio/investidores",
  autenticar,
  autorizacaoPortfolio,
  investidorRoutes,
);

// Ver detalhes de um portfólio específico (GET /api/portfolios/:idPortfolio)
// router.get("/:idPortfolio", autorizacaoPortfolio, portfolioController.obterPorId);

module.exports = router;
