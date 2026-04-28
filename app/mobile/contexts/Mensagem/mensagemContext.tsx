import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Mensagem } from '../../components/Feedback/Mensagem';
import {MessageType} from '../../types/Outros/messageType';

interface MensagemData {
  text: string;
  type: MessageType;
}

interface MensagemContextType {
  showMessage: (text: string, type?: MessageType, duration?: number) => void;
}


export const MensagemContext = createContext<MensagemContextType | undefined>(undefined);

export const MensagemProvider = ({ children }: { children: ReactNode }) => {
  const [mensagem, setMensagem] = useState<MensagemData | null>(null);

  const limparMensagem = useCallback(() => setMensagem(null), []);

  const showMessage = useCallback((
    text: string, 
    type: MessageType = 'success', 
    duration = 3000
  ) => {
    setMensagem({ text, type });
    
    setTimeout(() => {
      limparMensagem();
    }, duration);
  }, [limparMensagem]);

  return (
    <MensagemContext.Provider value={{ showMessage }}>
      {children}
      {mensagem && (
        <Mensagem 
          text={mensagem.text} 
          type={mensagem.type} 
          onClose={limparMensagem} 
        />
      )}
    </MensagemContext.Provider>
  );
};