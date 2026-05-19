import { Request, Response } from "express";
import { MedicAgendamentoQueryService } from "../services/MedicAgendamentoQueryService";
import { logger } from "../utils/logger";

const medicAgendamentoQueryService = new MedicAgendamentoQueryService();

export class MedicAgendamentoQueryController {
  // GET todos os medicamentos com agendamentos
  async getAllMedicamentosComAgendamentos(req: Request, res: Response) {
    try {
      const medicamentos = await medicAgendamentoQueryService.getAllCompleto();

      return res.status(200).json(medicamentos);
    } catch (error) {
      logger.error(
        `[MedicAgendamentoQueryController] Erro ao buscar medicamentos completos: ${String(error)}`,
      );
      return res.status(500).json({
        erro: "Erro ao buscar medicamentos com agendamentos.",
      });
    }
  }

  // GET medicamento específico com agendamentos
  async getMedicamentoComAgendamentos(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };

      const medicamento =
        await medicAgendamentoQueryService.getByIdCompleto(id);

      if (!medicamento) {
        return res.status(404).json({
          erro: "Medicamento não encontrado.",
        });
      }

      return res.status(200).json(medicamento);
    } catch (error) {
      logger.error(
        `[MedicAgendamentoQueryController] Erro ao buscar medicamento completo: ${String(error)}`,
      );
      return res.status(500).json({
        erro: "Erro ao buscar medicamento com agendamentos.",
      });
    }
  }

  // GET todos os agendamentos com medicamentos e horários
  async getAllAgendamentosCompletos(req: Request, res: Response) {
    try {
      const agendamentos =
        await medicAgendamentoQueryService.getAllAgendamentosCompleto();

      return res.status(200).json(agendamentos);
    } catch (error) {
      logger.error(
        `[MedicAgendamentoQueryController] Erro ao buscar agendamentos completos: ${String(error)}`,
      );
      return res.status(500).json({
        erro: "Erro ao buscar agendamentos completos.",
      });
    }
  }

  // GET agendamento específico com medicamento e horários
  async getAgendamentoCompleto(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };

      const agendamento =
        await medicAgendamentoQueryService.getAgendamentoCompleto(id);

      if (!agendamento) {
        return res.status(404).json({
          erro: "Agendamento não encontrado.",
        });
      }

      return res.status(200).json(agendamento);
    } catch (error) {
      logger.error(
        `[MedicAgendamentoQueryController] Erro ao buscar agendamento completo: ${String(error)}`,
      );
      return res.status(500).json({
        erro: "Erro ao buscar agendamento completo.",
      });
    }
  }

  //GET buscar medicamentos do dia
  async getMedicamentosDoDia(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };

      const resultado =
        await medicAgendamentoQueryService.getMedicamentosDoDia(id);

      return res.status(200).json(resultado);
    } catch (error) {
      logger.error(
        `[MedicAgendamentoQueryController] Erro ao buscar medicamentos do dia: ${String(error)}`,
      );
      return res.status(500).json({
        erro: "Erro ao buscar medicamentos do dia.",
      });
    }
  }
}

export const medicAgendamentoQueryController =
  new MedicAgendamentoQueryController();
