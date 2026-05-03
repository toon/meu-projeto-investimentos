const { z } = require("zod");

/**
 * @param {any} erro
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function manipuladorErros(erro, req, res, next) {
  // Recomendado para conseguir visualizar no terminal se acontecer algo grave
  console.error("Erro capturado:", erro.message);

  // 1. Erros de Validação do Zod
  if (erro instanceof z.ZodError || erro.issues) {
    const detalhes = (erro.issues || erro.errors).map(
      (/** @type {import('zod').ZodIssue} */ e) => ({
        campo: e.path[0],
        mensagem: e.message,
      }),
    );
    return res.status(400).json({
      erro: "Dados inválidos",
      detalhes,
    });
  }

  // 2. Erros de Validação do Mongoose
  if (erro.name === "ValidationError") {
    const mensagens = Object.values(erro.errors).map(
      (/** @type {{ message: string }} */ e) => e.message,
    );
    return res.status(400).json({
      erro: "Erro de validação no banco de dados",
      detalhes: mensagens,
    });
  }

  // 3. Casos específicos de negócio (Ex: Autenticação)
  if (erro.message === "Credenciais inválidas.") {
    return res.status(401).json({ erro: erro.message });
  }

  // 4. Fallback - Erros genéricos ou de regra de negócio (Services)
  return res.status(400).json({
    erro: erro.message || "Ocorreu um erro interno inesperado.",
  });
}

module.exports = manipuladorErros;