import { api } from "./api";

interface AdicionarResponsavelDTO {
  nome: string;

  email: string;

  senha: string;

  dispositivo_id: string;
}

interface AtualizarResponsavelDTO {
  nome: string;

  email: string;

  senha?: string;
}

export interface ResponsavelResponse {
  id: string;

  usuario_id: string;

  dispositivo_id: string;

  tipo_acesso: string;

  criado_em: string;

  usuario?: {
    id: string;
    nome: string;
    email: string;
  };
}


export class ResponsavelService {
  /**
   * Adicionar responsável
   */
  async adicionarResponsavel(
    data: AdicionarResponsavelDTO,
  ): Promise<ResponsavelResponse> {
    try {
      const response = await api.post(
        "/usuario-dispositivo/responsavel",
        {
          nome: data.nome,
          email: data.email,
          senha: data.senha,
          dispositivo_id:
            data.dispositivo_id,
        },
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "Erro ao adicionar responsável:",
        error,
      );

      throw (
        error?.response?.data || error
      );
    }
  }

  /**
 * Atualizar responsável
 */
async atualizarResponsavel(
  usuarioId: string,
  data: AtualizarResponsavelDTO,
): Promise<ResponsavelResponse> {
  try {
    const response = await api.put(
      `/usuarios/${usuarioId}`,
      {
        nome: data.nome,

        email: data.email,

        senha: data.senha,
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Erro ao atualizar responsável:",
      error,
    );

    throw (
      error?.response?.data || error
    );
  }
}

  /**
   * Listar responsáveis por dispositivo
   */
  async listarResponsaveisPorDispositivo(
    dispositivoId: string,
  ): Promise<ResponsavelResponse[]> {
    try {
      const response = await api.get(
        `/usuario-dispositivo/dispositivo/${dispositivoId}`,
      );

      return response.data.filter(
        (item: ResponsavelResponse) =>
          item.tipo_acesso ===
          "RESPONSAVEL",
      );
    } catch (error: any) {
      console.error(
        "Erro ao listar responsáveis:",
        error,
      );

      throw (
        error?.response?.data || error
      );
    }
  }

  /**
   * Remover responsável
   */
  async removerResponsavel(
    usuarioDispositivoId: string,
  ): Promise<void> {
    try {
      await api.delete(
        `/usuario-dispositivo/${usuarioDispositivoId}`,
      );
    } catch (error: any) {
      console.error(
        "Erro ao remover responsável:",
        error,
      );

      throw (
        error?.response?.data || error
      );
    }
  }
}

export const responsavelService =
  new ResponsavelService();