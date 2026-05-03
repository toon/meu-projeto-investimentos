const mongoose = require("mongoose");
const PosicaoAtivo = require("../models/PosicaoAtivo");
const Portfolio = require("../models/Portfolio");

class PosicaoAtivoService {
  
  async atualizarPosicao(transacao, ativoRef, session) {
    const {
      idPortfolio,
      portfolioNome,
      idInvestidor,
      idAtivoReferencia,
      tickerOperado,
      operacao,
      quantidade,
      precoUnitario,
      dataTransacao,
      nomeCategoriaAtivo,
    } = transacao;

    // 1. Encontrar a Posição Base (Depende da Operação)
    let posicao;

    if (["DIVIDENDO", "JCP", "RENDIMENTO", "AMORTIZACAO"].includes(operacao)) {
      // Para proventos, a posição certa é a que estava ativa na Data Com (Data Base).
      // Se não houver dataCom, usamos a dataTransacao como fallback.
      const dataReferenciaBruta = new Date(transacao.dataCom || dataTransacao);

      // Normaliza para o final do dia (23:59:59.999) para evitar problemas com milissegundos
      const finalDoDiaReferencia = new Date(dataReferenciaBruta);
      finalDoDiaReferencia.setUTCHours(23, 59, 59, 999);

      posicao = await PosicaoAtivo.findOne({
        idInvestidor,
        idAtivo: idAtivoReferencia,
        tickerOperado,
        idPortfolio,
        dataInicio: { $lte: finalDoDiaReferencia },
        // A posição estava ABERTA na época, OU foi encerrada DEPOIS da Data Com
        $or: [{ status: "ABERTA" }, { dataFim: { $gte: finalDoDiaReferencia } }],
      }).session(session);

      if (!posicao) {
        throw new Error(
          `Não foi encontrada uma posição válida para este ativo compatível com a Data Com informada (${finalDoDiaReferencia.toISOString()}).`,
        );
      }
    } else {
      // Para Compras e Vendas, buscamos a posição atualmente ABERTA
      posicao = await PosicaoAtivo.findOne({
        idInvestidor,
        idAtivo: idAtivoReferencia,
        tickerOperado,
        idPortfolio,
        status: "ABERTA",
      }).session(session);
    }

    // 2. Criação automática da Posição (se não existir) para operações de Abertura
    if (!posicao && ["COMPRA", "SUBSCRICAO", "BONIFICACAO", "LANCAMENTO"].includes(operacao)) {
      const posicaoAnterior = await PosicaoAtivo.findOne({
        idInvestidor,
        idAtivo: idAtivoReferencia,
        tickerOperado,
        idPortfolio,
        status: "ENCERRADA",
      })
        .sort({ dataFim: -1 })
        .session(session);

      const aporteHerdado = posicaoAnterior ? posicaoAnterior.aporteEfetivo : 0;
      const proventosHerdados = posicaoAnterior ? posicaoAnterior.totalProventos : 0;

      posicao = new PosicaoAtivo({
        idPortfolio,
        portfolioNome,
        idInvestidor,
        idAtivo: idAtivoReferencia,
        tickerAtivo: ativoRef.ticker,
        tickerOperado,
        slugClasseAtivo: ativoRef.slugClasseAtivo,
        nomeCategoriaAtivo: nomeCategoriaAtivo || "Geral",
        dataInicio: dataTransacao,
        status: "ABERTA",
        idCriador: transacao.idCriador,
        aporteEfetivo: aporteHerdado, // O valor da operação será somado/subtraído abaixo
        totalProventos: proventosHerdados,
        quantidadeTotal: 0,
        custoTotal: 0,
        precoMedio: 0,
      });
    }

    // Atualiza metadados do Portfólio caso tenham mudado
    if (posicao && !posicao.isNew) {
      posicao.portfolioNome = portfolioNome;
      if (nomeCategoriaAtivo) posicao.nomeCategoriaAtivo = nomeCategoriaAtivo;
    }

    const valorOperacao = quantidade * precoUnitario;

    // 3. Processamento Matemático por Tipo de Operação
    if (["COMPRA", "SUBSCRICAO", "BONIFICACAO"].includes(operacao)) {
      if (posicao.quantidadeTotal >= 0) {
        // Aumento de Posição Comprada (Long)
        posicao.aporteEfetivo += valorOperacao;
        const novoCustoTotal = posicao.custoTotal + valorOperacao;
        const novaQuantidade = posicao.quantidadeTotal + quantidade;
        posicao.precoMedio = novoCustoTotal / novaQuantidade;
        posicao.quantidadeTotal = novaQuantidade;
        posicao.custoTotal = novoCustoTotal;
      } else {
        // Fechamento de Posição Vendida (Short - Recompra)
        if (Math.abs(posicao.quantidadeTotal) < quantidade) {
          throw new Error(`Recompra impossível: A quantidade (${quantidade}) excede a posição vendida atual (${Math.abs(posicao.quantidadeTotal)}).`);
        }
        posicao.aporteEfetivo += valorOperacao;
        posicao.quantidadeTotal += quantidade; // Quantidade negativa caminha para zero
        posicao.custoTotal = posicao.quantidadeTotal * posicao.precoMedio;
      }
    }
    else if (operacao === "LANCAMENTO") {
      if (posicao.quantidadeTotal > 0) {
        throw new Error("Lançamento impossível: Você possui uma posição comprada em aberto. Venda-a primeiro.");
      }
      // Abertura/Aumento de Posição Vendida (Short)
      posicao.aporteEfetivo -= valorOperacao; // Prêmio recebido entra no caixa
      const novoCustoTotal = posicao.custoTotal - valorOperacao;
      const novaQuantidade = posicao.quantidadeTotal - quantidade;
      posicao.precoMedio = novoCustoTotal / novaQuantidade; // Divisão de negativos gera PM positivo!
      posicao.quantidadeTotal = novaQuantidade;
      posicao.custoTotal = novoCustoTotal;
    }
    else if (operacao === "VENDA") {
      if (!posicao || posicao.quantidadeTotal <= 0) {
        throw new Error("Venda impossível: Não existe uma posição comprada em aberto para este ativo.");
      }
      if (posicao.quantidadeTotal < quantidade) {
        throw new Error(`Venda impossível: A quantidade a vender (${quantidade}) é maior que a posição atual (${posicao.quantidadeTotal}).`);
      }
      // Fechamento de Posição Comprada
      posicao.aporteEfetivo -= valorOperacao;
      posicao.quantidadeTotal -= quantidade;
      posicao.custoTotal = posicao.quantidadeTotal * posicao.precoMedio;
    }
    else if (operacao === "EXPIRACAO") {
      if (!posicao) throw new Error("Expiração impossível: Posição não encontrada.");
      // Opção vira pó: zera a quantidade e o custo contábil
      posicao.quantidadeTotal = 0;
      posicao.custoTotal = 0;
      posicao.precoMedio = 0;
    }
    else if (["DIVIDENDO", "JCP", "RENDIMENTO"].includes(operacao)) {
      // Para proventos, a 'quantidade' é a base de ações e 'precoUnitario' é o valor pago por ação.
      posicao.aporteEfetivo -= valorOperacao;
      posicao.totalProventos += valorOperacao;
    }
    else if (operacao === "AMORTIZACAO") {
      posicao.aporteEfetivo -= valorOperacao;
      posicao.totalProventos += valorOperacao;
      posicao.custoTotal -= valorOperacao;
      if (posicao.quantidadeTotal > 0) {
        posicao.precoMedio = posicao.custoTotal / posicao.quantidadeTotal;
      }
    }

    // 4. Lógica de Encerramento Automático
    if (posicao.quantidadeTotal === 0 && ["COMPRA", "VENDA", "EXPIRACAO", "AMORTIZACAO"].includes(operacao)) {
      posicao.status = "ENCERRADA";
      posicao.dataFim = dataTransacao;
    }

    return await posicao.save({ session });
  }

