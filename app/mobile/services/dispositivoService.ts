
import { api } from './api';
import {Dispositivo} from '../types/Cadastros/dispositivo';

import { ComboOption } from '../types/Outros/combo';

const ENDPOINT = '/Dispositivos';

export const DispositivoService = {
  async buscarTodas(): Promise<Dispositivo[]> {
    const response = await api.get<Dispositivo[]>(ENDPOINT);
    return response.data;
  },

  async buscarCombo(): Promise<ComboOption[]> {
      const response = await api.get<ComboOption[]>(`${ENDPOINT}/combo`);
      return response.data;
  },

  async buscarPorId(id: string): Promise<Dispositivo> {
    const response = await api.get<Dispositivo>(`${ENDPOINT}/${id}`);
    return response.data;
  },

  async criar(dados: Dispositivo): Promise<Dispositivo> {
    const response = await api.post<Dispositivo>(ENDPOINT, dados);
    return response.data;
  },

  async atualizar(id: string, dados: Partial<Dispositivo>): Promise<Dispositivo> {
    const response = await api.put<Dispositivo>(`${ENDPOINT}/${id}`, dados);
    return response.data;
  },

  async excluir(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`);
  },
};
