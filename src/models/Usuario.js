const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },

    // Este é o papel GLOBAL do sistema (Admin vs Usuário Comum)
    papel: {
      type: String,
      enum: ["admin", "usuario"],
      default: "usuario",
    },

    // Estes são os papéis dentro de cada PORTFÓLIO
    acessos: [
      {
        idPortfolio: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio" },
        papel: { type: String, enum: ["dono", "leitor"] },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Usuario', usuarioSchema);