import { Mode } from '../types/Outros/mode';

export type RootStackParamList = {
  Home: undefined;
  Tabs: undefined;

  Perfil: undefined;
  Medicamento: undefined;
  Historico:undefined;
  Alerta:undefined;
  MedicamentoForm: {
    mode: Mode;
    medicamentoId?: string;
  };

  Responsavel: undefined;
  ResponsavelForm: {
  mode: "create" | "edit" | "view";
  responsavelId?: string;
  };

  Agendamento: undefined;
  AgendamentoForm: {
    mode: Mode;
    agendamentoId?: string;
  };
 
  
 
};
