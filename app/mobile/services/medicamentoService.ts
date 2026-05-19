import { api } from './api';

import {
  MedicamentoDetalhado,
  CreateMedicamentoDTO,
  UpdateMedicamentoDTO,
  MedicamentoFiltro,
} from "../types/Cadastros/medicamento";

import { ComboOption } from '../types/Outros/combo';

const ENDPOINT = '/medicamentos';

export const MedicamentoService = {
  async getAll(
    filtro?: MedicamentoFiltro,
  ): Promise<MedicamentoDetalhado[]> {

    const response =
      await api.get<MedicamentoDetalhado[]>(
        `${ENDPOINT}/completos`,
        {
          params: filtro,
        },
      );

    return response.data;
  },

  async getCombo(): Promise<ComboOption[]> {
    const response =
      await api.get<ComboOption[]>(
        `${ENDPOINT}/combo`,
      );

    return response.data;
  },

  async create(
    dados: CreateMedicamentoDTO,
  ): Promise<MedicamentoDetalhado> {
    console.log('Criando medicamento com dados:', dados);
    const response =
      await api.post<MedicamentoDetalhado>(
        'completos',
        dados,
      );
    console.log(response.data)
    return response.data;
  },

  async getById(
    id: string,
  ): Promise<MedicamentoDetalhado> {

    const response =
      await api.get<MedicamentoDetalhado>(
        `${ENDPOINT}/${id}`,
      );

    return response.data;
  },

  async update(
    id: string,
    dados: UpdateMedicamentoDTO,
  ): Promise<MedicamentoDetalhado> {

    const response =
      await api.put<MedicamentoDetalhado>(
        `${ENDPOINT}/${id}`,
        dados,
      );

    return response.data;
  },

  async delete(
    id: string,
  ): Promise<void> {

    await api.delete(
      `${ENDPOINT}/${id}`,
    );
  },
};