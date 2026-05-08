const { z } = require("zod");

const estrategiaOpcoesSchema = z.object({
  idPortfolio: z
    .string({ required_error: "O portfólio é obrigatório" })
    .regex(/^[0-9a-fA-F]{24}$/, "ID do Portfólio inválido"),
  idInvestidor: z
    .string({ required_error: "O investidor é obrigatório" })
    .regex(/^[0-9a-fA-F]{24}$/, "ID do Investidor inválido"),
  nome: z.string().min(1, "O nome da estratégia é obrigatório"),
  tipo: z.enum(["VENDA_COBERTA", "TRAVA_ALTA", "TRAVA_BAIXA", "BORBOLETA", "PERSONALIZADA"]).optional(),
  status: z.enum(["ABERTA", "ENCERRADA"]).optional(),
});

module.exports = { estrategiaOpcoesSchema };