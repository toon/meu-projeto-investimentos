const { classeAtivoService } = require("../services");
const { classeAtivoSchema } = require("../validators");

class ClasseAtivoController {
  async criar(req, res) {
    try {

      const dadosValidados = classeAtivoSchema.parse(req.body);
      const novaClasse = await classeAtivoService.criar(dadosValidados);

      return res.status(201).json(novaClasse);
    } catch (erro) {
      if (erro.name === "ZodError") {
        return res
          .status(400)
          .json({ erro: "Dados inválidos", detalhes: erro.errors });
      }
      return res.status(400).json({ erro: erro.message });
    }
  }

  async listar(req, res) {
    try {
      const classes = await classeAtivoService.listar();
      return res.json(classes);
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
  }
}

module.exports = new ClasseAtivoController();
