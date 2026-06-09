import { z } from "zod";

export const cadastroSchema = z
  .object({
    nome: z
      .string()
      .min(3, "Nome muito curto"),

    email: z
      .string()
      .email("Email inválido"),

    // telefone: z
    //   .string()
    //   .min(10, "Telefone inválido"),

      numeroSerie: z
  .string()

  .trim()

  .transform(value =>
    value.toUpperCase(),
  )

 

  .refine(
    value =>
      value.length >= 12 &&
      value.length <= 17,
    {
      message:
        "Número de série inválido",
    },
  )
   .refine(
    value =>
      /^[A-F0-9]+$/.test(value),
    {
      message:
        "O número de série deve conter apenas caracteres hexadecimais (0-9 e A-F)",
    },
  )
  ,
    nomeDispositivo: z
      .string()
      .min(
        3,
        "Informe o nome do dispositivo",
      ),

    senha: z
      .string()
      .min(
        6,
        "Senha deve ter pelo menos 6 caracteres",
      ),

    confirmarSenha: z
      .string()
      .min(
        6,
        "Confirme sua senha",
      ),
  })

  .refine(
    data =>
      data.senha ===
      data.confirmarSenha,
    {
      message:
        "As senhas não coincidem",

      path: [
        "confirmarSenha",
      ],
    },
  );

export type CadastroFormData =
  z.infer<
    typeof cadastroSchema
  >;