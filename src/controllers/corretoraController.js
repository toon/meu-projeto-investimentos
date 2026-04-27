const { corretoraService } = require("../services");
const { corretoraSchema } = require("../validators");

class CorretoraController {
  /**
   * Criar uma nova corretora (Apenas Admin via autorizacaoGlobal)
   */
  async criar(req, res) {
    try {
      // Valida os dados de entrada com Zod
      const dadosValidados = corretoraSchema.parse(req.body);

      const corretora = await corretoraService.criar(dadosValidados);

      return res.status(201).json({
        mensagem: "Corretora global criada com sucesso!",
        dados: corretora,
      });
    } catch (erro) {
      // Tratamento de erro do Zod
      if (erro.issues) {
        return res.status(400).json({
          erro: "Falha na validação dos dados",
          detalhes: erro.issues.map((i) => ({
            campo: i.path[0],
            mensagem: i.message,
          })),
        });
      }

      // Tratamento de erro de duplicidade (nome único)
      if (erro.code === 11000) {
        return res
          .status(400)
          .json({ erro: "Esta corretora já está cadastrada no sistema." });
      }

      return res.status(500).json({ erro: "Erro interno ao criar corretora." });
    }
  }

  /**
   * Listar todas as corretoras (Disponível para qualquer usuário logado)
   */
  async listar(req, res) {
    try {
      const corretoras = await corretoraService.listarTodas();
      return res.json(corretoras);
    } catch (erro) {
      return res
        .status(500)
        .json({ erro: "Erro ao buscar a lista de corretoras." });
    }
  }
}

module.exports = new CorretoraController();
