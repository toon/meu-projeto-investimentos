const { transacaoService } = require("../services");
const { transacaoSchema } = require("../validators");

class TransacaoController {
  
  async registrar(req, res, next) {
    try {
      // 1. Validação Zod
      const dadosValidados = transacaoSchema.parse(req.body);

      // Verifique se o middleware 'autenticar' está realmente populando req.usuario
      if (!req.usuario || !req.usuario._id) {
        throw new Error("Usuário não identificado na sessão.");
      }

      // 2. Preparação
      const novaTransacao = await transacaoService.registrar(
        dadosValidados,
        req.usuario._id, // ID do Gestor logado
      );

      return res.status(201).json(novaTransacao);
      
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = new TransacaoController();
