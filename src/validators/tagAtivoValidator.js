const { z } = require("zod");

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

const tagAtivoSchema = z.object({
  nome: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome muito longo")
    .trim(),

  slug: z
    .string()
    .min(2, "O slug deve ter pelo menos 2 caracteres")
    .trim()
    .transform((valor) => valor.toLowerCase()),

  descricao: z.string().trim().optional(),

  idPai: z
    .string()
    .trim()
    .regex(objectIdRegex, "idPai deve ser um ObjectId válido")
    .optional()
    .nullable(),
});

module.exports = { tagAtivoSchema };