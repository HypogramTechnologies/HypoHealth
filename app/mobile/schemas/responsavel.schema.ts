import { z } from "zod";

export const responsavelSchema = z
  .object({
    nome: z
      .string({
        required_error: "Nome é obrigatório",
      })
      .min(1, "Nome é obrigatório"),

    email: z
      .string({
        required_error: "Email é obrigatório",
      })
      .min(1, "Email é obrigatório")
      .email("Email inválido"),

    senha: z
      .string({
        required_error: "Senha é obrigatória",
      })
      .min(1, "Senha é obrigatória"),

    confirmarSenha: z
      .string({
        required_error:
          "Confirmação de senha é obrigatória",
      })
      .min(
        1,
        "Confirmação de senha é obrigatória",
      ),
  })
  .refine(
    (data) => data.senha === data.confirmarSenha,
    {
      message: "As senhas não coincidem",
      path: ["confirmarSenha"],
    },
  );

export type ResponsavelFormData = z.infer<
  typeof responsavelSchema
>;