// const Portfolio = require("../models/Portfolio");
// const Usuario = require("../models/Usuario");
// const Transacao = require("../models/Transacao");
const { Portfolio, Usuario, Transacao } = require("../models");

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

  async calcularPosicao(idPortfolio) {
    // 1. Busca cronológica - IMPORTANTE: Use dataTransacao
    const transacoes = await Transacao.find({ idPortfolio }).sort({
      dataTransacao: 1,
    });

    const carteira = {};

    transacoes.forEach((t) => {
      // Ajuste aqui o campo conforme seu Model (ticker ou tickerOperado)
      const ticker = t.tickerOperado || t.ticker;

      if (!carteira[ticker]) {
        carteira[ticker] = {
          ticker: ticker,
          quantidade: 0,
          custoTotal: 0,
          pm: 0,
        };
      }

      const ativo = carteira[ticker];

      // Ajuste aqui: t.operacao (conforme definimos no validator/model)
      if (["COMPRA", "SUBSCRICAO", "BONIFICACAO"].includes(t.operacao)) {
        if (ativo.quantidade === 0) ativo.custoTotal = 0;

        ativo.quantidade += t.quantidade;
        // Adicionamos taxas ao custo total se você as tiver no model
        const custoTransacao = t.quantidade * t.precoUnitario + (t.taxas || 0);
        ativo.custoTotal += custoTransacao;
        ativo.pm = ativo.custoTotal / ativo.quantidade;
      } else if (t.operacao === "VENDA") {
        if (ativo.quantidade > 0) {
          // A venda baixa o custo proporcionalmente ao PM atual
          const valorBaixadoPeloPM = ativo.pm * t.quantidade;
          ativo.quantidade -= t.quantidade;
          ativo.custoTotal -= valorBaixadoPeloPM;
        }

        // Reset para evitar dízimas periódicas negativas (ex: 0.000000001)
        if (ativo.quantidade <= 0) {
          ativo.quantidade = 0;
          ativo.custoTotal = 0;
          ativo.pm = 0;
        }
      }
    });

    // Retorna apenas ativos com saldo
    return Object.values(carteira).filter((a) => a.quantidade > 0);
  }
  
}

module.exports = new PortfolioService();
