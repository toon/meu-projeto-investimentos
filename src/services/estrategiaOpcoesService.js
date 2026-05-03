const { EstrategiaOpcoes, Transacao } = require("../models");

class EstrategiaOpcoesService {
  async criar(dados) {
    return await EstrategiaOpcoes.create(dados);
  }

  /**
   * Busca as estratégias e calcula o resultado financeiro consolidado de suas "pernas" (Transações).
   * @param {Object} filtros - { idsPortfolios, status }
   */
  async listarResumoEstrategias(filtros) {
    const matchStage = {};

    if (filtros.idsPortfolios && filtros.idsPortfolios.length > 0) {
      matchStage.idPortfolio = { $in: filtros.idsPortfolios };
    }
    if (filtros.status) {
      matchStage.status = filtros.status;
    }

    // 1. Busca as Estratégias de Opções
    const estrategiasOpcoes = await EstrategiaOpcoes.find(matchStage).sort({ createdAt: -1 }).lean();
    if (estrategiasOpcoes.length === 0) return [];

    const idsEstrategiasOpcoes = estrategiasOpcoes.map((e) => e._id);

    // 2. Busca todas as Transações (Pernas) vinculadas a essas estratégias
    const transacoes = await Transacao.find({
      idEstrategiaOpcoes: { $in: idsEstrategiasOpcoes },
    }).sort({ dataTransacao: 1 }).lean();

    // 3. Consolida e calcula o resultado de cada Estratégia
    const resultado = estrategiasOpcoes.map((estrategiaOpcao) => {
      // Filtra as transações que pertencem a esta estratégia
      const pernas = transacoes.filter(
        (t) => t.idEstrategiaOpcoes.toString() === estrategiaOpcao._id.toString()
      );

      let custoMontagem = 0;

      // Matemática do Custo da Estrutura
      pernas.forEach((t) => {
        const valorOperacao = t.quantidade * t.precoUnitario;

        if (["COMPRA", "SUBSCRICAO", "BONIFICACAO"].includes(t.operacao)) {
          custoMontagem += valorOperacao; // Saiu dinheiro do bolso (Débito)
        } else if (["VENDA", "LANCAMENTO"].includes(t.operacao)) {
          custoMontagem -= valorOperacao; // Entrou dinheiro no bolso (Crédito)
        }
      });

      return {
        ...estrategiaOpcao,
        resultadoFinanceiro: { custoMontagem }, // Se negativo = Recebeu para montar a operação
        pernas, // Envia a lista das transações (histórico) junto
      };
    });

    return resultado;
  }
}

module.exports = new EstrategiaOpcoesService();