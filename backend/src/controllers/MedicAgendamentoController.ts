import { Request, Response } from "express";
import prisma from "../database/db";

import { MedicamentoService } from "../services/MedicamentoService";
import { AgendamentoService } from "../services/AgendamentoService";

import { logger } from "../utils/logger";

const medicService = new MedicamentoService();
const agendamentoService = new AgendamentoService();

export class MedicAgendamentoController {
  async createSimultaneo(req: Request, res: Response) {
    try {
      const {
        nome,
        dosagem,
        descricao,

        compartimento_ids,

        tipo,

        data_inicio,
        data_fim,

        intervalo_horas,

        horario,
        horarios,
      } = req.body;

      // CAMPOS OBRIGATÓRIOS
      if (!nome || !dosagem || !compartimento_ids || !tipo || !data_inicio) {
        return res.status(400).json({
          erro: "Campos obrigatórios faltando.",
        });
      }

      // VALIDAÇÃO PARA HORARIO_FIXO
      if (tipo === "HORARIO_FIXO") {
        if (!horarios || horarios.length === 0) {
          return res.status(400).json({
            erro: "HORARIO_FIXO exige 'horarios'.",
          });
        }
      }

      // VALIDAÇÃO PARA INTERVALO
      if (tipo === "INTERVALO") {
        if (!horario) {
          return res.status(400).json({
            erro: "INTERVALO exige 'horario'.",
          });
        }

        if (!intervalo_horas) {
          return res.status(400).json({
            erro: "INTERVALO exige 'intervalo_horas'.",
          });
        }
      }

      const resultado = await prisma.$transaction(async (tx) => {
        // 1 - CRIAR MEDICAMENTO
        const novoMedicamento = await medicService.create(
          {
            nome,
            dosagem,
            descricao,
          },
          tx,
        );

        // 2 - CRIAR AGENDAMENTO
        const novoAgendamento = await agendamentoService.create(
          {
            medicamento_id: novoMedicamento.id,

            compartimento_ids,

            tipo,

            data_inicio,
            data_fim,

            intervalo_horas,

            horario,
            horarios,
          },
          tx,
        );

        return {
          medicamento: novoMedicamento,
          agendamento: novoAgendamento,
        };
      });

      return res.status(201).json(resultado);
    } catch (error) {
      logger.error(`[MedicAgendamentoController] ${String(error)}`);

      return res.status(500).json({
        erro: "Erro na operação simultânea.",
      });
    }
  }
}
