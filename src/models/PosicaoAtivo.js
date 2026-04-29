const mongoose = require("mongoose");

const posicaoAtivoSchema = new mongoose.Schema(
  {
    idPortfolio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
    },
    idInvestidor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investidor",
      required: true,
    },
    idAtivo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ativo",
      required: true,
    },

    // Metadados para performance e filtros
    tickerAtivo: { type: String, required: true },
    slugClasseAtivo: { type: String, required: true }, // Ex: "acoes", "fiis", "etfs"

    dataInicio: {
      type: Date,
      required: [true, "A data de início da posição é obrigatória"],
    },
    dataFim: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["ABERTA", "ENCERRADA"],
      default: "ABERTA",
    },

    // O usuário pode querer informar um Preço Médio inicial de outro sistema
    quantidadeTotal: { type: Number, default: 0 },
    precoMedio: { type: Number, default: 0 },
    custoTotal: { type: Number, default: 0 },
  }, { timestamps: true },
);

// Índice para garantir unicidade de posição aberta por ativo/investidor
posicaoAtivoSchema.index(
  { idInvestidor: 1, idAtivo: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "ABERTA" } },
);

module.exports = mongoose.model("PosicaoAtivo", posicaoAtivoSchema);
