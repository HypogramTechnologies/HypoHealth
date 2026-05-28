import { Request, Response } from "express";

import { AuthService } from "../services/AuthService";

import { UsuarioDispositivoService } from "../services/UsuarioDispositivoService";
import { logger } from "../utils/logger";

const authService = new AuthService();

const usuarioDispositivoService = new UsuarioDispositivoService();

export class AuthController {
  async cadastrar(req: Request, res: Response) {
    try {
      const resultado = await authService.cadastrar(req.body);

      // await usuarioDispositivoService.create({
      //   usuario_id: resultado.usuario.id,
      //   dispositivo_id: req.body.dispositivo_id,
      //   tipo_acesso: "PROPRIETARIO",
      // });

      return res.status(201).json(resultado);
    } catch (error: any) {
      logger.error(`[AuthController] Erro no cadastro: ${String(error)}`);

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

export const authController = new AuthController();
