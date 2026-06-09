import { FilterFieldConfig } from '../../../components/Filtro/types';
import { comboOptions } from '../../../types/Outros/comboOptions';
export const FiltroMedicamento: FilterFieldConfig[] =
  [

    {
      key: 'medicamentoDescricao',

      label: 'Descrição',

      type: 'text',

      placeholder:
        'Ex: Branco, oval, para dor',

      icon: 'message-bulleted',
    },

    {
      key: 'medicamentoDosagem',

      label: 'Dosagem',

      type: 'text',

      placeholder: 'Ex: 500mg',

      icon: 'flask-outline',
    },

    {
      key: 'data_inicio',

      label: 'Início do tratamento',

      type: 'date',

      icon: 'calendar-start',
    },

    {
      key: 'data_fim',

      label: 'Fim do tratamento',

      type: 'date',

      icon: 'calendar-end',
    },

       {
      key: 'criado_em_inicio',

      label: 'Criado a partir de',

      type: 'date',

      icon: 'calendar-outline',
    },

    {
      key: 'criado_em_fim',

      label: 'Criado até',

      type: 'date',

      icon: 'calendar-outline',
    },
    
    {
      key: 'tipo',

      label: 'Tipo de uso',

      type: 'combo',

      placeholder:
        'Selecione o tipo',

      source: 'tipoMedicamento',
      
      
    },

    {
      key: 'status',

      label: 'Status',

      type: 'combo',

      placeholder:
        'Selecione o status',

      source: 'statusMedicamento',
    },
 


  
  ];