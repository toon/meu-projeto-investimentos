const { Portfolio, Usuario } = require("../models");

class PortfolioService {
  async criar(idUsuario, dados) {
    // 1. Cria o Portfólio (Nome e Descrição)
    const novoPortfolio = await Portfolio.create(dados);

    // 2. Registra o vínculo no modelo de Usuário
    // Adicionamos esse novo portfólio ao array de acessos do usuário logado
    await Usuario.findByIdAndUpdate(idUsuario, {
      $push: { acessos: { idPortfolio: novoPortfolio._id, papel: "dono" } },
    });

    return novoPortfolio;
  }

  async listarPorUsuario(idUsuario) {
    const usuario = await Usuario.findById(idUsuario).populate(
      "acessos.idPortfolio",
    );
    // Retorna apenas a lista de portfólios vinculados
    return usuario.acessos.map((a) => a.idPortfolio);
  }
}

module.exports = new PortfolioService();
