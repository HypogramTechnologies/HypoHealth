import {
  useEffect,
  useState,
  useCallback,
} from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { responsavelService } from "../../services/responsavelService";

import { useAuth } from "../Auth/useAuth";

import {
  responsavelSchema,
  ResponsavelFormData,
} from "../../schemas/responsavel.schema";

import { Mode } from "@/mobile/types/Outros/mode";

import { ResponsavelDetalhado as Responsavel } from "@/mobile/types/Cadastros/responsavel";

interface UseResponsavelProps {
  mode?: Mode;

  responsavel?: Responsavel;
}

export function useResponsavel({
  mode = "create",

  responsavel,
}: UseResponsavelProps = {}) {
  const { usuario } = useAuth();

  const [responsaveis, setResponsaveis] =
    useState<Responsavel[]>([]);

  const [carregando, setCarregando] =
    useState(false);

  const [erro, setErro] =
    useState<string | null>(null);

  const [secure, setSecure] =
    useState(true);

  const [secureConfirm, setSecureConfirm] =
    useState(true);

  const {
    control,

    handleSubmit,

    reset,

    setValue,

    formState: { errors },
  } = useForm<ResponsavelFormData>({
    resolver: zodResolver(
      responsavelSchema,
    ),

    defaultValues: {
      nome: "",

      email: "",

      senha: "",

      confirmarSenha: "",
    },
  });

  useEffect(() => {
    if (
      mode === "edit" &&
      responsavel
    ) {
      setValue(
        "nome",
        responsavel.usuario?.nome ||
          "",
      );

      setValue(
        "email",
        responsavel.usuario?.email ||
          "",
      );
    }
  }, [
    mode,
    responsavel,
    setValue,
  ]);

  const buscarResponsaveis =
    useCallback(async () => {
      try {
        setCarregando(true);

        setErro(null);

        const dispositivoId =
          usuario?.dispositivos?.[0]
            ?.id;

        if (!dispositivoId) {
          throw new Error(
            "Nenhum dispositivo associado.",
          );
        }

        const dados =
          await responsavelService.listarResponsaveisPorDispositivo(
            dispositivoId,
          );

        setResponsaveis(
          dados as Responsavel[],
        );
      } catch (error: any) {
        setErro(
          error.message ||
            "Erro ao buscar responsáveis.",
        );
      } finally {
        setCarregando(false);
      }
    }, [usuario]);

  const create =
    useCallback(
      async (
        data: ResponsavelFormData,
      ) => {
        try {
          setCarregando(true);

          setErro(null);

          const dispositivoId =
            usuario
              ?.dispositivos?.[0]
              ?.id;

          if (!dispositivoId) {
            throw new Error(
              "Nenhum dispositivo associado.",
            );
          }

          const novoResponsavel =
            await responsavelService.adicionarResponsavel(
              {
                nome: data.nome,

                email:
                  data.email,

                senha:
                  data.senha,

                dispositivo_id:
                  dispositivoId,
              },
            );

          setResponsaveis(
            prev => [
              ...prev,
              novoResponsavel as Responsavel,
            ],
          );

          reset();

          return novoResponsavel;
        } catch (error: any) {
          setErro(
            error.message ||
              "Erro ao adicionar responsável.",
          );

          throw error;
        } finally {
          setCarregando(false);
        }
      },
      [usuario, reset],
    );

  const update =
    useCallback(
      async (
        id: string,

        data: ResponsavelFormData,
      ) => {
        try {
          setCarregando(true);

          setErro(null);

          const responsavelAtualizado =
            await responsavelService.atualizarResponsavel(
              id,
              {
                nome:
                  data.nome,

                email:
                  data.email,

                senha:
                  data.senha,
              },
            );

          setResponsaveis(
            prev =>
              prev.map(item =>
                item.id === id
                  ? (responsavelAtualizado as Responsavel)
                  : item,
              ),
          );

          return responsavelAtualizado;
        } catch (error: any) {
          setErro(
            error.message ||
              "Erro ao atualizar responsável.",
          );

          throw error;
        } finally {
          setCarregando(false);
        }
      },
      [],
    );

  const remove =
    useCallback(
      async (
        usuarioDispositivoId: string,
      ) => {
        try {
          setCarregando(true);

          setErro(null);

          await responsavelService.removerResponsavel(
            usuarioDispositivoId,
          );

          setResponsaveis(
            prev =>
              prev.filter(
                r =>
                  r.id !==
                  usuarioDispositivoId,
              ),
          );
        } catch (error: any) {
          setErro(
            error.message ||
              "Erro ao remover responsável.",
          );

          throw error;
        } finally {
          setCarregando(false);
        }
      },
      [],
    );

  const onSubmit =
    useCallback(
      async (
        data: ResponsavelFormData,
      ) => {
        try {
          if (
            mode === "edit" &&
            responsavel?.usuario?.id
          ) {
            await update(
              responsavel.usuario.id,
              data,
            );

            return true;
          }

          await create(data);

          return true;
        } catch {
          return false;
        }
      },
      [
        mode,
        responsavel,
        update,
        create,
      ],
    );

  const submit =
    useCallback(async () => {
      let success = false;

      await handleSubmit(
        async data => {
          success =
            await onSubmit(
              data,
            );
        },

        validationErrors => {
          console.log(
            "❌ Erro de Validação do Zod no Formulário:",
            validationErrors,
          );

          success = false;
        },
      )();

      return success;
    }, [
      handleSubmit,
      onSubmit,
    ]);

  return {
    responsaveis,

    carregando,

    erro,

    secure,

    setSecure,

    secureConfirm,

    setSecureConfirm,

    control,

    errors,

    buscarResponsaveis,

    removerResponsavel:
      remove,

    submit,
  };
}