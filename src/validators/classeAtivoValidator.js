const { z } = require("zod");

const classeAtivoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  slug: z
    .string()
    .min(2)
    .transform((s) => s.toUpperCase()),
  descricao: z.string().optional(),
});

module.exports = { classeAtivoSchema };
