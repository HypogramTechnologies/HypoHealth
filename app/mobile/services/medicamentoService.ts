
import { api } from './api';
import {type MedicamentoFiltro, Medicamento, MedicamentoDTO} from '../types/Cadastros/medicamento';

import { ComboOption } from '../types/Outros/combo';

const ENDPOINT = '/medicamentos';

export const MedicamentoService = {
  async getAll(filtro?: MedicamentoFiltro): Promise<Medicamento[]> {
    const response = await api.get<Medicamento[]>(ENDPOINT, { params: filtro});
    return response.data;
  },

  async getCombo(): Promise<ComboOption[]> {
      const response = await api.get<ComboOption[]>(`${ENDPOINT}/combo`);
      return response.data;
  },

  async getById(id: string): Promise<Medicamento> {
    const response = await api.get<Medicamento>(`${ENDPOINT}/${id}`);
    return response.data;
  },

  async create(dados: MedicamentoDTO): Promise<Medicamento> {
    const response = await api.post<Medicamento>(ENDPOINT, dados);
    return response.data;
  },

  async update(id: string, dados: Partial<Medicamento>): Promise<Medicamento> {
    const response = await api.put<Medicamento>(`${ENDPOINT}/${id}`, dados);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`);
  },
};
