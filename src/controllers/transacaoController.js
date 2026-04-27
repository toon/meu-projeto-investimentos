const { transacaoService } = require("../services");
const { transacaoSchema } = require("../validators");

class TransacaoController {
  async registrar(req, res) {
    try {
      // 1. Validação Zod
      const dadosValidados = transacaoSchema.parse(req.body);

      // 2. Preparação (Vinculando ao portfólio da URL e usuário da sessão)
      const novaTransacao = await transacaoService.registrar({
        ...dadosValidados,
        idPortfolio: req.params.idPortfolio,
        idCriador: req.usuario._id,
      });

      return res.status(201).json(novaTransacao);
    } catch (erro) {
      if (erro.issues || erro.errors) {
        return res.status(400).json({
          erro: "Dados da transação inválidos",
          detalhes: (erro.issues || erro.errors).map((e) => ({
            campo: e.path[0],
            mensagem: e.message,
          })),
        });
      }
      return res.status(400).json({ erro: erro.message });
    }
  }
}

module.exports = new TransacaoController();
