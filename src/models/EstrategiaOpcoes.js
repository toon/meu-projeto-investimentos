const mongoose = require("mongoose");

const estrategiaOpcoesSchema = new mongoose.Schema(
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
    nome: { type: String, required: true, trim: true }, // Ex: "Taxa PETR4 10%"
    tipo: {
      type: String,
      enum: ["VENDA_COBERTA", "TRAVA_ALTA", "TRAVA_BAIXA", "BORBOLETA", "PERSONALIZADA"],
      default: "PERSONALIZADA",
    },
    status: { type: String, enum: ["ABERTA", "ENCERRADA"], default: "ABERTA" },
    dataAbertura: { type: Date, default: Date.now },
    dataEncerramento: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EstrategiaOpcoes", estrategiaOpcoesSchema);