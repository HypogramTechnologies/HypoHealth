import { api } from "./api";
const ENDPOINT = "/dispositivos";

export class DispositivoService {
  static async create(data: {
    nome: string;
    mac_address: string;
  }) {
    const response = await api.post(ENDPOINT, data);

    return response.data;
  }

  static async getAll() {
    const response = await api.get(ENDPOINT);

    return response.data;
  }

static async verificarMac(
  numeroSerie: string,
) {
  const response =
    await api.get(
      `/dispositivos/verificar`,
      {
        params: {
          numero_serie:
            numeroSerie,
        },
      },
    );

  return response.data;
}

  static async update(
    id: string,
    data: {
      nome?: string;
      mac_address?: string;
    },
  ) {
    const response = await api.put(`${ENDPOINT}/${id}`, data);

    return response.data;
  }
}