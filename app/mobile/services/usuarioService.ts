import { api } from './api';

export interface Dispositivo {
  id: string;
  tipo_acesso: string;
  nome: string | null;
  numero_serie: string;
}

export interface Usuario {
  id: string;
  nome: string | null;
  email: string;
  criado_em: string;
  dispositivos?: Dispositivo[];
}

export interface CreateUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
}

export interface UpdateUsuarioDTO {
  nome?: string;
  email?: string;
  senha?: string;
}

const ENDPOINT = '/usuarios';

export const UsuarioService = {
  async getAll(): Promise<Usuario[]> {
    const response = await api.get<Usuario[]>(
      ENDPOINT
    );

    return response.data;
  },

  async getById(id: string): Promise<Usuario> {
    const response = await api.get<Usuario>(
      `${ENDPOINT}/${id}`
    );

    return response.data;
  },

  async create(
    dados: CreateUsuarioDTO
  ): Promise<Usuario> {
    const response = await api.post<Usuario>(
      ENDPOINT,
      dados
    );

    return response.data;
  },

  async update(
    id: string,
    dados: UpdateUsuarioDTO
  ): Promise<Usuario> {
    const response = await api.put<Usuario>(
      `${ENDPOINT}/${id}`,
      dados
    );

    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`);
  },
};