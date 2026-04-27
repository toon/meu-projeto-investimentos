const mongoose = require('mongoose');
const { accessibleRecordsPlugin } = require('@casl/mongoose');

const ativoSchema = new mongoose.Schema({
  ticker: { type: String, required: true },
  idCriador: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
}, { timestamps: true });

ativoSchema.plugin(accessibleRecordsPlugin);
module.exports = mongoose.model('Ativo', ativoSchema);