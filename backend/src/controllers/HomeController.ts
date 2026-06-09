import { Request, Response } from "express";
import { HomeService } from "../services/HomeService";
import { logger } from "../utils/logger";

const homeService = new HomeService();

export class HomeController {
  async header(req: Request, res: Response) {
    try {
      const usuarioId = req.params.id as string;
      const dados = await homeService.header(usuarioId);

      return res.status(200).json(dados);
    } catch (error) {
      logger.error(
        `[HomeController] Erro ao buscar dados da home: ${String(error)}`,
      );

      return res.status(500).json({
        erro: "Erro ao buscar dados da home.",
      });
    }
  }
}

export const homeController = new HomeController();
