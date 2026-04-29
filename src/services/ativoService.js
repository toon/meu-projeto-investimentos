const { Ativo, ClasseAtivo } = require("../models");

class AtivoService {
  async criar(dados) {
    const classe = await ClasseAtivo.findById(dados.idClasseAtivo);
    const dadosCompletos = {
      ...dados,
      slugClasseAtivo: classe?.slug || "N/A",
    };
    return await Ativo.create(dadosCompletos);
  }

  async listar(busca = "") {
    const filtro = busca
      ? {
          $or: [
            { ticker: new RegExp(busca, "i") },
            { nome: new RegExp(busca, "i") },
          ],
        }
      : {};
    return await Ativo.find(filtro).limit(20).sort({ ticker: 1 });
  }
}

module.exports = new AtivoService();
