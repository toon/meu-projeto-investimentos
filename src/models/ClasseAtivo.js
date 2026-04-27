const mongoose = require("mongoose");

const classeAtivoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, unique: true }, // Ex: "Ações"
    slug: { type: String, required: true, unique: true }, // Ex: "ACAO"
    descricao: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ClasseAtivo", classeAtivoSchema);
