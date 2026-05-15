import { Request, Response } from "express";
import prisma from "../database/db";

export class AgendamentoController {
  async create(req: Request, res: Response) {
    try {
      const {
        medicamento_id,
        compartimento_id,
        tipo,
        data_inicio,
        data_fim,
        intervalo_horas,
      } = req.body;

      // Validação dos campos obrigatórios
      if (!medicamento_id || !compartimento_id || !tipo || !data_inicio) {
        return res.status(400).json({
          erro: "medicamento_id, compartimento_id, tipo e data_inicio são obrigatórios.",
        });
      }

      const novoAgendamento = await prisma.agendamento.create({
        data: {
          medicamento_id,
          compartimento_id,
          tipo,
          data_inicio: new Date(data_inicio), // Convertendo para Date para garantir a tipagem do Prisma
          data_fim: data_fim ? new Date(data_fim) : null,
          intervalo_horas,
        },
      });

      return res.status(201).json(novoAgendamento);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao criar agendamento." });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const agendamentos = await prisma.agendamento.findMany({
        include: {
          medicamento: true,
          compartimento: true,
          horarios: true, // Traz os horários específicos vinculados a este agendamento
        },
      });
      return res.status(200).json(agendamentos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao buscar agendamentos." });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const agendamento = await prisma.agendamento.findUnique({
        where: { id: String(id) },
        include: {
          medicamento: true,
          compartimento: true,
          horarios: true,
        },
      });

      if (!agendamento) {
        return res.status(404).json({ erro: "Agendamento não encontrado." });
      }

      return res.status(200).json(agendamento);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao buscar agendamento." });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        medicamento_id,
        compartimento_id,
        tipo,
        data_inicio,
        data_fim,
        intervalo_horas,
      } = req.body;

      const agendamentoAtualizado = await prisma.agendamento.update({
        where: { id: String(id) },
        data: {
          medicamento_id,
          compartimento_id,
          tipo,
          // Atualiza as datas apenas se elas vierem no body da requisição
          ...(data_inicio && { data_inicio: new Date(data_inicio) }),
          ...(data_fim !== undefined && {
            data_fim: data_fim ? new Date(data_fim) : null,
          }),
          intervalo_horas,
        },
      });

      return res.status(200).json(agendamentoAtualizado);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        erro: "Erro ao atualizar agendamento. Verifique se o ID existe e se os IDs de relação são válidos.",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.agendamento.delete({
        where: { id: String(id) },
      });
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao deletar agendamento." });
    }
  }
}

export const agendamentoController = new AgendamentoController();
