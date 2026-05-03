const { posicaoAtivoService } = require("../services");

class PosicaoAtivoController {
  
  async listarConsolidadoGeral(req, res, next) {
    try {
      const posicoes = await posicaoAtivoService.buscarPosicoesConsolidadas({
        idsPortfolios: req.escopoPortfolios,
        status: "ABERTA",
      });

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
      const { status } = req.query;

      // Segurança: Verifica se o portfólio da URL pertence aos acessos do usuário
      if (!req.escopoPortfolios.some((id) => id.toString() === idPortfolio.toString())) {
        return res.status(403).json({ erro: "Acesso negado a este portfólio." });
      }

      const posicoes = await posicaoAtivoService.buscarPosicoesConsolidadas({
        idPortfolio,
        status: status || "ABERTA",
      });

      return res.status(200).json(posicoes);
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

      const posicoes = await posicaoAtivoService.buscarPosicoesConsolidadas({
        idsPortfolios: req.escopoPortfolios,
        idInvestidor,
        status: status || "ABERTA",
      });

      return res.status(200).json(posicoes);
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
      const { idAtivo } = req.params;

      // O segundo parâmetro "investidor" instrui o serviço a agrupar por pessoa
      const detalheAtivo = await posicaoAtivoService.buscarPosicoesConsolidadas({
        idsPortfolios: req.escopoPortfolios,
        idAtivo,
        status: "ABERTA",
      }, "investidor");

      return res.json(detalheAtivo);
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = new PosicaoAtivoController();
