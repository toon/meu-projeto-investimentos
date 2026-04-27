// const Portfolio = require("../models/Portfolio");
// const Usuario = require("../models/Usuario");
// const Transacao = require("../models/Transacao");
const { Portfolio, Usuario, Transacao } = require("../models");

class PortfolioService {
  async calcularPosicao(idPortfolio) {
    const transacoes = await Transacao.find({ idPortfolio }).sort({
      dataTransacao: 1,
    });

    const posicao = {};

    transacoes.forEach((t) => {
      if (!posicao[t.ticker]) {
        posicao[t.ticker] = { quantidade: 0, custoTotal: 0, pm: 0 };
      }

      const ativo = posicao[t.ticker];

      if (t.tipo === "COMPRA") {
        ativo.custoTotal += t.quantidade * t.precoUnitario;
        ativo.quantidade += t.quantidade;
        ativo.pm = ativo.custoTotal / ativo.quantidade;
      } else if (t.tipo === "VENDA") {
        // Na venda, o PM não muda, apenas reduzimos a quantidade proporcionalmente ao custo
        const proporcaoCusto = ativo.pm * t.quantidade;
        ativo.quantidade -= t.quantidade;
        ativo.custoTotal -= proporcaoCusto;
      }
    });

    return posicao;
  }
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
    // 1. Busca todas as transações do portfólio em ordem cronológica
    const transacoes = await Transacao.find({ idPortfolio }).sort({
      dataTransacao: 1,
    });

    const carteira = {};

    transacoes.forEach((t) => {
      if (!carteira[t.ticker]) {
        carteira[t.ticker] = {
          ticker: t.ticker,
          quantidade: 0,
          custoTotal: 0,
          pm: 0,
        };
      }

      const ativo = carteira[t.ticker];

      // No seu PortfolioService.js, dentro do loop forEach:

      if (t.tipo === 'COMPRA') {
          // Se a posição estava zerada, o custo total anterior é ignorado
          if (ativo.quantidade === 0) {
              ativo.custoTotal = 0;
          }
          
          ativo.quantidade += t.quantidade;
          ativo.custoTotal += (t.quantidade * t.precoUnitario);
          ativo.pm = ativo.custoTotal / ativo.quantidade;
      } 
      else if (t.tipo === 'VENDA') {
          if (ativo.quantidade > 0) {
              const valorBaixadoPeloPM = ativo.pm * t.quantidade;
              ativo.quantidade -= t.quantidade;
              ativo.custoTotal -= valorBaixadoPeloPM;
          }

          // REGRA DE OURO: Se zerou a mão, limpa tudo para a próxima compra vir limpa
          if (ativo.quantidade <= 0) {
              ativo.quantidade = 0;
              ativo.custoTotal = 0;
              ativo.pm = 0;
          }
      }

    });

    // Retorna apenas os ativos que você ainda possui em carteira
    return Object.values(carteira).filter((a) => a.quantidade > 0);
  }
}

module.exports = new PortfolioService();
