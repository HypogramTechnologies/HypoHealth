import { Request, Response } from "express";

import { CompartimentoService } from "../services/CompartimentoService";
import { logger } from "../utils/logger";

const compartimentoService = new CompartimentoService();

export class CompartimentoController {
  async getByDispositivo(req: Request, res: Response) {
    try {
      const { dispositivoId } = req.params as {
        dispositivoId: string;
      };

      if (!dispositivoId) {
        return res.status(400).json({
          erro: "dispositivoId é obrigatório.",
        });
      }

      const compartimentos =
        await compartimentoService.getByDispositivo(dispositivoId);

      return res.status(200).json(compartimentos);
    } catch (error) {
      logger.error(
        `[CompartimentoController] Erro ao buscar compartimentos por dispositivo: ${String(error)}`,
      );

      return res.status(500).json({
        erro: "Erro ao buscar compartimentos.",
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params as {
        id: string;
      };

      const compartimento = await compartimentoService.getById(id);

      if (!compartimento) {
        return res.status(404).json({
          erro: "Compartimento não encontrado.",
        });
      }

      return res.status(200).json(compartimento);
    } catch (error) {
      logger.error(
        `[CompartimentoController] Erro ao buscar compartimento por id: ${String(error)}`,
      );

      return res.status(500).json({
        erro: "Erro ao buscar compartimento.",
      });
    }
  }
}

export const compartimentoController = new CompartimentoController();
