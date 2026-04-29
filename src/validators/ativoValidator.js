const { z } = require("zod");

const ativoSchema = z.object({
  ticker: z.string().min(3).max(10).toUpperCase(),
  nome: z.string().min(2),
  idClasseAtivo: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID da Classe inválido"),
});

module.exports = { ativoSchema };
