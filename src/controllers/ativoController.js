const { ativoService } = require("../services");
const { ativoSchema } = require("../validators");

class AtivoController {
  async criar(req, res, next) {
    try {
      const dadosValidados = ativoSchema.parse(req.body);
      const ativo = await ativoService.criar(dadosValidados);
      return res.status(201).json(ativo);
    } catch (erro) {
      next(erro);
    }
  }

  async listar(req, res, next) {
    try {
      const { q } = req.query; // Para busca: /api/ativos?q=PETR
      const ativos = await ativoService.listar(q);
      return res.json(ativos);
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = new AtivoController();