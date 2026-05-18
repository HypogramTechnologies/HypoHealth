import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react";

import {
  medicamentoSchema,
  MedicamentoFormData,
} from "../../schemas/medicamento.schema";

import { MedicamentoService } from "../../services/medicamentoService";

import { CompartimentoService } from "../../services/compartimentoService";

import { Compartimento } from "../../types/Cadastros/compartimento";

import { Mode } from "../../types/Outros/mode";

import { useScreenMode } from "../Outros/useScreenMode";

export function useMedicamentoForm(mode: Mode, medicamentoId?: string) {
  const screen = useScreenMode(mode);

  const { isCreate, setLoading } = screen;

  const [compartimentosDisponiveis, setCompartimentosDisponiveis] = useState<
    Compartimento[]
  >([]);

  const form = useForm<MedicamentoFormData>({
    resolver: zodResolver(medicamentoSchema),

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

  const compartimentos = watch("compartimentos");

  const intervalo = watch("intervalo_horas");

  const horarios = watch("horarios");

  const toggleCompartimento = (id: string | number) => {
    const compartimentoId = String(id);

    const lista = compartimentos || [];

    setValue(
      "compartimentos",

      lista.includes(compartimentoId)
        ? lista.filter((x) => x !== compartimentoId)
        : [...lista, compartimentoId],
    );
  };

  const addHorario = (horario = "08:00") => {
    setValue("horarios", [...horarios, horario]);
  };

  const removeHorario = (index: number) => {
    setValue(
      "horarios",

      horarios.filter((_, i) => i !== index),
    );
  };

  const updateHorario = (index: number, value: string) => {
    const novaLista = [...horarios];

    novaLista[index] = value;

    setValue("horarios", novaLista);
  };

  const gerarHorarios = (inicio = "08:00", h = 8) => {
    const [hora, min] = inicio.split(":").map(Number);

    const total = Math.floor(24 / h);

    const lista: string[] = [];

    for (let i = 0; i < total; i++) {
      const nova = (hora + i * h) % 24;

      lista.push(
        `${String(nova).padStart(2, "0")}:${String(min).padStart(2, "0")}`,
      );
    }

    setValue("horarios", lista);
  };

  useEffect(() => {
    if (tipo === "INTERVALO") {
      gerarHorarios(horarios[0] || "08:00", intervalo);
    }
  }, [tipo, intervalo]);

  const save = async (data: MedicamentoFormData) => {
    setLoading(true);

    try {
      const primeiroHorario = data.horarios[0];

      for (const compartimentoId of data.compartimentos) {
        await MedicamentoService.create({
          nome: data.medicamentoNome,

          dosagem: data.medicamentoDosagem,

          descricao: data.medicamentoDescricao,

          compartimento_id: compartimentoId,

          tipo: data.tipo,

          data_inicio: new Date().toISOString(),

          intervalo_horas: data.intervalo_horas,

          horario: data.tipo === "INTERVALO" ? primeiroHorario : undefined,

          horarios: data.tipo === "HORARIO_FIXO" ? data.horarios : undefined,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const carregarCompartimentos = async () => {
      try {
        const dispositivoId = "bf909bc1-4110-454d-9ef5-eb9eb49db4e7";

        const dados =
          await CompartimentoService.getByDispositivo(dispositivoId);
        console.log("COMPARTIMENTOS DISPONÍVEIS:", dados);
        setCompartimentosDisponiveis(dados);
      } catch (error) {
        console.error(error);
      }
    };

    carregarCompartimentos();
  }, []);

  useEffect(() => {
    if (!medicamentoId || isCreate) return;

    setLoading(true);

    MedicamentoService.getById(medicamentoId)
      .then(reset)
      .finally(() => setLoading(false));
  }, [medicamentoId, isCreate, reset, setLoading]);

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
