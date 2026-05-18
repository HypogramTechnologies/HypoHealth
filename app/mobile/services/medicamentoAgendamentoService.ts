import { api } from './api';

import { CreateMedicamentoDTO } from '../types/Cadastros/medicamento';

export class MedicamentoService {
  static async create(
    data: CreateMedicamentoDTO,
  ) {
    const response = await api.post(
      '/medic-agendamento',
      data,
    );

    return response.data;
  }

  static async getById(id: string) {
    const response = await api.get(
      `/medicamentos/${id}`,
    );

    return response.data;
  }

  static async update(
    id: string,
    data: any,
  ) {
    const response = await api.put(
      `/medicamentos/${id}`,
      data,
    );

    return response.data;
  }
}