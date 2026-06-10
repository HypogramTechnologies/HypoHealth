import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { CompartimentoService } from "../../services/compartimentoService";

import { RetiradaMedicamentoService } from "../../services/retiradaMedicamentoService";

import {
  abastecimentoSchema,
  AbastecimentoFormData,
} from "../../schemas/abastecimento.schema";

import { Compartimento } from "../../types/Cadastros/compartimento";

import { useScreenMode } from "../Outros/useScreenMode";

import { useAuth } from "../Auth/useAuth";

export function useAbastecimentoForm() {
  const screen = useScreenMode("create");

  const { usuario } = useAuth();

  const { setLoading } = screen;

  const [compartimentosDisponiveis, setCompartimentosDisponiveis] = useState<
    Compartimento[]
  >([]);

  const form = useForm<AbastecimentoFormData>({
    resolver: zodResolver(abastecimentoSchema),

    defaultValues: {
      compartimento: undefined,
    },
  });

  const {
    control,
    handleSubmit,
    watch,

    formState: { errors },
  } = form;

  const compartimento = watch("compartimento");

  type SaveResult = {
    success: boolean;
    message: string;
  };

  const save = async (data: AbastecimentoFormData): Promise<SaveResult> => {
    setLoading(true);

    try {
      const numeroSerie = usuario?.dispositivos?.[0]?.numero_serie;

      if (!numeroSerie) {
        return {
          success: false,
          message: "Dispositivo não encontrado.",
        };
      }

      await RetiradaMedicamentoService.abastecerCompartimento({
        posicao: data.compartimento,
        numero_serie: numeroSerie,
      });

      return {
        success: true,
        message: "Compartimento aberto com sucesso!",
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Erro ao abrir compartimento",
      };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const carregarCompartimentos = async () => {
      try {
        const dispositivoId = usuario?.dispositivos?.[0]?.id;

        if (!dispositivoId) {
          return;
        }

        const dados =
          await CompartimentoService.getByDispositivo(dispositivoId);

        setCompartimentosDisponiveis(dados);
      } catch (error) {
        console.error("Erro ao carregar compartimentos:", error);
      }
    };

    carregarCompartimentos();
  }, [usuario]);

  return {
    control,

    handleSubmit,

    save,

    compartimento,

    compartimentosDisponiveis,

    errors,

    screen,
  };
}
