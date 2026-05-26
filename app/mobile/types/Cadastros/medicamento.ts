export interface Medicamento {
  medicamentoId: string;

  medicamentoNome: string;

  medicamentoDescricao: string;

  medicamentoDosagem: string;

  medicamentoCriadoEm: string;

  
}

export interface MedicamentoDetalhado {
  id: string;

  nome: string;

  descricao: string;

  usuario_id?: string;

  dosagem: string;

  compartimento_id: string;

  tipo:
    | "HORARIO_FIXO"
    | "INTERVALO";

  data_inicio: string;

  data_fim?: string;

  intervalo_horas?: number;

  horario?: string;

  horarios?: string[];
}

export interface MedicamentoFiltro {
  medicamentoNome?: string;

  medicamentoDosagem?: string;

  medicamentoDescricao?: string;

  usuario_id?: string;
}

export type TipoMedicamento =
  | "HORARIO_FIXO"
  | "INTERVALO";

export type CreateMedicamentoDTO = {
  nome: string;

  dosagem: string;

  descricao: string;

  usuario_id?: string;

  compartimento_ids: string[];

  tipo: TipoMedicamento;

  data_inicio: string;

  data_fim?: string;

  intervalo_horas?: number;

  horario?: string;

  horarios?: string[];
};

export type UpdateMedicamentoDTO = {
  nome?: string;

  dosagem?: string;

  descricao?: string;

  usuario_id?: string;

  compartimento_id?: string;

  tipo?: TipoMedicamento;

  data_inicio?: string;

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
      | "PENDENTE"
      | "RETIRADO"
      | "ATRASADO"
      | "NAO_RETIRADO";

    horario_retirada: string | null;
  }[];
}