const mongoose = require("mongoose");
const PosicaoAtivo = require("../models/PosicaoAtivo");
const Portfolio = require("../models/Portfolio");

class PosicaoAtivoService {

  async buscarConsolidadoGlobal(usuario) {
    // 1. Extrair os IDs dos portfólios do array de acessos
    // usuario.acessos é o array que vimos na imagem
    if (!usuario.acessos || usuario.acessos.length === 0) {
      return [];
    }

    // Mapeamos para pegar apenas o idPortfolio de cada objeto do array
    const idsPortfolios = usuario.acessos.map((acesso) => acesso.idPortfolio);

    // 2. Agregação direta
    return await PosicaoAtivo.aggregate([
      {
        $match: {
          // Filtra posições que pertençam a QUALQUER um dos IDs no array
          idPortfolio: { $in: idsPortfolios },
          status: "ABERTA",
        },
      },
      {
        $group: {
          _id: "$idAtivo",
          ticker: { $first: "$tickerAtivo" },
          classeAtivo: { $first: "$slugClasseAtivo" },
          quantidadeTotal: { $sum: "$quantidadeTotal" },
          custoTotal: { $sum: "$custoTotal" },
        },
      },
      {
        $addFields: {
          precoMedioPonderado: {
            $cond: {
              if: { $gt: ["$quantidadeTotal", 0] },
              then: { $divide: ["$custoTotal", "$quantidadeTotal"] },
              else: 0,
            },
          },
        },
      },
      { $sort: { ticker: 1 } },
    ]);
  }

  async atualizarPosicao(transacao, ativoRef, session) {
    const {
      idPortfolio,
      portfolioNome,
      idInvestidor,
      idAtivoReferencia,
      operacao,
      quantidade,
      precoUnitario,
      dataTransacao,
    } = transacao;

    // 1. Tenta encontrar o ciclo aberto atual
    let posicao = await PosicaoAtivo.findOne({
      idInvestidor,
      idAtivo: idAtivoReferencia,
      idPortfolio,
      status: "ABERTA",
    }).session(session);

    // 2. Se for uma entrada (Compra/Subscrição/Bonificação)
    if (["COMPRA", "SUBSCRICAO", "BONIFICACAO"].includes(operacao)) {
      if (!posicao) {
        // Abre o ciclo automaticamente se for a primeira compra pós-encerramento ou início de tudo
        posicao = new PosicaoAtivo({
          idPortfolio,
          portfolioNome,
          idInvestidor,
          idAtivo: idAtivoReferencia,
          tickerAtivo: ativoRef.ticker,
          slugClasseAtivo: ativoRef.slugClasseAtivo,
          dataInicio: dataTransacao, // O início do ciclo é a data desta primeira compra
          status: "ABERTA",
          idCriador: transacao.idCriador,
        });
      } else {
        // Caso o portfólio tenha mudado de nome, atualizamos aqui também
        posicao.portfolioNome = portfolioNome;
      }

      // Cálculo de Preço Médio Ponderado
      const custoEntrada = quantidade * precoUnitario;
      posicao.precoMedio =
        (posicao.custoTotal + custoEntrada) /
        (posicao.quantidadeTotal + quantidade);
      posicao.quantidadeTotal += quantidade;
      posicao.custoTotal = posicao.quantidadeTotal * posicao.precoMedio;
    }
    // 3. Se for uma saída (Venda)
    else if (operacao === "VENDA") {
      if (!posicao)
        throw new Error(
          "Venda impossível: não existe uma posição aberta para este ativo.",
        );

      // Validação de saldo: Impede vender mais do que se tem
      if (posicao.quantidadeTotal < quantidade) {
        throw new Error(
          `Venda impossível: A quantidade a vender (${quantidade}) é maior que a posição atual (${posicao.quantidadeTotal}).`,
        );
      }

      posicao.quantidadeTotal -= quantidade;

      // Na venda o Preço Médio não muda, mas o Custo Total (estoque) diminui proporcionalmente
      posicao.custoTotal = posicao.quantidadeTotal * posicao.precoMedio;

      // 4. Lógica de Encerramento Automático
      if (posicao.quantidadeTotal <= 0) {
        posicao.status = "ENCERRADA";
        posicao.dataFim = dataTransacao;
        posicao.quantidadeTotal = 0;
        posicao.custoTotal = 0;
      }
    }

    return await posicao.save({ session });
  }

  async buscarConsolidadoPorPortfolio(idPortfolio, status) {
    return await PosicaoAtivo.aggregate([
      {
        $match: {
          idPortfolio: new mongoose.Types.ObjectId(idPortfolio),
          status,
        },
      },
      {
        $group: {
          _id: "$idAtivo",
          ticker: { $first: "$tickerAtivo" },
          slugClasse: { $first: "$slugClasseAtivo" },
          nomePortfolio: { $first: "$portfolioNome" },
          quantidadeTotal: { $sum: "$quantidadeTotal" },
          custoTotal: { $sum: "$custoTotal" },
          // Preço Médio Ponderado do grupo
          // No PosicaoAtivoService.js - método buscarConsolidadoPorPortfolio
          // Adicione uma proteção para o caso de quantidade ser 0 (venda total)
          precoMedio: {
            $cond: [
              { $eq: ["$quantidadeTotal", 0] },
              0,
              {
                $divide: [
                  { $sum: "$custoTotal" },
                  { $sum: "$quantidadeTotal" },
                ],
              },
            ],
          },
        },
      },
    ]);
  }
}

module.exports = new PosicaoAtivoService();
