const mongoose = require("mongoose");

const transacaoSchema = new mongoose.Schema(
  {
    idPortfolio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
    },

    idCriador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },

    // OBRIGATÓRIO: O Ativo "Pai" (ex: PETR4)
    idAtivoReferencia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ativo",
      required: true,
    },
    ativoReferencia: { type: String }, // Híbrido: PETR4

    // O Ticker Real da operação (pode ser PETR4 ou PETRE281)
    tickerOperado: { type: String, required: true, uppercase: true },

    // Agora o tipo é uma operação financeira (Compra/Venda)
    operacao: {
      type: String,
      enum: ["COMPRA", "VENDA", "LANCAMENTO", "EXPIRACAO", "SUBSCRICAO", "BONIFICACAO", "DIVIDENDO", "JCP", "RENDIMENTO", "AMORTIZACAO"],
      required: true,
    },

    quantidade: { type: Number, required: true },
    precoUnitario: { type: Number, required: true },
    dataTransacao: { type: Date, default: Date.now },
    dataCom: { type: Date }, // Opcional: Data base para direito a proventos

    // --- Dados Específicos para Derivativos / Opções (Opcionais) ---
    precoAtivoBase: { type: Number }, // Preço da ação "pai" no momento da transação
    strike: { type: Number },         // Preço de exercício
    vencimento: { type: Date },       // Data de validade da opção
    tipoOpcao: { type: String, enum: ["CALL", "PUT"] },

    // Classe de Ativo (Global - Ex: Ações, FIIs)
    idClasseAtivo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClasseAtivo",
    },
    nomeClasseAtivo: { type: String },

    // Categoria de Ativo (Local - Ex: Buy & Hold, Trade)
    idCategoriaAtivo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoriaAtivo",
    },
    nomeCategoriaAtivo: { type: String },

    // Corretora e Investidor (Híbridos que já tínhamos)
    idCorretora: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Corretora",
      required: true,
    },
    nomeCurtoCorretora: { type: String },

    idInvestidor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investidor",
      required: true,
    },
    apelidoInvestidor: { type: String },

    // Vínculo opcional para Operações Estruturadas (Pernas)
    idEstrategiaOpcoes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EstrategiaOpcoes",
    },
    nomeEstrategiaOpcoes: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transacao", transacaoSchema);
