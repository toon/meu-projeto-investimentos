const mongoose = require("mongoose");
const {
  Transacao,
  Ativo,
  Corretora,
  Investidor,
  ClasseAtivo,
  CategoriaAtivo,
  Portfolio,
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
        .select("ticker slugClasseAtivo")
        .session(session);
      const corretora = await Corretora.findById(dados.idCorretora)
        .select("nomeCurto")
        .session(session);
      const investidor = await Investidor.findById(dados.idInvestidor)
        .select("apelido")
        .session(session);
      const classe = await ClasseAtivo.findById(dados.idClasseAtivo)
        .select("nome")
        .session(session);
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

      // 2. Montamos o objeto com a lógica de campos híbridos
      const dadosCompletos = {
        ...dados,
        idCriador,
        tickerOperado: (dados.tickerOperado || ativoRef?.ticker).toUpperCase(),
        ativoReferencia: ativoRef?.ticker || "N/A",
        nomeCurtoCorretora: corretora?.nomeCurto || "N/A",
        apelidoInvestidor: investidor?.apelido || "N/A",
        nomeClasseAtivo: classe?.nome || "N/A",
        nomeCategoriaAtivo: categoria?.nome || "Geral",
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

  async listarPorPortfolio(idPortfolio) {
    return await Transacao.find({ idPortfolio }).sort({ dataTransacao: -1 });
  }
}

module.exports = new TransacaoService();
