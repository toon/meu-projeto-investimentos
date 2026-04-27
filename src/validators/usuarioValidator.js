const { z } = require('zod');

const registroSchema = z.object({
  nome: z.string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome muito longo")
    .trim(),
  
  email: z.string()
    .email("Insira um e-mail válido")
    .toLowerCase()
    .trim(),
  
  senha: z.string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .max(100, "Senha muito longa")
});

const loginSchema = z.object({
  email: z.string().email("E-mail inválido").toLowerCase(),
  senha: z.string().min(1, "A senha é obrigatória")
});

module.exports = { registroSchema, loginSchema };