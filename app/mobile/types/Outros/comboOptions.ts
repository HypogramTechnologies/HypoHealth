// import { useDispositivoCombo } from '../../../mobile/hooks/Dispositivo/useDispositivoCombo';
// import { useMedicamentoCombo } from '../../../mobile/hooks/Medicamento/useMedicamentoCombo';
// import { useCompartimentoCombo } from '../../../mobile/hooks/Compartimento/useCompartimentoCombo';
import { useStatusMedicamentoCombo } from '../../../mobile/hooks/Medicamento/useStatusMedicamentoCombo';
import { useTipoMedicamentoCombo } from '../../../mobile/hooks/Medicamento/useTipoMedicamentoCombo';

export const comboOptions = {

  
  statusMedicamento: useStatusMedicamentoCombo,

  tipoMedicamento: useTipoMedicamentoCombo,
  // dispositivos: useDispositivoCombo,
  // medicamentos: useMedicamentoCombo,
  // compartimentos: useCompartimentoCombo,

};

export type ComboSource = keyof typeof comboOptions;