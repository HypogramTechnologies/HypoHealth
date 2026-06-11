import { z } from "zod";

export const abastecimentoSchema = z.object({
  compartimento: z
    .number({
      required_error: "Selecione um compartimento",
    })
    .min(1, "Selecione um compartimento"),
});

export type AbastecimentoFormData = z.infer<
  typeof abastecimentoSchema
>;