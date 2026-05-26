import prisma from "../database/db";
import { logger } from "../utils/logger";

export class MedicAgendamentoQueryService {
  // Buscar todos os medicamentos com seus agendamentos
  async getAllCompleto() {
    try {
      const medicamentos = await prisma.medicamento.findMany({
        include: {
          agendamentos: {
            include: {
              compartimento: true,
              horarios: {
                orderBy: { horario: "asc" },
              },
            },
          },
        },
      });
      return medicamentos;
    } catch (error) {
      logger.error(
        `[MedicAgendamentoQueryService] Erro ao buscar medicamentos com agendamentos: ${String(error)}`,
      );
      throw error;
    }
  }

  // Buscar medicamento específico com seus agendamentos
  async getByIdCompleto(medicamento_id: string) {
    try {
      const medicamento = await prisma.medicamento.findUnique({
        where: { id: medicamento_id },
        include: {
          agendamentos: {
            include: {
              compartimento: true,
              horarios: {
                orderBy: { horario: "asc" },
              },
            },
          },
        },
      });

      if (!medicamento) {
        return null;
      }
      return medicamento;
    } catch (error) {
      logger.error(
        `[MedicAgendamentoQueryService] Erro ao buscar medicamento ${medicamento_id}: ${String(error)}`,
      );
      throw error;
    }
  }

  // Buscar agendamento específico com medicamento e horários
  async getAgendamentoCompleto(agendamento_id: string) {
    try {
      const agendamento = await prisma.agendamento.findUnique({
        where: { id: agendamento_id },
        include: {
          medicamento: true,
          compartimento: true,
          horarios: {
            orderBy: { horario: "asc" },
          },
        },
      });

      if (!agendamento) {
        return null;
      }
      return agendamento;
    } catch (error) {
      logger.error(
        `[MedicAgendamentoQueryService] Erro ao buscar agendamento ${agendamento_id}: ${String(error)}`,
      );
      throw error;
    }
  }

  // Buscar todos os agendamentos com medicamentos e horários
  async getAllAgendamentosCompleto() {
    try {
      const agendamentos = await prisma.agendamento.findMany({
        include: {
          medicamento: true,
          compartimento: true,
          horarios: {
            orderBy: { horario: "asc" },
          },
        },
        orderBy: {
          data_inicio: "asc",
        },
      });
      return agendamentos;
    } catch (error) {
      logger.error(
        `[MedicAgendamentoQueryService] Erro ao buscar agendamentos completos: ${String(error)}`,
      );
      throw error;
    }
  }

  // Buscar medicamentos do dia filtrado por usuário
  // Buscar medicamentos do dia filtrado por usuário
  async getMedicamentosDoDia(usuarioId: string) {
    try {
      const hoje = new Date();

      const inicio = new Date(hoje);
      inicio.setHours(0, 0, 0, 0);

      const fim = new Date(hoje);
      fim.setHours(23, 59, 59, 999);

      console.log(inicio, fim);
      // 1. pegar dispositivos do usuário (SEM JOIN profundo)
      const dispositivos = await prisma.usuarioDispositivo.findMany({
        where: {
          usuario_id: usuarioId,
        },
        select: {
          dispositivo_id: true,
        },
      });

      const dispositivosIds = dispositivos.map((d) => d.dispositivo_id);

      // se não tiver dispositivo, retorna vazio
      if (dispositivosIds.length === 0) {
        return [];
      }

      const diaSemana = hoje.getDay() + 1;
      // 2. buscar agendamentos de forma simples e segura
      const agendamentos = await prisma.agendamento.findMany({
        where: {
          compartimento: {
            dispositivo_id: {
              in: dispositivosIds,
            },
            posicao: {
              equals: diaSemana,
            },
          },
        },
        include: {
          medicamento: {
            select: {
              id: true,
              nome: true,
              dosagem: true,
            },
          },

          compartimento: {
            select: {
              id: true,
              dispositivo_id: true,
              posicao: true,
            },
          },

          horarios: {
            include: {
              retiradas: {
                where: {
                  horario_programado: {
                    gte: inicio,
                    lte: fim,
                  },
                },
              },
            },
            orderBy: {
              horario: "asc",
            },
          },
        },
      });

      // 3. normalizar resposta
      const resultado = agendamentos.map((agendamento) => {
        return {
          id: agendamento.id,

          medicamento: {
            id: agendamento.medicamento.id,
            nome: agendamento.medicamento.nome,
            dosagem: agendamento.medicamento.dosagem,
          },

          horarios: agendamento.horarios.map((h) => {
            const retirada = h.retiradas[0];

            let status: "PENDENTE" | "RETIRADO" | "ATRASADO" | "NAO_RETIRADO" =
              retirada?.status ?? "PENDENTE";

            const agora = new Date();

            if (!retirada && new Date(h.horario) < agora) {
              status = "ATRASADO";
            }

            return {
              id: h.id,
              horario: h.horario.toISOString().substring(11, 16),
              status,
              horario_retirada: retirada?.horario_retirada ?? null,
            };
          }),
        };
      });

      return resultado;
    } catch (error) {
      logger.error(
        `[MedicAgendamentoQueryService] Erro ao buscar medicamentos do dia para usuário ${usuarioId}: ${String(error)}`,
      );
      throw error;
    }
  }
}
