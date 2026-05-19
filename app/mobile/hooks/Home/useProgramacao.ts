import { useEffect, useState } from 'react';

import { buscarProgramacao } from '../../services/programacaoService';

import { ProgramacaoItem } from '../../types/Cadastros/medicamento';

export function useProgramacao() {
  const [dados, setDados] = useState<ProgramacaoItem[]>(
    [],
  );

  async function carregar() {
    try {
      const response = await buscarProgramacao();

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