import { Mode } from '../types/Outros/mode';

export type RootStackParamList = {
  Home: undefined;
  Tabs: undefined;

  Perfil: undefined;
  Medicamento: undefined;
  MedicamentoForm: {
    mode: Mode;
    medicamentoId?: string;
  };

  Responsavel: undefined;
  ResponsavelForm: {
    mode: Mode;
    responsavelId?: string;
  };

  Agendamento: undefined;
  AgendamentoForm: {
    mode: Mode;
    agendamentoId?: string;
  };
 
 
};
