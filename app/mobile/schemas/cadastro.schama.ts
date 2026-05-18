import { z } from "zod";

export const cadastroSchema = z
  .object({
    nome: z
      .string()
      .min(3, "Nome muito curto"),

    email: z
      .string()
      .email("Email inválido"),

      dispositivo_id: z.string().min(1, "Informe o dispositivo"),
      
    senha: z
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres"),

    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });