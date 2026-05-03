const { portfolioService } = require("../services");
const { portfolioSchema } = require("../validators");

class PortfolioController {

  async definirPortfolioPadrao(req, res, next) {
    try {
      const { portfolioId } = req.params;
      const userId = req.user.id;

      // 1. Remove o padrão de todos os outros portfólios do utilizador
      await Portfolio.updateMany(
        { owner: userId, _id: { $ne: portfolioId } },
        { $set: { isDefault: false } }
      );

      // 2. Define o novo portfólio selecionado como padrão
      const portfolio = await Portfolio.findOneAndUpdate(
        { _id: portfolioId, owner: userId },
        { $set: { isDefault: true } },
        { new: true }
      );

      return res.json(portfolio);
    } catch (erro) {
      next(erro);
    }
  }

  async criarPortfolio(req, res, next) {
    try {
      // 1. Valida apenas Nome e Descrição
      const dadosValidados = portfolioSchema.parse(req.body);

      // 2. Chama o service enviando o ID do usuário logado para criar o vínculo
      const novoPortfolio = await portfolioService.criar(
        req.usuario._id,
        dadosValidados,
      );

      return res.status(201).json(novoPortfolio);
    } catch (erro) {
      next(erro);
    }
  }

  async listarMeusPortfolios(req, res, next) {
    try {
      // O usuário só vê os portfólios onde ele está no array de 'acessos'
      const portfolios = await portfolioService.listarPorUsuario(
        req.usuario._id,
      );
      return res.json(portfolios);
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = new PortfolioController();
