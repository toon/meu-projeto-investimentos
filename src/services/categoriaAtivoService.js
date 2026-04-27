const { CategoriaAtivo } = require("../models");

class CategoriaAtivoService {
  /**
   * Cria uma categoria recebendo o objeto completo (incluindo idPortfolio)
   */
  async criar(dados) {
    // Segue a mesma lógica do TransacaoService:
    // recebe o objeto 'dados' que já deve conter o idPortfolio
    return await CategoriaAtivo.create(dados);
  }

  /**
   * Lista as categorias filtrando pelo ID do portfólio
   */
  async listarPorPortfolio(idPortfolio) {
    return await CategoriaAtivo.find({ idPortfolio }).sort({ nome: 1 });
  }
}

module.exports = new CategoriaAtivoService();
