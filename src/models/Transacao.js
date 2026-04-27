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
    ticker: { type: String, required: true },
    tipo: {
      type: String,
      enum: ["COMPRA", "VENDA", "SUBSCRICAO", "BONIFICACAO"],
      required: true,
    },
    quantidade: { type: Number, required: true },
    precoUnitario: { type: Number, required: true },
    dataTransacao: { type: Date, default: Date.now },

    classeAtivo: {
      type: String,
      enum: ["ACAO", "OPCAO", "FII", "ETF", "BDR"],
      required: true,
    },
    corretora: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Corretora", // Nome exato do modelo global que criamos
      required: [
        true,
        "A corretora é obrigatória para registrar uma transação",
      ],
    },

    ativoReferencia: { type: String }, // Útil para o caso das Opções que você citou
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transacao", transacaoSchema);
