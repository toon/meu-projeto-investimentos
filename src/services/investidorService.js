const { Investidor } = require("../models");

class InvestidorService {
  async criar(dados) {
    return await Investidor.create(dados);
  }

  async listarPorPortfolio(idPortfolio) {
    return await Investidor.find({ idPortfolio }).sort({ apelido: 1 });
  }
}

module.exports = new InvestidorService();
