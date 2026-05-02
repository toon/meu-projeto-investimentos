const { posicaoAtivoService } = require("../services");

class PosicaoAtivoController {
  
  async listarConsolidadoGeral(req, res, next) {
    try {
      // Passamos o objeto usuario completo que o seu middleware de autenticação já carregou
      const posicoes = await posicaoAtivoService.buscarConsolidadoGlobal(
        req.usuario,
      );

      return res.status(200).json(posicoes);
    } catch (erro) {
      next(erro);
    }
  }

  /**
   * Visão Geral: Lista posições agrupadas por Ativo dentro do Portfólio
   * Útil para o Dashboard principal do Portfólio.
   */
  async listarPorPortfolio(req, res, next) {
    try {
      const { idPortfolio } = req.params;
      const { status } = req.query; // Ex: ?status=ABERTA ou ?status=ENCERRADA

      console.log(idPortfolio);

      // O Service deve retornar a soma de todos os investidores por ativo
      const posicoes = await posicaoAtivoService.buscarConsolidadoPorPortfolio(
        idPortfolio || null,
        status || "ABERTA",
      );

      return res.json(posicoes);
    } catch (erro) {
      next(erro);
    }
  }

  /**
   * Visão por Investidor: Lista os ativos de um investidor específico
   */
  async listarPorInvestidor(req, res, next) {
    try {
      const { idInvestidor } = req.params;
      const { status } = req.query;

      const posicoes = await posicaoAtivoService.buscarPorInvestidor(
        idInvestidor,
        status || "ABERTA",
      );

      return res.json(posicoes);
    } catch (erro) {
      next(erro);
    }
  }

  /**
   * Visão por Ativo: Mostra todos os investidores que possuem aquele ativo no portfólio
   * Útil para ver "Quem tem PETR4 neste portfólio?"
   */
  async listarPorAtivo(req, res, next) {
    try {
      const { idPortfolio, idAtivo } = req.params;

      const detalheAtivo = await posicaoAtivoService.buscarInvestidoresPorAtivo(
        idPortfolio,
        idAtivo,
      );

      return res.json(detalheAtivo);
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = new PosicaoAtivoController();
