import { useEffect, useState } from 'react';

import { buscarProgramacao } from '../../services/programacaoService';

import { ProgramacaoItem } from '../../types/Cadastros/medicamento';
import { useAuth } from '../Auth/useAuth';

export function useProgramacao() {
  const [dados, setDados] = useState<ProgramacaoItem[]>(
    [],
  );

  const {
          usuario,
        } = useAuth();

  async function carregar() {
    try {
      if (!usuario?.id) return;
      const response = await buscarProgramacao(usuario.id);

      setDados(response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return {
    dados,
    recarregar: carregar,
  };
}