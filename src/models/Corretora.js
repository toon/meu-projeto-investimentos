const mongoose = require("mongoose");

const CorretoraSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, unique: true, trim: true },
    nomeCurto: { type: String, required: true, unique: true, trim: true },
    codigoCvm: { type: String, trim: true }, // Opcional, útil para corretoras brasileiras
    logoUrl: { type: String, trim: true }, // Opcional, para o frontend exibir o ícone
  },
  { timestamps: true },
);

module.exports = mongoose.model("Corretora", CorretoraSchema);
