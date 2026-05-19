import prisma from "../database/db";
import { logger } from "../utils/logger";

export class CompartimentoService {
  async getByDispositivo(dispositivoId: string) {
    try {
      const compartimentos = await prisma.compartimento.findMany({
        where: {
          dispositivo_id: dispositivoId,
        },

        select: {
          id: true,

          posicao: true,

          dia_semana: true,

          descricao: true,
        },

        orderBy: {
          posicao: "asc",
        },
      });

      return compartimentos;
    } catch (error) {
      logger.error(
        `[CompartimentoService] Erro ao buscar compartimentos do dispositivo ${dispositivoId}: ${String(error)}`,
      );

      throw error;
    }
  }

  async getById(id: string) {
    try {
      const compartimento = await prisma.compartimento.findUnique({
        where: { id },

        include: {
          dispositivo: true,

          medicamentos: {
            include: {
              medicamento: true,
            },
          },

          agendamentos: {
            include: {
              medicamento: true,

              horarios: {
                orderBy: {
                  horario: "asc",
                },
              },
            },
          },
        },
      });

      if (!compartimento) {
        return null;
      }

      return compartimento;
    } catch (error) {
      logger.error(
        `[CompartimentoService] Erro ao buscar compartimento ${id}: ${String(error)}`,
      );

      throw error;
    }
  }
}
