import prisma from "../database/db";
import { logger } from "../utils/logger";

type CreateUsuarioDispositivoDTO = {
  usuario_id: string;
  dispositivo_id: string;
  tipo_acesso: "PROPRIETARIO" | "RESPONSAVEL";
};

export class UsuarioDispositivoService {
  async create(dados: CreateUsuarioDispositivoDTO) {
    try {
      const resultado = await prisma.usuarioDispositivo.create({
        data: dados,
      });

      return resultado;
    } catch (error) {
      logger.error(
        `[UsuarioDispositivoService] Erro ao criar vínculo: ${String(error)}`,
      );

      throw error;
    }
  }

  async getByDispositivo(dispositivo_id: string) {
    try {
      const usuarios = await prisma.usuarioDispositivo.findMany({
        where: {
          dispositivo_id,
        },

        include: {
          usuario: true,
        },
      });

      return usuarios;
    } catch (error) {
      logger.error(
        `[UsuarioDispositivoService] Erro ao buscar usuários do dispositivo ${dispositivo_id}: ${String(error)}`,
      );

      throw error;
    }
  }

  async getByUsuario(usuario_id: string) {
    try {
      const dispositivos = await prisma.usuarioDispositivo.findMany({
        where: {
          usuario_id,
        },

        include: {
          dispositivo: true,
        },
      });

      return dispositivos;
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

      return resultado;
    } catch (error) {
      logger.error(
        `[UsuarioDispositivoService] Erro ao remover vínculo ${id}: ${String(error)}`,
      );

      throw error;
    }
  }
}
