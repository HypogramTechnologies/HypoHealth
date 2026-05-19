import { Request, Response } from "express";

import { DispositivoService } from "../services/DispositivoService";

const dispositivoService = new DispositivoService();

export class DispositivoController {
  async getPrimeiro(req: Request, res: Response) {
    try {
      console.log(`[DispositivoController] GET /dispositivos/primeiro`);

      const dispositivo = await dispositivoService.getPrimeiro();

      if (!dispositivo) {
        return res.status(404).json({
          erro: "Nenhum dispositivo encontrado.",
        });
      }

      return res.status(200).json(dispositivo);
    } catch (error) {
      console.error(
        `[DispositivoController] ❌ Erro ao buscar dispositivo:`,
        error,
      );

      return res.status(500).json({
        erro: "Erro ao buscar dispositivo.",
      });
    }
  }
}

export const dispositivoController = new DispositivoController();
