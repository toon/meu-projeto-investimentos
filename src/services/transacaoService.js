const { Transacao } = require("../models");

class TransacaoService {
  async criar(dados, idUsuario) {
    // Mapeamos corretoraId para o nome do campo no Model
    const novaTransacao = await Transacao.create({
      ...dados,
      usuario: idUsuario,
      portfolio: dados.portfolioId,
      ativo: dados.ativoId,
      corretora: dados.corretoraId, // Vinculando a corretora global
    });

    return novaTransacao;
  }

  // Ao listar transações, podemos usar o .populate() para trazer os dados da corretora
  async listarPorPortfolio(idPortfolio) {
    return await Transacao.find({ portfolio: idPortfolio })
      .populate("ativo", "ticker nome")
      .populate("corretora", "nome nomeCurto logoUrl") // Traz o nomeCurto para o relatório
      .sort({ data: -1 });
  }
}

module.exports = new TransacaoService();
