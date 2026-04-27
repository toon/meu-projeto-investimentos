const mongoose = require("mongoose");

const categoriaAtivoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    descricao: { type: String, trim: true },
    cor: { type: String, default: "#3b82f6" },
    idPortfolio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
    },
  },
  { timestamps: true },
);

// Garante que não existam duplicados no mesmo portfólio [cite: 3001]
categoriaAtivoSchema.index({ nome: 1, idPortfolio: 1 }, { unique: true });

module.exports = mongoose.model("CategoriaAtivo", categoriaAtivoSchema);
