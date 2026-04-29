const { transacaoService } = require("../services");
const { transacaoSchema } = require("../validators");

class TransacaoController {
  async registrar(req, res) {
    try {
      // 1. Validação Zod
      const dadosValidados = transacaoSchema.parse(req.body);

      // Verifique se o middleware 'autenticar' está realmente populando req.usuario
      if (!req.usuario || !req.usuario._id) {
        throw new Error("Usuário não identificado na sessão.");
      }

      // 2. Preparação (Vinculando ao portfólio da URL e usuário da sessão)
      const novaTransacao = await transacaoService.registrar(
        {
          ...dadosValidados,
          idPortfolio: req.params.idPortfolio,
        },
        req.usuario._id,
      );

      return res.status(201).json(novaTransacao);
      
    } catch (erro) {
      // 1. Erro de Validação do Zod (sempre tem .issues e é array)
      if (erro.issues && Array.isArray(erro.issues)) {
        return res.status(400).json({
          erro: "Dados da transação inválidos",
          detalhes: erro.issues.map((e) => ({
            campo: e.path[0],
            mensagem: e.message,
          })),
        });
      }

      // 2. Erro de Validação do Mongoose (tem .errors e é um OBJETO, não array)
      if (erro.errors) {
        const mensagens = Object.values(erro.errors).map((e) => e.message);
        return res.status(400).json({
          erro: "Erro de validação no banco de dados",
          detalhes: mensagens,
        });
      }

      // 3. Erros de Negócio ou Erros Críticos (MongoDB Transaction, etc)
      // É aqui que o erro do "transaction number" vai aparecer agora
      return res.status(400).json({
        erro: erro.message || "Ocorreu um erro inesperado",
      });
    }
  }
}

module.exports = new TransacaoController();
