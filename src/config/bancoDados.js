const mongoose = require('mongoose');

const conectarBanco = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado ao MongoDB com sucesso');
  } catch (erro) {
    console.error('❌ Erro ao conectar ao MongoDB:', erro.message);
    process.exit(1);
  }
};

module.exports = conectarBanco;