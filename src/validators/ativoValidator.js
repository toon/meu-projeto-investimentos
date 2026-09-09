const { z } = require("zod");

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "ID inválido");

const ativoSchema = z.object({
  ticker: z.string().min(3).max(10).toUpperCase(),
  nome: z.string().min(2),
  idClasseAtivo: objectIdSchema,
  tagsAtivos: z
    .union([objectIdSchema, z.array(objectIdSchema)])
    .optional()
    .default([]),
});

module.exports = { ativoSchema };
