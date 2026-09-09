const express = require("express");
const router = express.Router();
const { transacaoController } = require("../controllers");
const { autenticar, escopoPortfolios, autorizacaoPortfolio } = require("../middlewares");
// Se você criou um middleware para validar acesso aos IDs do body, importe-o aqui
// const { autorizacaoGeral } = require("../middlewares/autorizacao");

/**
 * @route POST /api/transacoes
 * @desc  Registra uma nova transação (Compra, Venda, Bonificação, Subscrição) protegida pelo CASL
 * @access Private (Gestor)
 */
router.post(
    "/", 
    autenticar, 
    autorizacaoPortfolio("gerir", "Transacao"), 
    transacaoController.registrar
);

/**
 * @route GET /api/transacoes
 * @desc  Lista o extrato (linha do tempo) de transações com filtros dinâmicos
 * @access Private (Gestor)
 */
router.get("/", autenticar, escopoPortfolios, transacaoController.listarExtrato);

// /**
//  * @route GET /api/transacoes/:id
//  * @desc  Obter detalhes de uma transação específica
//  */
// router.get("/:id", autenticar, transacaoController.obterPorId);

// /**
//  * @route DELETE /api/transacoes/:id
//  * @desc  Remove uma transação e estorna o efeito na PosiçãoAtiva
//  */
// router.delete("/:id", autenticar, transacaoController.remover);

module.exports = router;
