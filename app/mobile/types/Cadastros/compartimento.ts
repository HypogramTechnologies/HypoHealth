// export interface Compartimento {
//   compartimentoId: string;
//   dispositivoId: string;
//   compartimentoPosicao: number;
//   compartimentoDescricao?: string;
// }


export type Compartimento = {
  id: string;

  posicao: number;

  dia_semana:
    | 'DOMINGO'
    | 'SEGUNDA'
    | 'TERCA'
    | 'QUARTA'
    | 'QUINTA'
    | 'SEXTA'
    | 'SABADO';

  descricao?: string;
};