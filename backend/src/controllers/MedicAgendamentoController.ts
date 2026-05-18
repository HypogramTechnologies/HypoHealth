import { Request, Response } from "express";
import prisma from "../database/db";
import { MedicamentoService } from "../services/MedicamentoService";
import { AgendamentoService } from "../services/AgendamentoService";

const medicService = new MedicamentoService();
const agendamentoService = new AgendamentoService();

export class MedicAgendamentoController {
  async createSimultaneo(req: Request, res: Response) {
    try {
      const {
        nome,
        dosagem,
        descricao,
        compartimento_id,
        tipo,
        data_inicio,
        data_fim,
        intervalo_horas,
        horario,
        horarios,
      } = req.body;

      if (!nome || !dosagem || !compartimento_id || !tipo || !data_inicio) {
        return res.status(400).json({ erro: "Campos obrigatórios faltando." });
      }

      // Validar que ao menos um horário foi fornecido
      if (!horario && (!horarios || horarios.length === 0)) {
        return res.status(400).json({
          erro: "Forneça pelo menos um horário (horario ou horarios).",
        });
      }

      const resultado = await prisma.$transaction(async (tx) => {
        const novoMedicamento = await medicService.create(
          { nome, dosagem, descricao },
          tx,
        );

        const novoAgendamento = await agendamentoService.create(
          {
            medicamento_id: novoMedicamento.id,
            compartimento_id,
            tipo,
            data_inicio,
            data_fim,
            intervalo_horas,
            horario,
            horarios,
          },
          tx,
        );

        return { medicamento: novoMedicamento, agendamento: novoAgendamento };
      });

      return res.status(201).json(resultado);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro na operação simultânea." });
    }
  }
}
