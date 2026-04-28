
import { api } from './api';
import {Compartimento} from '../types/Cadastros/compartimento';

import { ComboOption } from '../types/Outros/combo';

const ENDPOINT = '/Compartimentos';

export const CompartimentoService = {
  async buscarTodas(): Promise<Compartimento[]> {
    const response = await api.get<Compartimento[]>(ENDPOINT);
    return response.data;
  },

  async buscarCombo(): Promise<ComboOption[]> {
      const response = await api.get<ComboOption[]>(`${ENDPOINT}/combo`);
      return response.data;
  },

  async buscarPorId(id: string): Promise<Compartimento> {
    const response = await api.get<Compartimento>(`${ENDPOINT}/${id}`);
    return response.data;
  },

  async criar(dados: Compartimento): Promise<Compartimento> {
    const response = await api.post<Compartimento>(ENDPOINT, dados);
    return response.data;
  },

  async atualizar(id: string, dados: Partial<Compartimento>): Promise<Compartimento> {
    const response = await api.put<Compartimento>(`${ENDPOINT}/${id}`, dados);
    return response.data;
  },

  async excluir(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`);
  },
};