  /**
   * Função unificada e dinâmica para buscar posições financeiras.
   * @param {Object} filtros - { idsPortfolios, idPortfolio, idInvestidor, idAtivo, status }
   * @param {String} agruparPor - "ativo" ou "investidor"
   */
  async buscarPosicoesConsolidadas(filtros, agruparPor = "ativo") {
    const matchStage = {};

    // 1. Constrói a query (Match) de forma dinâmica
    if (filtros.idsPortfolios && filtros.idsPortfolios.length > 0) {
      matchStage.idPortfolio = { $in: filtros.idsPortfolios.map((id) => new mongoose.Types.ObjectId(id)) };
    }
    if (filtros.idPortfolio) {
      matchStage.idPortfolio = new mongoose.Types.ObjectId(filtros.idPortfolio);
    }
    if (filtros.idInvestidor) {
      matchStage.idInvestidor = new mongoose.Types.ObjectId(filtros.idInvestidor);
    }
    if (filtros.idAtivo) {
      matchStage.idAtivo = new mongoose.Types.ObjectId(filtros.idAtivo);
    }
    if (filtros.status) {
      matchStage.status = filtros.status;
    }

    // 2. Constrói os campos padrão do Group
    const groupStage = {
      quantidadeTotal: { $sum: "$quantidadeTotal" },
      custoTotal: { $sum: "$custoTotal" },
      aporteEfetivo: { $sum: "$aporteEfetivo" },
      totalProventos: { $sum: "$totalProventos" },
      // Movemos todos os metadados para fora do IF. 
      // Assim, a API retorna um objeto padronizado em todas as requisições.
      ticker: { $first: "$tickerAtivo" },
      slugClasse: { $first: "$slugClasseAtivo" },
      categoria: { $first: "$nomeCategoriaAtivo" },
      nomePortfolio: { $first: "$portfolioNome" },
      idAtivo: { $first: "$idAtivo" },
      idInvestidor: { $first: "$idInvestidor" },
      idPortfolio: { $first: "$idPortfolio" },
    };

    // 3. Define a chave primária de agrupamento e ordenação
    let sortStage = {};
    if (agruparPor === "ativo") {
      groupStage._id = "$idAtivo";
      sortStage = { ticker: 1 };
    } else if (agruparPor === "investidor") {
      groupStage._id = "$idInvestidor";
      sortStage = { quantidadeTotal: -1 };
    }

    return await PosicaoAtivo.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      {
        $addFields: {
          precoMedio: {
            $cond: [
              { $eq: ["$quantidadeTotal", 0] },
              0,
              { $divide: ["$custoTotal", "$quantidadeTotal"] },
            ],
          },
          yieldOnCost: {
            $cond: [
              { $eq: ["$custoTotal", 0] },
              0, // Evita divisão por zero se a posição estiver encerrada
              {
                $multiply: [
                  { $divide: ["$totalProventos", "$custoTotal"] },
                  100,
                ],
              },
            ],
          },
        },
      },
      { $sort: sortStage },
    ]);
  }
}

module.exports = new PosicaoAtivoService();
