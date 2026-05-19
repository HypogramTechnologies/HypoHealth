import { Request, Response } from "express";

import { UsuarioDispositivoService } from "../services/UsuarioDispositivoService";
import { logger } from "../utils/logger";

const usuarioDispositivoService = new UsuarioDispositivoService();

export class UsuarioDispositivoController {
  /**
   * POST /usuario-dispositivo
   * Criar vínculo genérico entre usuário e dispositivo
   */
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
    } catch (error: any) {
      logger.error(
        `[UsuarioDispositivoController] Erro ao criar vínculo: ${String(error)}`,
      );

      const statusCode = error.message?.includes("não encontrado") ? 404 : 400;
      return res.status(statusCode).json({
        erro: error.message || "Erro ao vincular usuário ao dispositivo.",
      });
    }
  }

  /**
   * POST /usuario-dispositivo/responsavel
   * Criar responsável (busca por email primeiro)
   */
  async createResponsavel(req: Request, res: Response) {
    try {
      const { usuario_id, dispositivo_id, email } = req.body;

      // Se vir com email, buscar usuário
      let usuarioFinal_id = usuario_id;

      if (email && !usuario_id) {
        const usuario =
          await usuarioDispositivoService.getUsuarioByEmail(email);
        usuarioFinal_id = usuario.id;
      }

      if (!usuarioFinal_id || !dispositivo_id) {
        return res.status(400).json({
          erro: "usuario_id (ou email) e dispositivo_id são obrigatórios.",
        });
      }

      const resultado = await usuarioDispositivoService.create({
        usuario_id: usuarioFinal_id,
        dispositivo_id,
        tipo_acesso: "RESPONSAVEL",
      });

      return res.status(201).json(resultado);
    } catch (error: any) {
      logger.error(
        `[UsuarioDispositivoController] Erro ao cadastrar responsável: ${String(error)}`,
      );

      const statusCode = error.message?.includes("não encontrado") ? 404 : 400;
      return res.status(statusCode).json({
        erro: error.message || "Erro ao cadastrar responsável.",
      });
    }
  }

  /**
   * GET /usuario-dispositivo/dispositivo/:dispositivo_id
   * Listar todos os usuários (proprietário e responsáveis) de um dispositivo
   */
  async getByDispositivo(req: Request, res: Response) {
    try {
      const dispositivoId = String(req.params.dispositivo_id);

      if (!dispositivoId) {
        return res.status(400).json({
          erro: "dispositivo_id é obrigatório.",
        });
      }

      const usuarios =
        await usuarioDispositivoService.getByDispositivo(dispositivoId);

      return res.status(200).json(usuarios);
    } catch (error: any) {
      logger.error(
        `[UsuarioDispositivoController] Erro ao buscar usuários por dispositivo: ${String(error)}`,
      );

      return res.status(400).json({
        erro: error.message || "Erro ao buscar usuários do dispositivo.",
      });
    }
  }

  /**
   * GET /usuario-dispositivo/usuario/:usuario_id
   * Listar todos os dispositivos vinculados a um usuário
   */
  async getByUsuario(req: Request, res: Response) {
    try {
      const usuarioId = String(req.params.usuario_id);

      if (!usuarioId) {
        return res.status(400).json({
          erro: "usuario_id é obrigatório.",
        });
      }

      const dispositivos =
        await usuarioDispositivoService.getByUsuario(usuarioId);

      return res.status(200).json(dispositivos);
    } catch (error: any) {
      logger.error(
        `[UsuarioDispositivoController] Erro ao buscar dispositivos por usuário: ${String(error)}`,
      );

      return res.status(400).json({
        erro: error.message || "Erro ao buscar dispositivos do usuário.",
      });
    }
  }

  /**
   * DELETE /usuario-dispositivo/:id
   * Remover vínculo entre usuário e dispositivo
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erro: "id é obrigatório.",
        });
      }

      await usuarioDispositivoService.delete(String(id));

      return res.status(204).send();
    } catch (error: any) {
      logger.error(
        `[UsuarioDispositivoController] Erro ao remover vínculo: ${String(error)}`,
      );

      const statusCode = error.message?.includes("não encontrado") ? 404 : 400;
      return res.status(statusCode).json({
        erro: error.message || "Erro ao remover vínculo.",
      });
    }
  }
}

export const usuarioDispositivoController = new UsuarioDispositivoController();
