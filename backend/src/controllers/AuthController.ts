import { Request, Response } from "express";

import { AuthService } from "../services/AuthService";

const authService = new AuthService();

export class AuthController {
    
  async cadastrar(req: Request, res: Response) {
    try {
      const resultado = await authService.cadastrar(req.body);

      return res.status(201).json(resultado);
    } catch (error: any) {
      return res.status(400).json({
        erro: error.message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const resultado = await authService.login(req.body);

      return res.status(200).json(resultado);
    } catch (error: any) {
      return res.status(401).json({
        erro: error.message,
      });
    }
  }
}