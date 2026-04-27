const { portfolioService } = require("../services");
const { portfolioSchema } = require("../validators");

class PortfolioController {

  async definirPortfolioPadrao(req, res) {
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
  }

  async criarPortfolio(req, res) {
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
      if (erro.issues || erro.errors) {
        return res.status(400).json({
          erro: "Dados do portfólio inválidos",
          detalhes: (erro.issues || erro.errors).map((e) => ({
            campo: e.path[0],
            mensagem: e.message,
          })),
        });
      }
      return res.status(400).json({ erro: erro.message });
    }
  }

  async listarMeusPortfolios(req, res) {
    try {
      // O usuário só vê os portfólios onde ele está no array de 'acessos'
      const portfolios = await portfolioService.listarPorUsuario(
        req.usuario._id,
      );
      return res.json(portfolios);
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
  }
  // Dentro da classe PortfolioController no arquivo src/controllers/portfolioController.js

  async obterPosicaoAtual(req, res) {
    try {
      const { idPortfolio } = req.params;

      // 1. Chamamos o service (que fará o cálculo do PM e saldos)
      const posicao = await portfolioService.calcularPosicao(idPortfolio);

      return res.json(posicao);
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
  }
}

module.exports = new PortfolioController();
