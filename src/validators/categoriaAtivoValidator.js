const { z } = require("zod");

const categoriaAtivoSchema = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").max(50),
  descricao: z.string().max(200).optional(),
  cor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida")
    .optional(),
});

module.exports = { categoriaAtivoSchema };
