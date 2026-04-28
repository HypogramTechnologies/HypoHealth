import { z } from 'zod';

export const medicamentoSchema = z.object({
  medicamentoNome: z
    .string()
    .min(1, "Nome do medicamento é obrigatório"),

    medicamentoDescricao: z
    .string()
    //.optional(),
    .min(1, "Descrição do medicamento é obrigatória"),


  medicamentoDosagem: z
    .string()
    .min(1, "Dosagem é obrigatória"),

  compartimentoId: z
    .string()
    .min(1, "O compartimento deve ser selecionado"),

    medicamentoCriadoEm: z.string().optional(),
    
});

export type MedicamentoFormData = z.infer<typeof medicamentoSchema>;