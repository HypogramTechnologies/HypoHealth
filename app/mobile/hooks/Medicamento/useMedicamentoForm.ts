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

export function useMedicamentoForm(mode: Mode, medicamentoId?: string) {
  const screen = useScreenMode(mode);
  const { usuario } = useAuth();

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

      data_inicio: new Date(),
      data_fim: undefined,
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
      
      if (mode === "create") {
        const payload = {
          nome: data.medicamentoNome,

          dosagem: data.medicamentoDosagem,

          descricao: data.medicamentoDescricao,

          usuario_id: usuario?.usuario_proprietario_id,

          compartimento_ids: data.compartimentos,

          tipo: data.tipo,

          data_inicio: data.data_inicio.toISOString(),

          data_fim: data.data_fim?.toISOString(),

          intervalo_horas: data.intervalo_horas,

          horario: data.tipo === "INTERVALO" ? primeiroHorario : undefined,

          horarios: data.tipo === "HORARIO_FIXO" ? data.horarios : undefined,
        };

        await MedicamentoService.create(payload);
      } else if (medicamentoId) {
        const payload = {
          nome: data.medicamentoNome,

          dosagem: data.medicamentoDosagem,

          descricao: data.medicamentoDescricao,

          usuario_id: usuario?.usuario_proprietario_id,

          compartimento_ids: data.compartimentos,

          tipo: data.tipo,

          data_inicio: data.data_inicio.toISOString(),

          data_fim: data.data_fim?.toISOString(),

          intervalo_horas: data.intervalo_horas,

          horario: data.tipo === "INTERVALO" ? primeiroHorario : undefined,

          horarios: data.tipo === "HORARIO_FIXO" ? data.horarios : undefined,
        };

        await MedicamentoService.update(medicamentoId, payload);
      }

      return true;
    } catch {
      return false;
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

  useEffect(() => {
    const carregarMedicamento = async () => {
      if (!medicamentoId || isCreate) {
        return;
      }

      try {
        setLoading(true);

        const medicamento = await MedicamentoService.getById(medicamentoId);

        const resetData = {
          medicamentoNome: medicamento.nome,

          medicamentoDosagem: medicamento.dosagem,

          medicamentoDescricao: medicamento.descricao,

          compartimentos: medicamento.compartimento_ids
            ? [...medicamento.compartimento_ids]
            : [],

          tipo: medicamento.tipo,

          intervalo_horas: medicamento.intervalo_horas || 8,

          horarios: medicamento.horarios?.length
            ? medicamento.horarios
            : medicamento.horario
              ? [medicamento.horario]
              : ["08:00"],

          data_inicio: medicamento.data_inicio
            ? new Date(medicamento.data_inicio)
            : new Date(),

          data_fim: medicamento.data_fim
            ? new Date(medicamento.data_fim)
            : undefined,
        };

        reset(resetData);
      } catch (error) {
        console.error(
          `[useMedicamentoForm] Erro ao carregar medicamento: ${String(error)}`,
        );
      } finally {
        setLoading(false);
      }
    };

    carregarMedicamento();
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
