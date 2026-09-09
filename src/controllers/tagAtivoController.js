const { tagAtivoService } = require("../services");
const { tagAtivoSchema } = require("../validators");

class TagAtivoController {
  async criar(req, res, next) {
    try {
      const dadosValidados = tagAtivoSchema.parse(req.body);
      const novaTag = await tagAtivoService.criar(dadosValidados);

      return res.status(201).json(novaTag);
    } catch (erro) {
      next(erro);
    }
  }

  async listar(req, res, next) {
    try {
      const tags = await tagAtivoService.listar();
      return res.json(tags);
    } catch (erro) {
      next(erro);
    }
  }

  async listarRaizes(req, res, next) {
    try {
      const tags = await tagAtivoService.listarRaizes();
      return res.json(tags);
    } catch (erro) {
      next(erro);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      const tag = await tagAtivoService.buscarPorId(id);

      if (!tag) {
        return res.status(404).json({ erro: "Tag não encontrada." });
      }

      return res.json(tag);
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = new TagAtivoController();
