const mongoose = require("mongoose");

const TagAtivoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true }, // Ex: "Ações"
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    }, // Ex: "acao"
    descricao: { type: String, trim: true },
    idPai: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TagAtivo",
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);

// Evita nomes repetidos dentro do mesmo ramo da hierarquia.
TagAtivoSchema.index({ nome: 1, idPai: 1 }, { unique: true });

module.exports = mongoose.model("TagAtivo", TagAtivoSchema);
