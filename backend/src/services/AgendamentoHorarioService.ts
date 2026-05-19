import prisma from "../database/db";
import { logger } from "../utils/logger";

export class AgendamentoHorarioService {
  async create(agendamento_id: string, horario: string, tx?: any) {
    const db = tx || prisma;

    try {
      // Converte a string de horário para formato Time do banco
      // Formato esperado: "HH:MM" ex: "10:30"
      const horarioFormatado = new Date(`2000-01-01T${horario}:00`);

      const resultado = await db.agendamentoHorario.create({
        data: {
          agendamento_id,
          horario: horarioFormatado,
        },
      });
      return resultado;
    } catch (error) {
      logger.error(
        `[AgendamentoHorarioService] Erro ao criar horário para agendamento ${agendamento_id}: ${String(error)}`,
      );
      throw error;
    }
  }

  async createMultiple(agendamento_id: string, horarios: string[], tx?: any) {
    const db = tx || prisma;

    try {
      const horariosCriados = [];

      // Criar sequencialmente em vez de Promise.all para melhor controle de transação
      for (const horario of horarios) {
        const horarioFormatado = new Date(`2000-01-01T${horario}:00`);

        const resultado = await db.agendamentoHorario.create({
          data: {
            agendamento_id,
            horario: horarioFormatado,
          },
        });

        horariosCriados.push(resultado);
      }
      return horariosCriados;
    } catch (error) {
      logger.error(
        `[AgendamentoHorarioService] Erro ao criar múltiplos horários para agendamento ${agendamento_id}: ${String(error)}`,
      );
      throw error;
    }
  }

  async getByAgendamentoId(agendamento_id: string) {
    return await prisma.agendamentoHorario.findMany({
      where: { agendamento_id },
      orderBy: { horario: "asc" },
    });
  }

  async deleteByAgendamentoId(agendamento_id: string) {
    return await prisma.agendamentoHorario.deleteMany({
      where: { agendamento_id },
    });
  }

  async delete(id: string) {
    return await prisma.agendamentoHorario.delete({ where: { id } });
  }
}
