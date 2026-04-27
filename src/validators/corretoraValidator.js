const { z } = require("zod");

const corretoraSchema = z.object({
  nome: z.string().min(2, "Nome da corretora é obrigatório"),
  nomeCurto: z
    .string()
    .min(2, "O nome curto é obrigatório")
    .max(15, "Máximo de 15 caracteres"),
  codigoCvm: z.string().optional(),
  logoUrl: z.string().url("URL do logo inválida").optional(),
});

module.exports = { corretoraSchema };
