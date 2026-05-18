import prisma from "../database/db";
import { AgendamentoHorarioService } from "./AgendamentoHorarioService";

const horarioService = new AgendamentoHorarioService();

export class AgendamentoService {
  async create(dados: any, tx?: any) {
    const db = tx || prisma;
    const { horario, horarios, ...restoDados } = dados;

    try {
      console.log(
        `[AgendamentoService] Criando agendamento com dados:`,
        restoDados,
      );

      const agendamento = await db.agendamento.create({
        data: {
          ...restoDados,
          data_inicio: new Date(restoDados.data_inicio),
          data_fim: restoDados.data_fim ? new Date(restoDados.data_fim) : null,
        },
      });

      console.log(
        `[AgendamentoService] ✅ Agendamento criado com ID: ${agendamento.id}`,
      );

      // Criar horário(s) se fornecido(s)
      if (horario) {
        console.log(`[AgendamentoService] Criando horário único: ${horario}`);
        await horarioService.create(agendamento.id, horario, tx);
      } else if (horarios && Array.isArray(horarios) && horarios.length > 0) {
        console.log(
          `[AgendamentoService] Criando múltiplos horários:`,
          horarios,
        );
        await horarioService.createMultiple(agendamento.id, horarios, tx);
      } else {
        console.log(`[AgendamentoService] ⚠️ Nenhum horário fornecido`);
      }

      return agendamento;
    } catch (error) {
      console.error(
        `[AgendamentoService] ❌ Erro ao criar agendamento:`,
        error,
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
      console.log(`[AgendamentoService] Atualizando agendamento ${id}`);

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
        console.log(`[AgendamentoService] Deletando horários antigos...`);
        await horarioService.deleteByAgendamentoId(id);

        if (horario) {
          console.log(`[AgendamentoService] Criando novo horário: ${horario}`);
          await horarioService.create(id, horario);
        } else if (horarios && Array.isArray(horarios)) {
          console.log(`[AgendamentoService] Criando novos horários:`, horarios);
          await horarioService.createMultiple(id, horarios);
        }
      }

      console.log(`[AgendamentoService] ✅ Agendamento atualizado com sucesso`);
      return agendamento;
    } catch (error) {
      console.error(
        `[AgendamentoService] ❌ Erro ao atualizar agendamento:`,
        error,
      );
      throw error;
    }
  }

  async delete(id: string) {
    try {
      console.log(`[AgendamentoService] Deletando agendamento ${id}`);

      // Deletar horários associados (cascade)
      await horarioService.deleteByAgendamentoId(id);

      const resultado = await prisma.agendamento.delete({ where: { id } });

      console.log(`[AgendamentoService] ✅ Agendamento deletado com sucesso`);
      return resultado;
    } catch (error) {
      console.error(
        `[AgendamentoService] ❌ Erro ao deletar agendamento:`,
        error,
      );
      throw error;
    }
  }
}
