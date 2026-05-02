const { classeAtivoService } = require("../services");
const { classeAtivoSchema } = require("../validators");

class ClasseAtivoController {
  async criar(req, res, next) {
    try {

      const dadosValidados = classeAtivoSchema.parse(req.body);
      const novaClasse = await classeAtivoService.criar(dadosValidados);

      return res.status(201).json(novaClasse);
    } catch (erro) {
      next(erro);
    }
  }

  async listar(req, res, next) {
    try {
      const classes = await classeAtivoService.listar();
      return res.json(classes);
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = new ClasseAtivoController();
