const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    descricao: String,
    dono: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

portfolioSchema.index({ dono: 1, isDefault: 1 });
module.exports = mongoose.model('Portfolio', portfolioSchema);