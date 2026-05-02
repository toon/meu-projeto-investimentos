const express = require("express");
const router = express.Router();
const { transacaoController } = require("../controllers");
const { autenticar } = require("../middlewares");
// Se você criou um middleware para validar acesso aos IDs do body, importe-o aqui
// const { autorizacaoGeral } = require("../middlewares/autorizacao");

/**
 * @route POST /api/transacoes
 * @desc  Registra uma nova transação (Compra, Venda, Bonificação, Subscrição)
 * @access Private (Gestor)
 */
router.post("/", autenticar, transacaoController.registrar);

// /**
//  * @route GET /api/transacoes
//  * @desc  Lista transações com filtros opcionais (idPortfolio, idInvestidor, ticker)
//  * @access Private (Gestor)
//  */
// router.get("/", autenticar, transacaoController.listar);

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
