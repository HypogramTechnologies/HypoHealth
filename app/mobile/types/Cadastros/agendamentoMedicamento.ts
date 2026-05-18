
export type MedicamentoDTO = {
  medicamentoNome: string;
  medicamentoDosagem: string;
  medicamentoDescricao?: string;
  agendamentoDataInicio: string;
  agendamentoDataFim?: string;
  compartimento_id: string[];

  tipo: 'HORARIO_FIXO' | 'INTERVALO';

  data_inicio: string;
  data_fim?: string;

  intervalo_horas?: number;

  horarios: [];
};


export type AgendamentoMedicamento = {
  medicamentoNome: string;
  medicamentoDosagem: string;
  medicamentoDescricao?: string;
  agendamentoDataInicio: string;
  agendamentoDataFim?: string;
  compartimento_id: string[];

  tipo: 'HORARIO_FIXO' | 'INTERVALO';

  data_inicio: string;
  data_fim?: string;

  intervalo_horas?: number;

  horarios: [];
};