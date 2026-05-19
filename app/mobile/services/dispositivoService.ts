import { api } from "./api";

export class DispositivoService {
  static async getPrimeiro() {
    const response = await api.get("/dispositivos/primeiro");
    return response.data;
  }
}