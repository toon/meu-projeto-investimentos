const { Ativo, ClasseAtivo } = require("../models");

class AtivoService {
  async criar(dados) {
    const classe = await ClasseAtivo.findById(dados.idClasseAtivo);

    const tagsAtivos = Array.isArray(dados.tagsAtivos)
      ? dados.tagsAtivos
      : dados.tagsAtivos
        ? [dados.tagsAtivos]
        : [];

    if (dados.idTagAtivo && !tagsAtivos.includes(dados.idTagAtivo)) {
      tagsAtivos.unshift(dados.idTagAtivo);
    }

    const dadosCompletos = {
      ...dados,
      tagsAtivos,
      slugClasseAtivo: classe?.slug || "N/A",
    };

    delete dadosCompletos.idTagAtivo;

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

    return await Ativo.find(filtro)
      .populate("tagsAtivos")
      .limit(20)
      .sort({ ticker: 1 });
  }
}

module.exports = new AtivoService();
