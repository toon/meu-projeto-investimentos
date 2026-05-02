const { z } = require("zod");

const transacaoSchema = z.object({
  idPortfolio: z
    .string({ required_error: "O portfólio é obrigatório" })
    .regex(/^[0-9a-fA-F]{24}$/, "ID do Portfólio inválido"),
  idInvestidor: z
    .string({ required_error: "O investidor é obrigatório"})
    .regex(/^[0-9a-fA-F]{24}$/, "ID do Investidor inválido"),
  idAtivoReferencia: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "ID do Ativo inválido"),
  idCorretora: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "ID da Corretora inválido"),
  idInvestidor: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "ID do Investidor inválido"),
  idClasseAtivo: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID da Classe inválido"),
  idCategoriaAtivo: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "ID da Categoria inválido")
    .optional(),
  portfolioNome: z
    .string().optional(),
  tickerOperado: z
    .string()
    .optional()
    .transform((v) => v?.toUpperCase()), // Opcional (preenchido no service se nulo)
  operacao: z.enum(["COMPRA", "VENDA", "SUBSCRICAO", "BONIFICACAO"]),
  quantidade: z.number().positive(),
  precoUnitario: z.number().positive(),
  dataTransacao: z.string().datetime().optional(),
});

module.exports = { transacaoSchema };
