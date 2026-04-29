const express = require("express");
const router = express.Router();
const portfolioController = require("../controllers/portfolioController");
const transacaoController = require('../controllers/transacaoController'); // Novo Controller
// const autenticar = require("../middlewares/autenticar");
// const autorizar = require("../middlewares/autorizacaoPortfolio");
const { autenticar, autorizacaoPortfolio: autorizar } = require("../middlewares");

const categoriaAtivoRoutes = require("./categoriaAtivoRoutes");
const investidorRoutes = require("./investidorRoutes");

router.use(autenticar);

// Criar um novo portfólio (POST /api/portfolios)
router.post("/", portfolioController.criarPortfolio);

// Listar os portfólios que eu tenho acesso (GET /api/portfolios)
router.get("/", autorizar, portfolioController.listarMeusPortfolios);

// --- Gestão de Transações (O "Filme") ---
// POST /api/portfolios/:idPortfolio/transacoes
router.post('/:idPortfolio/transacoes', autorizar, transacaoController.registrar);

// --- Visão Consolidada (A "Foto" / Saldo / PM) ---
// GET /api/portfolios/:idPortfolio/posicao
router.get('/:idPortfolio/posicao', autorizar, portfolioController.obterPosicaoAtual);

router.use("/:idPortfolio/categorias-ativos", autorizar, categoriaAtivoRoutes);

router.use("/:idPortfolio/investidores", autorizar, investidorRoutes);

// Ver detalhes de um portfólio específico (GET /api/portfolios/:idPortfolio)
// router.get("/:idPortfolio", autorizar, portfolioController.obterPorId);

module.exports = router;
