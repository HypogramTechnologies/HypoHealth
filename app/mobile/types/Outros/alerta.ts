export type AlertaItem = {
  id: string;
  titulo: string;
  descricao?: string;
  dataHora: string;
  tipo: 'erro' | 'aviso' | 'info';
};