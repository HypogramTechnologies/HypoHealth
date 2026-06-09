import prisma from "../database/db";
import { logger } from "../utils/logger";
import { MedicamentoQuery } from "../queries/medicamentoQuery";

export class MedicAgendamentoQueryService {
  // Buscar todos os medicamentos com seus agendamentos
  async getAllCompleto(filtros?: any) {
    try {
      const where = MedicamentoQuery.montarFiltros(filtros);

      const medicamentos = await prisma.medicamento.findMany({
        where,

        include: {
          agendamentos: {
            include: {
              compartimento: true,

              horarios: {
                include: {
                  retiradas: true,
                },

                orderBy: {
                  horario: "asc",
                },
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
        where: { id: agendamento_id, ativo: true },
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
        where: {
          ativo: true,
        },
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
  async getMedicamentosDoDia(usuarioId: string) {
    try {
      const hoje = new Date();

      const inicio = new Date(hoje);
      inicio.setHours(0, 0, 0, 0);

      const fim = new Date(hoje);
      fim.setHours(23, 59, 59, 999);

      // DOMINGO -> SABADO
      const diasSemana = [
        "DOMINGO",
        "SEGUNDA",
        "TERCA",
        "QUARTA",
        "QUINTA",
        "SEXTA",
        "SABADO",
      ] as const;

      const diaSemana = diasSemana[hoje.getDay()];

      // 1. buscar dispositivos do usuário
      const dispositivos = await prisma.usuarioDispositivo.findMany({
        where: {
          usuario_id: usuarioId,
        },

        select: {
          dispositivo_id: true,
        },
      });

      const dispositivosIds = dispositivos.map((d) => d.dispositivo_id);

      // sem dispositivos
      if (dispositivosIds.length === 0) {
        return [];
      }

      // 2. buscar agendamentos
      const agendamentos = await prisma.agendamento.findMany({
        where: {
          ativo: true,
          compartimento: {
            dispositivo_id: {
              in: dispositivosIds,
            },

            dia_semana: diaSemana,
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
              dia_semana: true,
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

                orderBy: {
                  horario_programado: "asc",
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

          compartimento: {
            id: agendamento.compartimento.id,

            posicao: agendamento.compartimento.posicao,

            dia_semana: agendamento.compartimento.dia_semana,
          },

          horarios: agendamento.horarios.map((h) => {
            const retirada = h.retiradas[0];

            let status: "PENDENTE" | "RETIRADO" | "ATRASADO" | "NAO_RETIRADO" =
              retirada?.status ?? "PENDENTE";

            // converter TIME para horário de hoje
            const horarioTexto = h.horario.toISOString().substring(11, 16);

            const [hora, minuto] = horarioTexto.split(":").map(Number);

            const horarioHoje = new Date();

            horarioHoje.setHours(hora, minuto, 0, 0);

            // atraso automático
            if (!retirada && horarioHoje < hoje) {
              status = "ATRASADO";
            }

            return {
              id: h.id,

              horario: horarioTexto,

              status,

              horario_retirada: retirada?.horario_retirada ?? null,
            };
          }),
        };
      });

      console.dir(resultado, {
        depth: null,
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
