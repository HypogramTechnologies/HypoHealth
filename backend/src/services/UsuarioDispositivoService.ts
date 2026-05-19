import prisma from "../database/db";
import { logger } from "../utils/logger";

type CreateUsuarioDispositivoDTO = {
  usuario_id: string;
  dispositivo_id: string;
  tipo_acesso: "PROPRIETARIO" | "RESPONSAVEL";
};

export class UsuarioDispositivoService {
  /**
   * Criar vínculo entre usuário e dispositivo
   */
  async create(dados: CreateUsuarioDispositivoDTO) {
    try {
      // Validar se usuário existe
      const usuarioExiste = await prisma.usuario.findUnique({
        where: { id: dados.usuario_id },
      });

      if (!usuarioExiste) {
        throw new Error("Usuário não encontrado.");
      }

      // Validar se dispositivo existe
      const dispositivoExiste = await prisma.dispositivo.findUnique({
        where: { id: dados.dispositivo_id },
      });

      if (!dispositivoExiste) {
        throw new Error("Dispositivo não encontrado.");
      }

      // Verificar se já não existe vínculo
      const vinculoExistente = await prisma.usuarioDispositivo.findUnique({
        where: {
          usuario_id_dispositivo_id: {
            usuario_id: dados.usuario_id,
            dispositivo_id: dados.dispositivo_id,
          },
        },
      });

      if (vinculoExistente) {
        throw new Error(
          "Este usuário já está vinculado a este dispositivo."
        );
      }

      const resultado = await prisma.usuarioDispositivo.create({
        data: dados,
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
          dispositivo: {
            select: {
              id: true,
              nome: true,
            },
          },
        },
      });

      logger.info(
        `[UsuarioDispositivoService] Vínculo criado: ${dados.usuario_id} -> ${dados.dispositivo_id}`
      );

      return resultado;
    } catch (error) {
      logger.error(
        `[UsuarioDispositivoService] Erro ao criar vínculo: ${String(error)}`
      );
      throw error;
    }
  }

  /**
   * ⭐ NOVO: Buscar usuário por email
   */
  async getUsuarioByEmail(email: string) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { email },
        select: {
          id: true,
          nome: true,
          email: true,
        },
      });

      if (!usuario) {
        throw new Error("Usuário não encontrado com este email.");
      }

      return usuario;
    } catch (error) {
      logger.error(
        `[UsuarioDispositivoService] Erro ao buscar usuário por email: ${String(error)}`
      );
      throw error;
    }
  }

  /**
   * Listar todos os usuários vinculados a um dispositivo
   */
  async getByDispositivo(dispositivo_id: string) {
    try {
      const usuarios = await prisma.usuarioDispositivo.findMany({
        where: {
          dispositivo_id,
        },
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
          dispositivo: {
            select: {
              id: true,
              nome: true,
            },
          },
        },
        orderBy: {
          criado_em: "desc",
        },
      });

      return usuarios;
    } catch (error) {
      logger.error(
        `[UsuarioDispositivoService] Erro ao buscar usuários do dispositivo ${dispositivo_id}: ${String(error)}`
      );
      throw error;
    }
  }

  /**
   * Listar todos os dispositivos vinculados a um usuário
   */
  async getByUsuario(usuario_id: string) {
    try {
      const dispositivos = await prisma.usuarioDispositivo.findMany({
        where: {
          usuario_id,
        },
        include: {
          dispositivo: {
            select: {
              id: true,
              nome: true,
              numero_serie: true,
            },
          },
          usuario: {
            select: {
              id: true,
              nome: true,
            },
          },
        },
        orderBy: {
          criado_em: "desc",
        },
      });

      return dispositivos;
    } catch (error) {
      logger.error(
        `[UsuarioDispositivoService] Erro ao buscar dispositivos do usuário ${usuario_id}: ${String(error)}`
      );
      throw error;
    }
  }

  /**
   * Remover vínculo entre usuário e dispositivo
   */
  async delete(id: string) {
    try {
      const resultado = await prisma.usuarioDispositivo.delete({
        where: { id },
      });

      logger.info(
        `[UsuarioDispositivoService] Vínculo removido: ${id}`
      );

      return resultado;
    } catch (error) {
      logger.error(
        `[UsuarioDispositivoService] Erro ao remover vínculo ${id}: ${String(error)}`
      );
      throw error;
    }
  }

  /**
   * Remover vínculo por usuario_id e dispositivo_id
   */
  async deleteByUsuarioAndDispositivo(
    usuario_id: string,
    dispositivo_id: string
  ) {
    try {
      const resultado = await prisma.usuarioDispositivo.delete({
        where: {
          usuario_id_dispositivo_id: {
            usuario_id,
            dispositivo_id,
          },
        },
      });

      logger.info(
        `[UsuarioDispositivoService] Vínculo removido: ${usuario_id} -> ${dispositivo_id}`
      );

      return resultado;
    } catch (error) {
      logger.error(
        `[UsuarioDispositivoService] Erro ao remover vínculo: ${String(error)}`
      );
      throw error;
    }
  }
}