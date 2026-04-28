import { useDispositivoCombo } from '../../../mobile/hooks/Dispositivo/useDispositivoCombo';
import { useMedicamentoCombo } from '../../../mobile/hooks/Medicamento/useMedicamentoCombo';
import { useCompartimentoCombo } from '../../../mobile/hooks/Compartimento/useCompartimentoCombo';

export const comboOptions = {
  dispositivos: useDispositivoCombo,
  medicamentos: useMedicamentoCombo,
  compartimentos: useCompartimentoCombo,

};

export type ComboSource = keyof typeof comboOptions;