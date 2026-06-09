import { z } from 'zod';

const horarioSchema = z.string().refine(
  (valor) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    return regex.test(valor);
  },
  {
    message: 'Horário inválido.',
  },
);

export const medicamentoSchema = z.object({
  medicamentoNome: z
    .string()
    .min(2, 'Nome obrigatório'),

  medicamentoDosagem: z
    .string()
    .min(1, 'Dosagem obrigatória'),

  data_inicio: z.date(),

  data_fim: z
    .date()
    .nullable()
    .optional(),

  medicamentoDescricao: z
    .string()
    .min(2, 'Descrição obrigatória'),

  compartimentos: z
    .array(z.string())
    .min(
      1,
      'Selecione ao menos um compartimento',
    ),

  tipo: z.enum([
    'HORARIO_FIXO',
    'INTERVALO',
  ]),

  intervalo_horas: z
    .number()
    .optional(),

  horarios: z
    .array(horarioSchema)
    .min(
      1,
      'Adicione pelo menos um horário',
    ),
});

export type MedicamentoFormData =
  z.infer<typeof medicamentoSchema>;