import { useState, useCallback } from "react";

import {
  useFocusEffect,
} from "@react-navigation/native";

import { buscarHomeHeader } from "../../services/homeService";

type HomeHeaderData = {
  dataAtual: string;
  totalMedicamentosHoje: number;
  totalTomadosHoje: number;
};

export function useHomeHeader(
  usuarioId: string,
) {
  const [dados, setDados] =
    useState<HomeHeaderData | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  async function carregar() {
    try {
      if (!usuarioId) {
        return;
      }

      setLoading(true);

      const response =
        await buscarHomeHeader(
          usuarioId,
        );

      setDados(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [usuarioId]),
  );

  return {
    dados,
    loading,
    recarregar: carregar,
  };
}