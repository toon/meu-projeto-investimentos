const { investidorService } = require("../services");
const { investidorSchema } = require("../validators");

class InvestidorController {
  async criar(req, res, next) {
    try {
      const dadosValidados = investidorSchema.parse(req.body);

      // Injetamos o idPortfolio que já foi validado pelo seu middleware de autorização
      const investidor = await investidorService.criar({
        ...dadosValidados,
        idPortfolio: req.params.idPortfolio,
      });

      return res.status(201).json(investidor);
    } catch (erro) {
      next(erro);
    }
  }

  async listar(req, res, next) {
    try {
      const { idPortfolio } = req.params;
      const investidores =
        await investidorService.listarPorPortfolio(idPortfolio);
      return res.json(investidores);
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = new InvestidorController();
