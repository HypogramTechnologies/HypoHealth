
import { api } from './api';
import {type MedicamentoFiltro, Medicamento, MedicamentoDTO} from '../types/Cadastros/medicamento';

import { ComboOption } from '../types/Outros/combo';

const ENDPOINT = '/Medicamentos';

export const MedicamentoService = {
  async buscarTodas(filtro?: MedicamentoFiltro): Promise<Medicamento[]> {
    const response = await api.get<Medicamento[]>(ENDPOINT, { params: filtro});
    return response.data;
  },

  async buscarCombo(): Promise<ComboOption[]> {
      const response = await api.get<ComboOption[]>(`${ENDPOINT}/combo`);
      return response.data;
  },

  async buscarPorId(id: string): Promise<Medicamento> {
    const response = await api.get<Medicamento>(`${ENDPOINT}/${id}`);
    return response.data;
  },

  async criar(dados: MedicamentoDTO): Promise<Medicamento> {
    const response = await api.post<Medicamento>(ENDPOINT, dados);
    return response.data;
  },

  async atualizar(id: string, dados: Partial<Medicamento>): Promise<Medicamento> {
    const response = await api.put<Medicamento>(`${ENDPOINT}/${id}`, dados);
    return response.data;
  },

  async excluir(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`);
  },
};
