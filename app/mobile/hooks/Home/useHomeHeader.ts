import { useState, useCallback } from "react";

import {
  useFocusEffect,
} from "@react-navigation/native";

import { buscarHomeHeader } from "../../services/homeService";

export function useHomeHeader() {

  const [dados, setDados] =
    useState<any>(null);

  async function carregar() {
    try {

      const response =
        await buscarHomeHeader();

      setDados(response);

    } catch (error) {
      console.log(error);
    }
  }

  useFocusEffect(
    useCallback(() => {

      carregar();

    }, []),
  );

  return {
    dados,
    recarregar: carregar,
  };
}