import { useState } from "react";
import { responsavelService } from "../../services/responsavelService";
import { useAuth } from "../Auth/useAuth";

interface Responsavel {
  id: string;
  usuario_id: string;
  dispositivo_id: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
  };
  tipo_acesso: string;
  criado_em: string;
}

export function useResponsavel() {
  const { usuario } = useAuth();
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const buscarResponsaveis = async (dispositivoId: string) => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await responsavelService.listarResponsaveisPorDispositivo(
        dispositivoId
      );
      setResponsaveis(dados as Responsavel[]);
    } catch (error: any) {
      setErro(error.message || "Erro ao buscar responsáveis");
    } finally {
      setCarregando(false);
    }
  };

  const adicionarResponsavel = async (
    usuarioId: string,
    dispositivoId: string
  ) => {
    setCarregando(true);
    setErro(null);
    try {
      const novoResponsavel = await responsavelService.adicionarResponsavel(
        usuarioId,
        dispositivoId
      );
      setResponsaveis([...responsaveis, novoResponsavel as Responsavel]);
      return novoResponsavel;
    } catch (error: any) {
      setErro(error.message || "Erro ao adicionar responsável");
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  const removerResponsavel = async (usuarioDispositivoId: string) => {
    setCarregando(true);
    setErro(null);
    try {
      await responsavelService.removerResponsavel(usuarioDispositivoId);
      setResponsaveis(
        responsaveis.filter((r) => r.id !== usuarioDispositivoId)
      );
    } catch (error: any) {
      setErro(error.message || "Erro ao remover responsável");
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  return {
    responsaveis,
    carregando,
    erro,
    buscarResponsaveis,
    adicionarResponsavel,
    removerResponsavel,
  };
}