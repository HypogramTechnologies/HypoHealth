export interface Medicamento {
  medicamentoId: string;
  medicamentoNome: string;
  medicamentoDescricao: string;
  medicamentoDosagem: string;
  medicamentoCriadoEm: string;
}

export interface MedicamentoFiltro {
  medicamentoNome?: string;
  medicamentoDosagem?: string;
  medicamentoDescricao?: string;
}


export type CreateMedicamentoDTO = {
  nome: string;

  dosagem: string;

  descricao: string;

  compartimento_id: string;

  tipo:
    | 'HORARIO_FIXO'
    | 'INTERVALO';

  data_inicio: string;

  data_fim?: string;

  intervalo_horas?: number;

  horario?: string;

  horarios?: string[];
};

export interface ProgramacaoItem {
  id: string;

  medicamento: {
    id: string;
    nome: string;
    dosagem: string;
  };

  horarios: {
    id: string;
    horario: string;

    status:
      | 'PENDENTE'
      | 'RETIRADO'
      | 'ATRASADO'
      | 'NAO_RETIRADO';

    horario_retirada: string | null;
  }[];
}