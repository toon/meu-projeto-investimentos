const { categoriaAtivoService } = require("../services");
const { categoriaAtivoSchema } = require("../validators");

class CategoriaAtivoController {
  async criar(req, res) {
    try {
      const { idPortfolio } = req.params; // ID vem da URL
      const dadosCorpo = categoriaAtivoSchema.parse(req.body); // Dados validados pelo Zod

      // Montamos o objeto completo ANTES de enviar ao Service,
      // exatamente como faríamos em uma Transação.
      const novaCategoria = await categoriaAtivoService.criar({
        ...dadosCorpo,
        idPortfolio,
      });

      res.status(201).json(novaCategoria);
    } catch (error) {
      res.status(400).json({ erro: error.message || "Dados inválidos" });
    }
  }

  async listar(req, res) {
    try {
      const { idPortfolio } = req.params;
      const categorias =
        await categoriaAtivoService.listarPorPortfolio(idPortfolio);
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }
}

module.exports = new CategoriaAtivoController();
