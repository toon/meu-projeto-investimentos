const { estrategiaOpcoesService } = require("../services");
const { estrategiaOpcoesSchema } = require("../validators/estrategiaOpcoesValidator");

class EstrategiaOpcoesController {
  async criar(req, res, next) {
    try {
      const dadosValidados = estrategiaOpcoesSchema.parse(req.body);

      // Segurança: Verifica se o portfólio fornecido no body pertence aos acessos do usuário
      const idsPermitidos = req.escopoPortfolios || [];
      if (!idsPermitidos.some((id) => id.toString() === dadosValidados.idPortfolio)) {
        return res.status(403).json({ erro: "Acesso negado a este portfólio." });
      }

      const novaEstrategia = await estrategiaOpcoesService.criar(dadosValidados);

      return res.status(201).json(novaEstrategia);
    } catch (erro) {
      next(erro);
    }
  }

  async listarConsolidado(req, res, next) {
    try {
      const { status } = req.query;

      const estrategias = await estrategiaOpcoesService.listarResumoEstrategias({
        idsPortfolios: req.escopoPortfolios,
        status: status || "ABERTA",
      });

      return res.status(200).json(estrategias);
    } catch (erro) {
      next(erro);
    }
  }

  async encerrar(req, res, next) {
    try {
      const { id } = req.params;

      // 1. Busca a estratégia para verificar a qual portfólio ela pertence
      const estrategia = await estrategiaOpcoesService.obterPorId(id);
      if (!estrategia) {
        return res.status(404).json({ erro: "Estratégia não encontrada." });
      }

      // 2. Segurança: Verifica se o portfólio da estratégia está nos acessos do usuário
      if (!req.escopoPortfolios.some((pId) => pId.toString() === estrategia.idPortfolio.toString())) {
        return res.status(403).json({ erro: "Acesso negado a esta estratégia." });
      }

      // 3. Efetua o encerramento
      const estrategiaEncerrada = await estrategiaOpcoesService.encerrar(id);
      return res.json(estrategiaEncerrada);
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = new EstrategiaOpcoesController();