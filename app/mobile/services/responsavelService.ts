import { api } from "./api";

interface ResponsavelResponse {
  id: string;
  usuario_id: string;
  dispositivo_id: string;
  tipo_acesso: string;
  criado_em: string;
}

export class ResponsavelService {
  // Adicionar responsável a um dispositivo
  async adicionarResponsavel(
    usuarioId: string,
    dispositivoId: string
  ): Promise<ResponsavelResponse> {
    try {
      const response = await api.post("/usuario-dispositivo/responsavel", {
        usuario_id: usuarioId,
        dispositivo_id: dispositivoId,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar responsável:", error);
      throw error;
    }
  }

  // Listar todos os responsáveis de um dispositivo
  async listarResponsaveisPorDispositivo(
    dispositivoId: string
  ): Promise<ResponsavelResponse[]> {
    try {
      const response = await api.get(`/usuario-dispositivo/${dispositivoId}`);
      // Filtrar apenas responsáveis
      return response.data.filter(
        (item: ResponsavelResponse) => item.tipo_acesso === "RESPONSAVEL"
      );
    } catch (error) {
      console.error("Erro ao listar responsáveis:", error);
      throw error;
    }
  }

  // Remover um responsável
  async removerResponsavel(usuarioDispositivoId: string): Promise<void> {
    try {
      await api.delete(`/usuario-dispositivo/${usuarioDispositivoId}`);
    } catch (error) {
      console.error("Erro ao remover responsável:", error);
      throw error;
    }
  }
}

export const responsavelService = new ResponsavelService();