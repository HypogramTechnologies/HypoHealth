import { z } from 'zod';

export const medicamentoSchema = z.object({
  medicamentoNome: z
    .string()
    .min(2, 'Nome obrigatório'),

  medicamentoDosagem: z
    .string()
    .min(1, 'Dosagem obrigatória'),

  medicamentoDescricao: z
    .string()
    .min(2, 'Descrição obrigatória'),

  compartimentos: z
    .array(z.string())
    .min(1, 'Selecione ao menos um compartimento'),

  tipo: z.enum([
    'HORARIO_FIXO',
    'INTERVALO',
  ]),

  intervalo_horas: z.number().optional(),

  horarios: z
    .array(
      z.string().min(1, 'Horário obrigatório'),
    )
    .min(1, 'Adicione pelo menos um horário'),
});

export type MedicamentoFormData =
  z.infer<typeof medicamentoSchema>;