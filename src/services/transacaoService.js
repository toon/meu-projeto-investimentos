const mongoose = require("mongoose");
const {
  Transacao,
  Ativo,
  Corretora,
  Investidor,
  ClasseAtivo,
  CategoriaAtivo,
  Portfolio,
  EstrategiaOpcoes,
} = require("../models");
const posicaoAtivoService = require("./posicaoAtivoService");

class TransacaoService {
  async registrar(dados, idCriador) {
    // Início da sessão para garantir que se a posição falhar, a transação não seja salva
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Buscamos todas as referências em paralelo (usando a session)
      // const [ativoRef, corretora, investidor, classe, categoria] =
      //   await Promise.all([
      //     Ativo.findById(dados.idAtivoReferencia)
      //       .select("ticker slugClasseAtivo")
      //       .session(session),
      //     Corretora.findById(dados.idCorretora)
      //       .select("nomeCurto")
      //       .session(session),
      //     Investidor.findById(dados.idInvestidor)
      //       .select("apelido")
      //       .session(session),
      //     ClasseAtivo.findById(dados.idClasseAtivo)
      //       .select("nome")
      //       .session(session),
      //     dados.idCategoriaAtivo
      //       ? CategoriaAtivo.findById(dados.idCategoriaAtivo)
      //           .select("nome")
      //           .session(session)
      //       : null,
      //   ]);
      // Substitua o Promise.all por buscas simples para teste:
      const ativoRef = await Ativo.findById(dados.idAtivoReferencia)
        .select("ticker slugClasseAtivo idClasseAtivo")
        .session(session);
      const corretora = await Corretora.findById(dados.idCorretora)
        .select("nomeCurto")
        .session(session);
      const investidor = await Investidor.findById(dados.idInvestidor)
        .select("apelido")
        .session(session);

      // A Mágica da Herança: Se não enviou a classe, pega a classe do ativo de referência
      const idClasseDefinitiva = dados.idClasseAtivo || ativoRef?.idClasseAtivo;

      const classe = idClasseDefinitiva
        ? await ClasseAtivo.findById(idClasseDefinitiva).select("nome").session(session)
        : null;
      const categoria = dados.idCategoriaAtivo
        ? await CategoriaAtivo.findById(dados.idCategoriaAtivo)
            .select("nome")
            .session(session)
        : null;
      const portfolio = await Portfolio.findById(dados.idPortfolio).session(
        session,
      );

      if (!portfolio) throw new Error("Portfólio não encontrado");
      if (!ativoRef) throw new Error("Ativo de referência não encontrado.");

      // --- Lógica de Criação Automática de Estratégia de Opções (Caminho 3) ---
      let estrategiaId = dados.idEstrategiaOpcoes;
      let estrategiaNome = null;

      if (dados.tipoOpcao && !estrategiaId) {
        // Se é uma opção e não enviou estratégia, criamos uma automaticamente!
        const novaEstrategia = new EstrategiaOpcoes({
          idPortfolio: dados.idPortfolio,
          idInvestidor: dados.idInvestidor,
          nome: `Operação Direcional ${(dados.tickerOperado || ativoRef.ticker).toUpperCase()}`,
          tipo: "PERSONALIZADA",
          status: "ABERTA",
        });
        await novaEstrategia.save({ session });
        estrategiaId = novaEstrategia._id;
        estrategiaNome = novaEstrategia.nome;
      } else if (estrategiaId) {
        // Se enviou o ID, buscamos o nome para salvar na Transação
        const est = await EstrategiaOpcoes.findById(estrategiaId).select("nome").session(session);
        if (est) estrategiaNome = est.nome;
      }

      // 2. Montamos o objeto com a lógica de campos híbridos
      const dadosCompletos = {
        ...dados,
        idCriador,
        idClasseAtivo: idClasseDefinitiva,
        tickerOperado: (dados.tickerOperado || ativoRef?.ticker).toUpperCase(),
        ativoReferencia: ativoRef?.ticker || "N/A",
        nomeCurtoCorretora: corretora?.nomeCurto || "N/A",
        apelidoInvestidor: investidor?.apelido || "N/A",
        nomeClasseAtivo: classe?.nome || "N/A",
        nomeCategoriaAtivo: categoria?.nome || "Geral",
        idEstrategiaOpcoes: estrategiaId,
        nomeEstrategiaOpcoes: estrategiaNome || undefined,
      };

      // 3. Criamos a transação dentro da sessão
      const novaTransacao = new Transacao(dadosCompletos);
      await novaTransacao.save({ session });

      const dadosParaPosicao = {
        ...novaTransacao.toObject(),
        portfolioNome: portfolio.nome, // <-- Aqui garantimos que o nome vai para a Posição
      };
      
      // 4. Atualizamos ou Criamos a Posição do Ativo (também dentro da sessão)
      // Passamos o ativoRef para que o service da posição tenha o slugClasseAtivo
      await posicaoAtivoService.atualizarPosicao(
        dadosParaPosicao,
        ativoRef,
        session,
      );

      // Se tudo der certo, commitamos as alterações no banco
      await session.commitTransaction();
      return novaTransacao;
    } catch (error) {
      // Se qualquer erro ocorrer (ex: vender sem ter estoque), nada é salvo
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Lista o histórico (Extrato) de transações de forma cronológica
   */
  async listarExtrato(filtros) {
    const query = {};

    if (filtros.idsPortfolios && filtros.idsPortfolios.length > 0) {
      query.idPortfolio = { $in: filtros.idsPortfolios };
    }
    if (filtros.idPortfolio) query.idPortfolio = filtros.idPortfolio;
    if (filtros.idInvestidor) query.idInvestidor = filtros.idInvestidor;
    if (filtros.tickerOperado) query.tickerOperado = filtros.tickerOperado.toUpperCase();

    return await Transacao.find(query)
      .sort({ dataTransacao: 1, createdAt: 1 }) // Crescente (Linha do tempo)
      .select("-__v -updatedAt") // Limpa campos de sistema desnecessários
      .lean();
  }
}

module.exports = new TransacaoService();
