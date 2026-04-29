const { posicaoAtivoService } = require("../services");

class PosicaoAtivoController {
  /**
   * Visão Geral: Lista posições agrupadas por Ativo dentro do Portfólio
   * Útil para o Dashboard principal do Portfólio.
   */
  async listarPorPortfolio(req, res) {
    try {
      const { idPortfolio } = req.params;
      const { status } = req.query; // Ex: ?status=ABERTA ou ?status=ENCERRADA

      // O Service deve retornar a soma de todos os investidores por ativo
      const posicoes = await posicaoAtivoService.buscarConsolidadoPorPortfolio(
        idPortfolio,
        status || "ABERTA",
      );

      return res.json(posicoes);
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
  }

  /**
   * Visão por Investidor: Lista os ativos de um investidor específico
   */
  async listarPorInvestidor(req, res) {
    try {
      const { idInvestidor } = req.params;
      const { status } = req.query;

      const posicoes = await posicaoAtivoService.buscarPorInvestidor(
        idInvestidor,
        status || "ABERTA",
      );

      return res.json(posicoes);
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
  }

  /**
   * Visão por Ativo: Mostra todos os investidores que possuem aquele ativo no portfólio
   * Útil para ver "Quem tem PETR4 neste portfólio?"
   */
  async listarPorAtivo(req, res) {
    try {
      const { idPortfolio, idAtivo } = req.params;

      const detalheAtivo = await posicaoAtivoService.buscarInvestidoresPorAtivo(
        idPortfolio,
        idAtivo,
      );

      return res.json(detalheAtivo);
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
  }
}

module.exports = new PosicaoAtivoController();
