import { api } from "./api";

import { Compartimento } from "../types/Cadastros/compartimento";

export class CompartimentoService {
  static async getByDispositivo(dispositivoId: string) {
    const response = await api.get<Compartimento[]>(
      `/compartimentos/dispositivo/${dispositivoId}`,
    );

    return response.data;
  }

  
}
