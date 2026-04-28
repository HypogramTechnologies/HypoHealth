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


export type MedicamentoDTO = {
  medicamentoNome: string;
  medicamentoDosagem: string;
  medicamentoDescricao: string;
};