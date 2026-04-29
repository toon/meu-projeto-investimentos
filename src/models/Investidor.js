const mongoose = require("mongoose");

const InvestidorSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    apelido: { type: String, required: true, trim: true },
    cpf: { type: String, required: true, trim: true },
    idPortfolio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
    },
  },
  { timestamps: true },
);

// Garante que não existam dois CPFs iguais no MESMO portfólio
InvestidorSchema.index({ cpf: 1, idPortfolio: 1 }, { unique: true });

module.exports = mongoose.model("Investidor", InvestidorSchema);
