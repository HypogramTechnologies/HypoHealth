export type HistoricoItem = {
  id: string;
  nome: string;
  dataHora: string;
  status: 'tomado' | 'nao_tomado';
  horaTomado?: string;
};