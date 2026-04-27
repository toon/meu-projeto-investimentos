const { Corretora } = require("../models");

class CorretoraService {
  async criar(dados) {
    return await Corretora.create(dados);
  }

  async listarTodas() {
    return await Corretora.find().sort({ nome: 1 });
  }

  async buscarPorId(id) {
    return await Corretora.findById(id);
  }
}

module.exports = new CorretoraService();
