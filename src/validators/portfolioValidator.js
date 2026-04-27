const { z } = require('zod');

const portfolioSchema = z.object({
  nome: z.string()
    .min(3, "O nome do portfólio deve ter pelo menos 3 caracteres")
    .max(50, "Nome muito longo"),
  descricao: z.string()
    .max(200, "A descrição deve ter no máximo 200 caracteres")
    .optional()
});

module.exports = { portfolioSchema };