const { ClasseAtivo } = require("../models");

class ClasseAtivoService {
  async criar(dados) {
    return await ClasseAtivo.create(dados);
  }

  async listar() {
    return await ClasseAtivo.find().sort({ nome: 1 });
  }
}

module.exports = new ClasseAtivoService();
