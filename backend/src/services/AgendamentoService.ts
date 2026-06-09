import prisma from "../database/db";
import { AgendamentoHorarioService } from "./AgendamentoHorarioService";
import { logger } from "../utils/logger";

const horarioService = new AgendamentoHorarioService();

export class AgendamentoService {
  async create(dados: any, tx?: any) {
    const db = tx || prisma;

    const {
      horario,
      horarios,

      compartimento_ids,

      ...restoDados
    } = dados;

    try {
      const agendamentosCriados = [];

      // LOOP DOS COMPARTIMENTOS
      for (const compartimento_id of compartimento_ids) {
        const agendamento = await db.agendamento.create({
          data: {
            ...restoDados,

            compartimento_id,

            data_inicio: new Date(restoDados.data_inicio),

            data_fim: restoDados.data_fim
              ? new Date(restoDados.data_fim)
              : null,
          },
        });

        // HORÁRIO ÚNICO
        if (horario) {
          await horarioService.create(agendamento.id, horario, tx);
        }

        // MÚLTIPLOS HORÁRIOS
        else if (horarios && Array.isArray(horarios) && horarios.length > 0) {
          await horarioService.createMultiple(agendamento.id, horarios, tx);
        }

        agendamentosCriados.push(agendamento);
      }

      return agendamentosCriados;
    } catch (error) {
      logger.error(
        `[AgendamentoService] Erro ao criar agendamento: ${String(error)}`,
      );

      throw error;
    }
  }

  async getAll() {
    return await prisma.agendamento.findMany({
      include: {
        medicamento: true,
        compartimento: true,
        horarios: {
          orderBy: { horario: "asc" },
        },
      },
    });
  }

  async getById(id: string) {
    return await prisma.agendamento.findUnique({
      where: { id },
      include: {
        medicamento: true,
        compartimento: true,
        horarios: {
          orderBy: { horario: "asc" },
        },
      },
    });
  }

  async update(id: string, dados: any) {
    const { horario, horarios, ...restoDados } = dados;

    try {
      const agendamento = await prisma.agendamento.update({
        where: { id },
        data: {
          ...restoDados,
          ...(restoDados.data_inicio && {
            data_inicio: new Date(restoDados.data_inicio),
          }),
          ...(restoDados.data_fim !== undefined && {
            data_fim: restoDados.data_fim
              ? new Date(restoDados.data_fim)
              : null,
          }),
        },
      });

      // Se novos horários foram fornecidos, deletar os antigos e criar novos
      if (
        horario ||
        (horarios && Array.isArray(horarios) && horarios.length > 0)
      ) {
        await horarioService.deleteByAgendamentoId(id);

        if (horario) {
          await horarioService.create(id, horario);
        } else if (horarios && Array.isArray(horarios)) {
          await horarioService.createMultiple(id, horarios);
        }
      }

      return agendamento;
    } catch (error) {
      logger.error(
        `[AgendamentoService] Erro ao atualizar agendamento ${id}: ${String(error)}`,
      );
      throw error;
    }
  }

  async delete(id: string) {
    try {
      // Deletar horários associados (cascade)
      await horarioService.deleteByAgendamentoId(id);

      const resultado = await prisma.agendamento.delete({ where: { id } });
      return resultado;
    } catch (error) {
      logger.error(
        `[AgendamentoService] Erro ao deletar agendamento ${id}: ${String(error)}`,
      );
      throw error;
    }
  }
}
