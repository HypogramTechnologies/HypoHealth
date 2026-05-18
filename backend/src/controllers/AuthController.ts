import { Request, Response } from "express";

import { AuthService } from "../services/AuthService";

import { UsuarioDispositivoService } from "../services/UsuarioDispositivoService";

const authService = new AuthService();

const usuarioDispositivoService = new UsuarioDispositivoService();

export class AuthController {
  async cadastrar(req: Request, res: Response) {
    try {
      console.log("Iniciando cadastro de usuário...", req.body);

      const resultado = await authService.cadastrar(req.body);

      console.log("RESULTADO COMPLETO:", JSON.stringify(resultado, null, 2));

      console.log("Usuário cadastrado:", resultado);

      console.log("Vinculando usuário ao dispositivo...");

      await usuarioDispositivoService.create({
        usuario_id: resultado.usuario.id,
        dispositivo_id: req.body.dispositivo_id,
        tipo_acesso: "PROPRIETARIO",
      });

      console.log("Usuário vinculado com sucesso");

      return res.status(201).json(resultado);
    } catch (error: any) {
      console.error(error);

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
