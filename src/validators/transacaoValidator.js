const { z } = require("zod");

const transacaoSchema = z.object({
  portfolioId: z
    .string()
    .regex(/^[0-9a-fA-C]{24}$/i, "ID do Portfólio inválido"),
  ativoId: z.string().regex(/^[0-9a-fA-C]{24}$/i, "ID do Ativo inválido"),
  corretoraId: z
    .string()
    .regex(/^[0-9a-fA-C]{24}$/i, "ID da Corretora inválido"), // Novo campo
  tipo: z.enum(["COMPRA", "VENDA"]),
  quantidade: z.number().positive("A quantidade deve ser maior que zero"),
  preco: z.number().positive("O preço deve ser maior que zero"),
  data: z.string().datetime().optional(), // ou z.coerce.date()
});

module.exports = { transacaoSchema };