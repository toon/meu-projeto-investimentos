const { investidorService } = require("../services");
const { investidorSchema } = require("../validators");

class InvestidorController {
  async criar(req, res) {
    try {
      const dadosValidados = investidorSchema.parse(req.body);

      // Injetamos o idPortfolio que já foi validado pelo seu middleware de autorização
      const investidor = await investidorService.criar({
        ...dadosValidados,
        idPortfolio: req.params.idPortfolio,
      });

      return res.status(201).json(investidor);
    } catch (erro) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async listar(req, res) {
    try {
      const { idPortfolio } = req.params;
      const investidores =
        await investidorService.listarPorPortfolio(idPortfolio);
      return res.json(investidores);
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
  }
}

module.exports = new InvestidorController();
