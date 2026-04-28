import { z } from 'zod';

export const medicamentoSchema = z.object({
  medicamentoNome: z.string().min(2),
  medicamentoDosagem: z.string().min(1),
  medicamentoDescricao: z.string().min(2),

  compartimentos: z.array(z.number()).min(1),

  tipo: z.enum([
    'HORARIO_FIXO',
    'INTERVALO',
  ]),

  intervalo_horas: z.number().optional(),

  horarios: z.array(
    z.object({
      hora: z.string(),
    })
  ),
});

export type MedicamentoFormData = z.infer<typeof medicamentoSchema>;