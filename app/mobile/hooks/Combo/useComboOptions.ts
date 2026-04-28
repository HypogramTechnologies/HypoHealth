import { ComboSource } from '../../types/Outros/comboOptions';

import { comboConfig } from './comboConfig';
import { comboAdapter } from './comboAdapter';

export function useComboOptions(source?: ComboSource) {

  const config = source ? comboConfig[source] : undefined;
  
  if (!config) {
    return { options: [], loading: false };
  }

  const result = config.hook();

  return comboAdapter(result, {
    optionsKey: config.optionsKey,
  });
}