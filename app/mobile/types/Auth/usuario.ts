

export interface Dispositivo {
  id: string;
  tipo: string;
  nome: string | null;
  numero_serie: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  criado_em: string;
  dispositivos?: Dispositivo[];
  usuario_proprietario_id: string; //Proprietario sempre
  usuario_proprietario_nome: string; //Proprietario sempre
}
