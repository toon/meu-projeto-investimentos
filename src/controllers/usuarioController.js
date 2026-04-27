const { autenticacaoService } = require("../services");
const {
  registroSchema,
  loginSchema,
} = require("../validators");
const { z } = require("zod");

class UsuarioController {
  async registrar(req, res) {
    try {
      const dadosValidados = registroSchema.parse(req.body);
      const usuario = await autenticacaoService.registrar(dadosValidados);

      return res.status(201).json({
        mensagem: "Usuário criado com sucesso!",
        id: usuario._id,
      });
    } catch (erro) {
      // Verificamos se é um erro do Zod (ele costuma ter a propriedade 'issues' ou 'errors')
      if (erro.issues || erro.errors) {
        const detalhes = (erro.issues || erro.errors).map((e) => ({
          campo: e.path[0],
          mensagem: e.message,
        }));

        return res.status(400).json({
          erro: "Falha na validação",
          detalhes,
        });
      }

      // Erro de negócio (ex: e-mail já cadastrado)
      return res.status(400).json({
        erro: erro.message || "Ocorreu um erro inesperado",
      });
    }
  }

  async login(req, res) {
    try {
      const credenciais = loginSchema.parse(req.body);
      const resultado = await autenticacaoService.login(
        credenciais.email,
        credenciais.senha,
      );

      return res.json(resultado);
    } catch (erro) {
      if (erro instanceof z.ZodError) {
        return res
          .status(400)
          .json({ erro: "E-mail ou senha em formato inválido." });
      }
      return res.status(401).json({ erro: erro.message });
    }
  }
}

module.exports = new UsuarioController();
