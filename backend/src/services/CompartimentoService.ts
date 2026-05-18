import prisma from "../database/db";

export class CompartimentoService {
  async getByDispositivo(dispositivoId: string) {
    try {
      console.log(
        `[CompartimentoService] Buscando compartimentos do dispositivo ${dispositivoId}`,
      );

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

      console.log(
        `[CompartimentoService] ✅ Encontrados ${compartimentos.length} compartimentos`,
      );

      return compartimentos;
    } catch (error) {
      console.error(
        `[CompartimentoService] ❌ Erro ao buscar compartimentos:`,
        error,
      );

      throw error;
    }
  }

  async getById(id: string) {
    try {
      console.log(
        `[CompartimentoService] Buscando compartimento ${id}`,
      );

      const compartimento =
        await prisma.compartimento.findUnique({
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
        console.log(
          `[CompartimentoService] ⚠️ Compartimento não encontrado`,
        );

        return null;
      }

      console.log(
        `[CompartimentoService] ✅ Compartimento encontrado`,
      );

      return compartimento;
    } catch (error) {
      console.error(
        `[CompartimentoService] ❌ Erro ao buscar compartimento:`,
        error,
      );

      throw error;
    }
  }
}