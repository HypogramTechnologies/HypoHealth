import { FilterFieldConfig } from '../../../components/Filtro/types';

export const FiltroMedicamento: FilterFieldConfig[] = [

  {
    key: 'medicamentoNome',
    label: 'Nome do medicamento',
    type: 'text',
    placeholder: 'Ex: Dipirona'
  },
  
  {
    key: 'medicamentoDescricao',
    label: 'Descrição',
    type: 'text',
    placeholder: 'Ex: Medicamento para dor, com três cores: azul, amarelo e branco, em formato oval.'

  },
  {
    key: 'medicamentoDosagem',
    label: 'Dosagem',
    type: 'text',
    placeholder: 'Ex: 500mg'
  },

  {
    key: 'medicamentoCriadoEmInicio',
    label: 'Data início',
    type: 'date',
    placeholder: 'Data inicial'
  },
  {
    key: 'medicamentoCriadoEmFim',
    label: 'Data fim',
    type: 'date',
    placeholder: 'Data final'
  },

];