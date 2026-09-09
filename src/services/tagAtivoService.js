const { TagAtivo } = require("../models");

class TagAtivoService {
  async criar(dados) {
    return await TagAtivo.create(dados);
  }

  async listar() {
    return await TagAtivo.find().populate("idPai").sort({ nome: 1 });
  }

  async buscarPorId(id) {
    return await TagAtivo.findById(id).populate("idPai");
  }

  async listarRaizes() {
    return await TagAtivo.find({ idPai: null }).sort({ nome: 1 });
  }

  async listarPorPai(idPai) {
    return await TagAtivo.find({ idPai }).sort({ nome: 1 });
  }
}

module.exports = new TagAtivoService();
