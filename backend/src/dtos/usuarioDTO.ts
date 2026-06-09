export interface CreateUsuarioDTO {
  nome: string;
  email: string;
  senha: string;

  dispositivo_id?: string;

  tipo_acesso?: "PROPRIETARIO" | "RESPONSAVEL";
}

export interface UpdateUsuarioDTO {
  nome?: string;
  email?: string;
  senha?: string;
}

export interface UsuarioResponseDTO {
  id: string;
  nome: string;
  email: string;
  criado_em: Date;
  dispositivos?: {
    id: string;
    tipo: string;
    nome: string | null;
    numero_serie: string;
  }[];
}
