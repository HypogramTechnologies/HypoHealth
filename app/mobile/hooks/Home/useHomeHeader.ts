import { useEffect, useState } from "react";

import { buscarHomeHeader } from "../../services/homeService";

export function useHomeHeader() {
  const [dados, setDados] = useState<any>(null);

  async function carregar() {
    try {
      const response = await buscarHomeHeader();

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