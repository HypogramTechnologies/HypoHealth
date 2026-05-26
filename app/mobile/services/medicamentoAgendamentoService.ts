import { api } from './api';

import { CreateMedicamentoDTO, UpdateMedicamentoDTO } from '../types/Cadastros/medicamento';

export class MedicamentoService {
  static async create(
    data: CreateMedicamentoDTO,
  ) {
    const response = await api.post(
      '/completos',
      data,
    );

    return response.data;
  }

  static async getById(id: string) {

    console.log(`Buscando medicamento com ID: ${id}`);
    const response = await api.get(
      `/completos/${id}`,
    );

    console.log("Resposta do servidor no getById:", response.data);
    return response.data;
  }

  static async update(
    id: string,
    data: UpdateMedicamentoDTO,
  ) {
    const response = await api.put(
      `/completos/${id}`,
      data,
    );

    return response.data;
  }
}