const { transacaoService } = require("../services");
const { transacaoSchema } = require("../validators");

class TransacaoController {
  
  async registrar(req, res, next) {
    try {
      // 1. Validação Zod
      const dadosValidados = transacaoSchema.parse(req.body);

      // 2. Preparação
      const novaTransacao = await transacaoService.registrar(
        dadosValidados,
        req.usuario._id, // ID do Gestor logado
      );

      return res.status(201).json(novaTransacao);
      
    } catch (erro) {
      next(erro);
    }
  }

  async listarExtrato(req, res, next) {
    try {
      const { idPortfolio, idInvestidor, tickerOperado } = req.query;

      const extrato = await transacaoService.listarExtrato({
        idsPortfolios: idPortfolio ? [idPortfolio] : req.escopoPortfolios,
        idInvestidor,
        tickerOperado,
      });

      return res.json(extrato);
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = new TransacaoController();
