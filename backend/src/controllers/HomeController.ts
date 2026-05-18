import { Request, Response } from "express";
import { HomeService } from "../services/HomeService";

const homeService = new HomeService();

export class HomeController {
  async header(req: Request, res: Response) {
    try {
      const dados = await homeService.header();

      return res.status(200).json(dados);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        erro: "Erro ao buscar dados da home.",
      });
    }
  }
}

export const homeController = new HomeController();
