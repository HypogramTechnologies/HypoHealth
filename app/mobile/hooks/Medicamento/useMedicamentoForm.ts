import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react";

import {
  medicamentoSchema,
  MedicamentoFormData,
} from "../../schemas/medicamento.schema";

import { MedicamentoService } from "../../services/medicamentoAgendamentoService";

import { CompartimentoService } from "../../services/compartimentoService";

import { Compartimento } from "../../types/Cadastros/compartimento";

import { Mode } from "../../types/Outros/mode";

import { useScreenMode } from "../Outros/useScreenMode";

import { useAuth } from "../Auth/useAuth";

export function useMedicamentoForm(
  mode: Mode,
  medicamentoId?: string,
) {
  console.log(
    "HOOK useMedicamentoForm INICIADO",
  );

  console.log("MODE:", mode);

  console.log(
    "MEDICAMENTO ID:",
    medicamentoId,
  );

  const screen = useScreenMode(mode);

  const { usuario } = useAuth();

  console.log("USUARIO:", usuario);

  const {
    isCreate,
    setLoading,
  } = screen;

  const [
    compartimentosDisponiveis,
    setCompartimentosDisponiveis,
  ] = useState<Compartimento[]>([]);

  const form =
    useForm<MedicamentoFormData>({
      resolver: zodResolver(
        medicamentoSchema,
      ),

      defaultValues: {
        medicamentoNome: "",

        medicamentoDosagem: "",

        medicamentoDescricao: "",

        compartimentos: [],

        tipo: "HORARIO_FIXO",

        intervalo_horas: 8,

        horarios: ["08:00"],
      },
    });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,

    formState: { errors },
  } = form;

  const tipo = watch("tipo");

  const compartimentos =
    watch("compartimentos");

  const intervalo = watch(
    "intervalo_horas",
  );

  const horarios = watch("horarios");

  console.log("TIPO:", tipo);

  console.log(
    "COMPARTIMENTOS:",
    compartimentos,
  );

  console.log("HORARIOS:", horarios);

  const toggleCompartimento = (
    id: string | number,
  ) => {
    console.log(
      "TOGGLE COMPARTIMENTO:",
      id,
    );

    const compartimentoId =
      String(id);

    const lista =
      compartimentos || [];

    setValue(
      "compartimentos",

      lista.includes(
        compartimentoId,
      )
        ? lista.filter(
            x =>
              x !==
              compartimentoId,
          )
        : [
            ...lista,
            compartimentoId,
          ],
    );
  };

  const addHorario = (
    horario = "08:00",
  ) => {
    console.log(
      "ADICIONANDO HORARIO:",
      horario,
    );

    setValue("horarios", [
      ...horarios,
      horario,
    ]);
  };

  const removeHorario = (
    index: number,
  ) => {
    console.log(
      "REMOVENDO HORARIO:",
      index,
    );

    setValue(
      "horarios",

      horarios.filter(
        (_, i) => i !== index,
      ),
    );
  };

  const updateHorario = (
    index: number,
    value: string,
  ) => {
    console.log(
      "ATUALIZANDO HORARIO:",
      {
        index,
        value,
      },
    );

    const novaLista = [...horarios];

    novaLista[index] = value;

    setValue(
      "horarios",
      novaLista,
    );
  };

  const gerarHorarios = (
    inicio = "08:00",
    h = 8,
  ) => {
    console.log(
      "GERANDO HORARIOS:",
      {
        inicio,
        h,
      },
    );

    const [hora, min] = inicio
      .split(":")
      .map(Number);

    const total = Math.floor(
      24 / h,
    );

    const lista: string[] = [];

    for (
      let i = 0;
      i < total;
      i++
    ) {
      const nova =
        (hora + i * h) % 24;

      lista.push(
        `${String(nova).padStart(2, "0")}:${String(min).padStart(2, "0")}`,
      );
    }

    console.log(
      "HORARIOS GERADOS:",
      lista,
    );

    setValue("horarios", lista);
  };

  useEffect(() => {
    console.log(
      "EFFECT TIPO/INTERVALO",
    );

    if (tipo === "INTERVALO") {
      gerarHorarios(
        horarios[0] || "08:00",
        intervalo,
      );
    }
  }, [tipo, intervalo]);

  const save = async (
  data: MedicamentoFormData,
) => {
  setLoading(true);

  try {
    const primeiroHorario =
      data.horarios[0];

    if (mode === "create") {
      for (const compartimentoId of data.compartimentos) {

        const payload = {
          nome:
            data.medicamentoNome,

          dosagem:
            data.medicamentoDosagem,

          descricao:
            data.medicamentoDescricao,

          compartimento_id:
            compartimentoId,

          tipo: data.tipo,

          data_inicio:
            new Date().toISOString(),

          intervalo_horas:
            data.intervalo_horas,

          horario:
            data.tipo ===
            "INTERVALO"
              ? primeiroHorario
              : undefined,

          horarios:
            data.tipo ===
            "HORARIO_FIXO"
              ? data.horarios
              : undefined,
        };

        console.log(
          "BODY POST:",
          payload,
        );

        await MedicamentoService.create(
          payload,
        );
      }
    } else if (medicamentoId) {

      const payload = {
        nome:
          data.medicamentoNome,

        dosagem:
          data.medicamentoDosagem,

        descricao:
          data.medicamentoDescricao,

        tipo: data.tipo,

        intervalo_horas:
          data.intervalo_horas,

        horario:
          data.tipo ===
          "INTERVALO"
            ? primeiroHorario
            : undefined,

        horarios:
          data.tipo ===
          "HORARIO_FIXO"
            ? data.horarios
            : undefined,
      };

      console.log(
        "BODY UPDATE:",
        payload,
      );

      await MedicamentoService.update(
        medicamentoId,
        payload,
      );
    }

    return true;
  } catch {
    return false;
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const carregarCompartimentos =
      async () => {
        try {
          console.log(
            "CARREGANDO COMPARTIMENTOS",
          );

          const dispositivoId =
            usuario?.dispositivos?.[0]
              ?.id;

          console.log(
            "DISPOSITIVO ID:",
            dispositivoId,
          );

          if (!dispositivoId) {
            console.log(
              "DISPOSITIVO ID NÃO ENCONTRADO",
            );

            return;
          }

          const dados =
            await CompartimentoService.getByDispositivo(
              dispositivoId,
            );

          console.log(
            "COMPARTIMENTOS RECEBIDOS:",
            dados,
          );

          setCompartimentosDisponiveis(
            dados,
          );
        } catch (error) {
          console.log(
            "ERRO AO CARREGAR COMPARTIMENTOS:",
            error,
          );
        }
      };

    carregarCompartimentos();
  }, [usuario]);

  useEffect(() => {
    const carregarMedicamento =
      async () => {
        console.log(
          "INICIANDO CARREGAMENTO MEDICAMENTO",
        );

        console.log(
          "IS CREATE:",
          isCreate,
        );

        console.log(
          "MEDICAMENTO ID:",
          medicamentoId,
        );

        if (
          !medicamentoId ||
          isCreate
        ) {
          console.log(
            "NÃO VAI CARREGAR MEDICAMENTO",
          );

          return;
        }

        try {
          setLoading(true);

          console.log(
            "BUSCANDO MEDICAMENTO...",
          );

          const medicamento =
            await MedicamentoService.getById(
              medicamentoId,
            );

          console.log(
            "MEDICAMENTO RECEBIDO:",
            medicamento,
          );

          const resetData = {
            medicamentoNome:
              medicamento.nome,

            medicamentoDosagem:
              medicamento.dosagem,

            medicamentoDescricao:
              medicamento.descricao,

            compartimentos:
              medicamento.compartimento_id
                ? [
                    medicamento.compartimento_id,
                  ]
                : [],

            tipo: medicamento.tipo,

            intervalo_horas:
              medicamento.intervalo_horas ||
              8,

            horarios:
              medicamento.horarios
                ?.length
                ? medicamento.horarios
                : medicamento.horario
                  ? [
                      medicamento.horario,
                    ]
                  : ["08:00"],
          };

          console.log(
            "RESET DATA:",
            resetData,
          );

          reset(resetData);

          console.log(
            "FORM RESETADO",
          );
        } catch (error) {
          console.log(
            "ERRO AO CARREGAR MEDICAMENTO:",
            error,
          );
        } finally {
          console.log(
            "FINALIZANDO LOADING GET",
          );

          setLoading(false);
        }
      };

    carregarMedicamento();
  }, [
    medicamentoId,
    isCreate,
    reset,
    setLoading,
  ]);

  return {
    control,

    handleSubmit,

    save,

    tipo,

    intervalo,

    compartimentos,

    compartimentosDisponiveis,

    horarios,

    addHorario,

    removeHorario,

    updateHorario,

    setValue,

    toggleCompartimento,

    errors,

    screen,
  };
}