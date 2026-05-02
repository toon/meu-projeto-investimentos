const { autenticacaoService } = require("../services");
const {
  registroSchema,
  loginSchema,
} = require("../validators");
const { z } = require("zod");

class UsuarioController {
  async registrar(req, res, next) {
    try {
      const dadosValidados = registroSchema.parse(req.body);
      const usuario = await autenticacaoService.registrar(dadosValidados);

      return res.status(201).json({
        mensagem: "Usuário criado com sucesso!",
        id: usuario._id,
      });
    } catch (erro) {
      next(erro);
    }
  }

  async login(req, res, next) {
    try {
      const credenciais = loginSchema.parse(req.body);
      const resultado = await autenticacaoService.login(
        credenciais.email,
        credenciais.senha,
      );

      return res.json(resultado);
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = new UsuarioController();
