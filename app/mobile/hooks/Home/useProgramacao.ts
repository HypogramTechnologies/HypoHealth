import {
  useState,
  useCallback,
} from "react";

import {
  useFocusEffect,
} from "@react-navigation/native";

import { buscarProgramacao }
  from "../../services/programacaoService";

import { ProgramacaoItem }
  from "../../types/Cadastros/medicamento";

import { useAuth }
  from "../Auth/useAuth";

export function useProgramacao() {

  const [dados, setDados] =
    useState<ProgramacaoItem[]>([]);

  const { usuario } =
    useAuth();

  async function carregar() {

    try {

      if (!usuario?.usuario_proprietario_id) return;
    
      const response =
        await buscarProgramacao(
          usuario.usuario_proprietario_id,
        );

      console.log('Programação carregada:', response);
      setDados(response);

    } catch (error) {

      console.log(error);
    }
  }

  useFocusEffect(
    useCallback(() => {

      carregar();

    }, [usuario?.id]),
  );

  return {
    dados,
    recarregar: carregar,
  };
}