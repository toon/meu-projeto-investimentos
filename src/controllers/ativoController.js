const { ativoService } = require("../services");
const { ativoSchema } = require("../validators");

class AtivoController {
  async criar(req, res) {
    try {
      const dadosValidados = ativoSchema.parse(req.body);
      const ativo = await ativoService.criar(dadosValidados);
      return res.status(201).json(ativo);
    } catch (erro) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async listar(req, res) {
    try {
      const { q } = req.query; // Para busca: /api/ativos?q=PETR
      const ativos = await ativoService.listar(q);
      return res.json(ativos);
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
  }
}

module.exports = new AtivoController();