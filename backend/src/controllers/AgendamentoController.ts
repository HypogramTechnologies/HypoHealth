import { Request, Response } from "express";
import { AgendamentoService } from "../services/AgendamentoService";

const agendamentoService = new AgendamentoService();

export class AgendamentoController {
  async create(req: Request, res: Response) {
    try {
      const {
        medicamento_id,
        compartimento_id,
        tipo,
        data_inicio,
        horario,
        horarios,
      } = req.body;

      if (!medicamento_id || !compartimento_id || !tipo || !data_inicio) {
        return res.status(400).json({
          erro: "medicamento_id, compartimento_id, tipo e data_inicio são obrigatórios.",
        });
      }

      // Validar que ao menos um horário foi fornecido
      if (!horario && (!horarios || horarios.length === 0)) {
        return res.status(400).json({
          erro: "Forneça pelo menos um horário (horario ou horarios).",
        });
      }

      const novoAgendamento = await agendamentoService.create(req.body);
      return res.status(201).json(novoAgendamento);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao criar agendamento." });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const agendamentos = await agendamentoService.getAll();
      return res.status(200).json(agendamentos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao buscar agendamentos." });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const agendamento = await agendamentoService.getById(String(id));

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
      const agendamentoAtualizado = await agendamentoService.update(
        String(id),
        req.body,
      );
      return res.status(200).json(agendamentoAtualizado);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        erro: "Erro ao atualizar agendamento. Verifique se o ID existe.",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await agendamentoService.delete(String(id));
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao deletar agendamento." });
    }
  }
}

export const agendamentoController = new AgendamentoController();
