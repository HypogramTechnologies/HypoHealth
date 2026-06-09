import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { useState } from "react";

import { DispositivoService } from "../../services/dispositivoService";

import { useMensagem } from "../Outros/useMensagem";

import { Dispositivo } from "../../types/Cadastros/dispositivo";
import {
  CadastroFormData,
  cadastroSchema,
} from "../../schemas/cadastro.schema";

import { useAuth } from "../Auth/useAuth";

export function useCadastroScreen() {
  const showMessage = useMensagem();

  const { login } = useAuth();

  const [etapa, setEtapa] = useState(1);

  const [dispositivo, setDispositivo] = useState<Dispositivo | null>(null);

  const [loading, setLoading] = useState(false);

  const {
    control,

    handleSubmit,

    getValues,

    trigger,

    formState: { errors },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),

    defaultValues: {
      nome: "",

      email: "",

      senha: "",

      confirmarSenha: "",

      numeroSerie: "",

      nomeDispositivo: "",
    },
  });

  async function validarDispositivo() {
    try {
      setLoading(true);

      const numeroSerie = getValues("numeroSerie").toUpperCase();

      const nomeDispositivo = getValues("nomeDispositivo");

      const valido = await trigger(["numeroSerie", "nomeDispositivo"]);

      if (!valido) {
        return false;
      }

      const existe = await DispositivoService.verificarMac(numeroSerie);

      if (existe.existe) {
        showMessage("Este número de série já está cadastrado", "error");

        return false;
      }

      setDispositivo({
        nome: nomeDispositivo,

        mac_address: numeroSerie,
      });

      setEtapa(2);

      showMessage("Dispositivo validado com sucesso", "success");

      return true;
    } catch (error: any) {
      console.error("Erro ao validar dispositivo:", error);

      const mensagem =
        error?.response?.data?.erro ??
        error?.message ??
        "Erro ao validar dispositivo";

      showMessage(mensagem, "error");

      return false;
    } finally {
      setLoading(false);
    }
  }

  async function cadastrar(data: CadastroFormData) {
    try {
      setLoading(true);

      if (data.confirmarSenha !== data.senha) {
        showMessage("As senhas não coincidem", "error");

        return false;
      }

      console.log("dispositivo", dispositivo);
      if (!dispositivo) {
        showMessage("Dispositivo inválido", "error");

        return false;
      }

      const dispositivoCriado = await DispositivoService.create({
        nome: dispositivo.nome,

        mac_address: dispositivo.mac_address,
      });

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_URL}:${process.env.EXPO_PUBLIC_PORT}/api/auth/cadastro`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            nome: data.nome,

            email: data.email,

            senha: data.senha,

            dispositivo_id: dispositivoCriado.id,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.erro);
      }

      login(result);

      showMessage("Cadastro realizado com sucesso", "success");

      return true;
    } catch (error: any) {
      console.error("Erro ao realizar cadastro:", error);

      const mensagem =
        error?.response?.data?.erro ??
        error?.message ??
        "Erro ao realizar cadastro";

      showMessage(mensagem, "error");

      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    control,

    handleSubmit,

    errors,

    etapa,

    setEtapa,

    validarDispositivo,

    cadastrar,

    dispositivo,

    loading,
  };
}
