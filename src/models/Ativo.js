const mongoose = require("mongoose");

const AtivoSchema = new mongoose.Schema(
  {
    ticker: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    nome: { type: String, required: true, trim: true },
    idClasseAtivo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClasseAtivo",
      required: true,
    },
    slugClasseAtivo: { type: String }, // Híbrido para busca rápida
    tagsAtivos: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "TagAtivo",
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Ativo", AtivoSchema);
