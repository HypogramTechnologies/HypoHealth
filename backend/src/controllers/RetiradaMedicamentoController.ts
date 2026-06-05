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

  async reabrirCompartimento(req: Request, res: Response) {
    try {
      const { retiradaId } = req.params;
      const retirada = await retiradaMedicamentoService.reabrirCompartimento(
        String(retiradaId),
      );

      return res.status(200).json(retirada);
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Erro ao reabrir compartimento.";

      logger.error(
        `[RetiradaMedicamentoController] Erro ao reabrir compartimento: ${String(error)}`,
      );
      return res.status(400).json({ erro: mensagem });
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
