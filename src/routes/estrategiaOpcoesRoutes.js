const express = require("express");
const router = express.Router();
const estrategiaOpcoesController = require("../controllers/estrategiaOpcoesController");
const { autenticar, escopoPortfolios } = require("../middlewares");

/**
 * @route POST /api/estrategias-opcoes
 * @desc  Cria uma nova estratégia de opções (agrupador)
 */
router.post(
  "/",
  autenticar,
  escopoPortfolios, // Injeta req.escopoPortfolios para a checagem de segurança no Controller
  estrategiaOpcoesController.criar
);

/**
 * @route GET /api/estrategias-opcoes
 * @desc  Lista as estratégias e o resumo financeiro com suas respectivas pernas
 */
router.get("/", autenticar, escopoPortfolios, estrategiaOpcoesController.listarConsolidado);

/**
 * @route PATCH /api/estrategias-opcoes/:id/encerrar
 * @desc  Encerra uma estratégia manualmente
 */
router.patch("/:id/encerrar", autenticar, escopoPortfolios, estrategiaOpcoesController.encerrar);

module.exports = router;