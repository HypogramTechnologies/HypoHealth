import { Request, Response } from "express";

import { UsuarioDispositivoService } from "../services/UsuarioDispositivoService";
import { logger } from "../utils/logger";

const usuarioDispositivoService = new UsuarioDispositivoService();

export class UsuarioDispositivoController {
  async create(req: Request, res: Response) {
    try {
      const { usuario_id, dispositivo_id, tipo_acesso } = req.body;

      if (!usuario_id || !dispositivo_id || !tipo_acesso) {
        return res.status(400).json({
          erro: "usuario_id, dispositivo_id e tipo_acesso são obrigatórios.",
        });
      }

      const resultado = await usuarioDispositivoService.create({
        usuario_id,
        dispositivo_id,
        tipo_acesso,
      });

      return res.status(201).json(resultado);
    } catch (error) {
      logger.error(
        `[UsuarioDispositivoController] Erro ao criar vínculo: ${String(error)}`,
      );

      return res.status(500).json({
        erro: "Erro ao vincular usuário ao dispositivo.",
      });
    }
  }

  async getByDispositivo(req: Request, res: Response) {
    try {
      const dispositivoId = String(req.params.dispositivoId);

      const usuarios =
        await usuarioDispositivoService.getByDispositivo(dispositivoId);

      return res.status(200).json(usuarios);
    } catch (error) {
      logger.error(
        `[UsuarioDispositivoController] Erro ao buscar usuários por dispositivo: ${String(error)}`,
      );

      return res.status(500).json({
        erro: "Erro ao buscar usuários do dispositivo.",
      });
    }
  }

  async getByUsuario(req: Request, res: Response) {
    try {
      const usuarioId = String(req.params.usuarioId);

      const dispositivos =
        await usuarioDispositivoService.getByUsuario(usuarioId);

      return res.status(200).json(dispositivos);
    } catch (error) {
      logger.error(
        `[UsuarioDispositivoController] Erro ao buscar dispositivos por usuário: ${String(error)}`,
      );

      return res.status(500).json({
        erro: "Erro ao buscar dispositivos do usuário.",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await usuarioDispositivoService.delete(String(id));

      return res.status(204).send();
    } catch (error) {
      logger.error(
        `[UsuarioDispositivoController] Erro ao remover vínculo: ${String(error)}`,
      );

      return res.status(500).json({
        erro: "Erro ao remover vínculo.",
      });
    }
  }

  async createResponsavel(req: Request, res: Response) {
    try {
      const { usuario_id, dispositivo_id } = req.body;

      if (!usuario_id || !dispositivo_id) {
        return res.status(400).json({
          erro: "usuario_id e dispositivo_id são obrigatórios.",
        });
      }

      const resultado = await usuarioDispositivoService.create({
        usuario_id,
        dispositivo_id,
        tipo_acesso: "RESPONSAVEL",
      });

      return res.status(201).json(resultado);
    } catch (error: any) {
      console.error(error);

      return res.status(400).json({
        erro: error.message || "Erro ao cadastrar responsável.",
      });
    }
  }
}

export const usuarioDispositivoController = new UsuarioDispositivoController();
