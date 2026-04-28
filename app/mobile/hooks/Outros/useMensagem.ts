
import { useContext} from 'react';
import { MensagemContext } from '../../contexts/Mensagem/mensagemContext';

export const useMensagem = () => {
  const context = useContext(MensagemContext);
  if (!context) {
    throw new Error('useMessage deve ser usado dentro de um MessageProvider');
  }
  return context.showMessage;
};