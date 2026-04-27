const { z } = require("zod");

const ativoSchema = z.object({
  ticker: z
    .string()
    .min(3, "O ticker deve ter pelo menos 3 caracteres")
    .max(10, "Ticker muito longo")
    .trim()
    .transform((t) => t.toUpperCase()),

  quantidade: z
    .number({
      invalid_type_error: "A quantidade deve ser um número",
    })
    .positive("A quantidade deve ser maior que zero"),
});

module.exports = { ativoSchema };
