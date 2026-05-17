import prisma from "../database/db";

export class MedicAgendamentoQueryService {
  // Buscar todos os medicamentos com seus agendamentos
  async getAllCompleto() {
    try {
      console.log(
        `[MedicAgendamentoQueryService] Buscando todos os medicamentos com agendamentos`,
      );

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

      console.log(
        `[MedicAgendamentoQueryService] ✅ Encontrados ${medicamentos.length} medicamentos`,
      );
      return medicamentos;
    } catch (error) {
      console.error(
        `[MedicAgendamentoQueryService] ❌ Erro ao buscar medicamentos:`,
        error,
      );
      throw error;
    }
  }

  // Buscar medicamento específico com seus agendamentos
  async getByIdCompleto(medicamento_id: string) {
    try {
      console.log(
        `[MedicAgendamentoQueryService] Buscando medicamento ${medicamento_id} com agendamentos`,
      );

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
        console.log(
          `[MedicAgendamentoQueryService] ⚠️ Medicamento ${medicamento_id} não encontrado`,
        );
        return null;
      }

      console.log(
        `[MedicAgendamentoQueryService] ✅ Medicamento encontrado com ${medicamento.agendamentos.length} agendamentos`,
      );
      return medicamento;
    } catch (error) {
      console.error(
        `[MedicAgendamentoQueryService] ❌ Erro ao buscar medicamento:`,
        error,
      );
      throw error;
    }
  }

  // Buscar agendamento específico com medicamento e horários
  async getAgendamentoCompleto(agendamento_id: string) {
    try {
      console.log(
        `[MedicAgendamentoQueryService] Buscando agendamento ${agendamento_id} completo`,
      );

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
        console.log(
          `[MedicAgendamentoQueryService] ⚠️ Agendamento ${agendamento_id} não encontrado`,
        );
        return null;
      }

      console.log(
        `[MedicAgendamentoQueryService] ✅ Agendamento encontrado com ${agendamento.horarios.length} horários`,
      );
      return agendamento;
    } catch (error) {
      console.error(
        `[MedicAgendamentoQueryService] ❌ Erro ao buscar agendamento:`,
        error,
      );
      throw error;
    }
  }

  // Buscar todos os agendamentos com medicamentos e horários
  async getAllAgendamentosCompleto() {
    try {
      console.log(
        `[MedicAgendamentoQueryService] Buscando todos os agendamentos completos`,
      );

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

      console.log(
        `[MedicAgendamentoQueryService] ✅ Encontrados ${agendamentos.length} agendamentos`,
      );
      return agendamentos;
    } catch (error) {
      console.error(
        `[MedicAgendamentoQueryService] ❌ Erro ao buscar agendamentos:`,
        error,
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

      const agendamentos = await prisma.agendamento.findMany({
        where: {
          compartimento: {
            dispositivo: {
              usuarios: {
                some: {
                  usuario: {
                    id: usuarioId,
                  },
                },
              },
            },
          },
        },
        include: {
          medicamento: true,

          compartimento: {
            include: {
              dispositivo: {
                include: {
                  usuarios: true,
                },
              },
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
      throw error;
    }
  }
}
