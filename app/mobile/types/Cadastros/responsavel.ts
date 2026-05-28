
export interface ResponsavelDetalhado {
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

export interface ResponsavelFiltro{
  email?: string;
  nome?: string;
}