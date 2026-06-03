import { Request, Response } from "express";
import { RetiradaMedicamentoService } from "../services/RetiradaMedicamentoService";
import { logger } from "../utils/logger";

const retiradaMedicamentoService = new RetiradaMedicamentoService();

export class RetiradaMedicamentoController {
  async recuperarAlertas(req: Request, res: Response) {
    try {
      const { usuarioId } = req.params;
      const alertas = await retiradaMedicamentoService.recuperarAlertas(
        String(usuarioId),
      );
      return res.status(200).json(alertas);
    } catch (error) {
      logger.error(
        `[RetiradaMedicamentoController] Erro ao recuperar alertas: ${String(error)}`,
      );
      return res.status(500).json({ erro: "Erro ao recuperar alertas." });
    }
  }

  async recuperarHistorico(req: Request, res: Response) {
    try {
      const { usuarioId } = req.params;
      const historico = await retiradaMedicamentoService.recuperarHistorico(
        String(usuarioId),
      );
      return res.status(200).json(historico);
    } catch (error) {
      logger.error(
        `[RetiradaMedicamentoController] Erro ao recuperar histórico: ${String(error)}`,
      );
      return res.status(500).json({ erro: "Erro ao recuperar histórico." });
    }
  }
}
