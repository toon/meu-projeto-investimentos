const { z } = require("zod");

const investidorSchema = z.object({
  nome: z.string().min(3, "O nome completo é obrigatório"),
  apelido: z.string().min(2, "O apelido é obrigatório"),
  cpf: z.string().length(11, "O CPF deve ter exatamente 11 dígitos"),
});

module.exports = { investidorSchema };
