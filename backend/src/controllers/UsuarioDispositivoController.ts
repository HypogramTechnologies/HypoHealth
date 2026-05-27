import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../database/db";
import { logger } from "../utils/logger";
import { salt } from "../utils/salt";

type CreateUsuarioDispositivoDTO = {
  usuario_id: string;
  dispositivo_id: string;
  tipo_acesso: "PROPRIETARIO" | "RESPONSAVEL";
};

// ==========================================
// SERVICE
// ==========================================
export class UsuarioDispositivoService {
  async create(dados: CreateUsuarioDispositivoDTO) {
    try {
      const usuarioExiste = await prisma.usuario.findUnique({
        where: { id: dados.usuario_id },
      });

      if (!usuarioExiste) {
        throw new Error("Usuário não encontrado.");
      }

      const dispositivoExiste = await prisma.dispositivo.findUnique({
        where: { id: dados.dispositivo_id },
      });

      if (!dispositivoExiste) {
        throw new Error("Dispositivo não encontrado.");
      }

      const vinculoExistente = await prisma.usuarioDispositivo.findUnique({
        where: {
          usuario_id_dispositivo_id: {
            usuario_id: dados.usuario_id,
            dispositivo_id: dados.dispositivo_id,
          },
        },
      });

      if (vinculoExistente) {
        throw new Error("Este usuário já está vinculado a este dispositivo.");
      }

      const resultado = await prisma.usuarioDispositivo.create({
        data: dados,
        include: {
          usuario: { select: { id: true, nome: true, email: true } },
          dispositivo: { select: { id: true, nome: true } },
        },
      });

      logger.info(
        `[UsuarioDispositivoService] Vínculo criado: ${dados.usuario_id} -> ${dados.dispositivo_id}`,
      );
      return resultado;
    } catch (error) {
      logger.error(
        `[UsuarioDispositivoService] Erro ao criar vínculo: ${String(error)}`,
      );
      throw error;
    }
  }

  async createResponsavelUsuario(dados: {
    email: string;
    senha: string;
    nome: string;
  }) {
    try {
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email: dados.email },
      });

      if (usuarioExistente) {
        throw new Error("Email já cadastrado");
      }

      const senhaHash = await bcrypt.hash(dados.senha, salt);

      const novoUsuario = await prisma.usuario.create({
        data: { nome: dados.nome, email: dados.email, senha: senhaHash },
        select: { id: true, nome: true, email: true },
      });

      logger.info(
        `[UsuarioDispositivoService] Novo responsável criado: ${novoUsuario.email}`,
      );
      return novoUsuario;
    } catch (error) {
      logger.error(
        `[UsuarioDispositivoService] Erro ao criar responsável: ${String(error)}`,
      );
      throw error;
    }
  }

  async getByDispositivo(dispositivo_id: string) {
    try {
      return await prisma.usuarioDispositivo.findMany({
        where: { dispositivo_id },
        include: {
          usuario: { select: { id: true, nome: true, email: true } },
          dispositivo: { select: { id: true, nome: true } },
        },
        orderBy: { criado_em: "desc" },
      });
    } catch (error) {
      logger.error(
        `[UsuarioDispositivoService] Erro ao buscar usuários do dispositivo ${dispositivo_id}: ${String(error)}`,
      );
      throw error;
    }
  }

  async getByUsuario(usuario_id: string) {
    try {
      return await prisma.usuarioDispositivo.findMany({
        where: { usuario_id },
        include: {
          dispositivo: { select: { id: true, nome: true, numero_serie: true } },
          usuario: { select: { id: true, nome: true } },
        },
        orderBy: { criado_em: "desc" },
      });
    } catch (error) {
      logger.error(
        `[UsuarioDispositivoService] Erro ao buscar dispositivos do usuário ${usuario_id}: ${String(error)}`,
      );
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const resultado = await prisma.usuarioDispositivo.delete({
        where: { id },
      });
      logger.info(`[UsuarioDispositivoService] Vínculo removido: ${id}`);
      return resultado;
    } catch (error) {
      logger.error(
        `[UsuarioDispositivoService] Erro ao remover vínculo ${id}: ${String(error)}`,
      );
      throw error;
    }
  }
}

const usuarioDispositivoService = new UsuarioDispositivoService();

// ==========================================
// CONTROLLER
// ==========================================
export class UsuarioDispositivoController {
  /**
   * POST /usuario-dispositivo
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
   */
  async createResponsavel(req: Request, res: Response) {
    try {
      const { usuario_id, dispositivo_id, email, senha, nome } = req.body;
      let usuarioFinal_id = usuario_id;

      if (email && !usuario_id) {
        const usuarioExistente = await prisma.usuario.findUnique({
          where: { email },
        });

        if (usuarioExistente) {
          usuarioFinal_id = usuarioExistente.id;
        } else {
          if (!senha || !nome) {
            return res.status(400).json({
              erro: "Para criar um novo responsável, email, senha e nome são obrigatórios.",
            });
          }

          const novoUsuario =
            await usuarioDispositivoService.createResponsavelUsuario({
              email,
              senha,
              nome,
            });
          usuarioFinal_id = novoUsuario.id;
        }
      }

      if (!usuarioFinal_id || !dispositivo_id) {
        return res.status(400).json({
          erro: "usuario_id (ou email+senha+nome) e dispositivo_id são obrigatórios.",
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
      return res
        .status(statusCode)
        .json({ erro: error.message || "Erro ao cadastrar responsável." });
    }
  }

  /**
   * GET /usuario-dispositivo/dispositivo/:dispositivo_id
   */
  async getByDispositivo(req: Request, res: Response) {
    try {
      const dispositivoId = String(req.params.dispositivo_id);
      if (!dispositivoId) {
        return res.status(400).json({ erro: "dispositivo_id é obrigatório." });
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
   */
  async getByUsuario(req: Request, res: Response) {
    try {
      const usuarioId = String(req.params.usuario_id);
      if (!usuarioId) {
        return res.status(400).json({ erro: "usuario_id é obrigatório." });
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
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ erro: "id é obrigatório." });
      }

      await usuarioDispositivoService.delete(String(id));
      return res.status(204).send();
    } catch (error: any) {
      logger.error(
        `[UsuarioDispositivoController] Erro ao remover vínculo: ${String(error)}`,
      );
      const statusCode = error.message?.includes("não encontrado") ? 404 : 400;
      return res
        .status(statusCode)
        .json({ erro: error.message || "Erro ao remover vínculo." });
    }
  }
}

export const usuarioDispositivoController = new UsuarioDispositivoController();
