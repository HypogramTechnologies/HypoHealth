import prisma from "../database/db";

export class AgendamentoHorarioService {
  async create(agendamento_id: string, horario: string, tx?: any) {
    const db = tx || prisma;

    try {
      // Converte a string de horário para formato Time do banco
      // Formato esperado: "HH:MM" ex: "10:30"
      const horarioFormatado = new Date(`2000-01-01T${horario}:00`);

      console.log(
        `[AgendamentoHorarioService] Criando horário: ${horario} para agendamento: ${agendamento_id}`,
      );
      console.log(
        `[AgendamentoHorarioService] Data formatada:`,
        horarioFormatado,
      );

      const resultado = await db.agendamentoHorario.create({
        data: {
          agendamento_id,
          horario: horarioFormatado,
        },
      });

      console.log(
        `[AgendamentoHorarioService] ✅ Horário criado com sucesso:`,
        resultado,
      );
      return resultado;
    } catch (error) {
      console.error(
        `[AgendamentoHorarioService] ❌ Erro ao criar horário:`,
        error,
      );
      throw error;
    }
  }

  async createMultiple(agendamento_id: string, horarios: string[], tx?: any) {
    const db = tx || prisma;

    try {
      console.log(
        `[AgendamentoHorarioService] Criando ${horarios.length} horários para agendamento: ${agendamento_id}`,
      );

      const horariosCriados = [];

      // Criar sequencialmente em vez de Promise.all para melhor controle de transação
      for (const horario of horarios) {
        const horarioFormatado = new Date(`2000-01-01T${horario}:00`);

        console.log(`[AgendamentoHorarioService] Criando horário: ${horario}`);

        const resultado = await db.agendamentoHorario.create({
          data: {
            agendamento_id,
            horario: horarioFormatado,
          },
        });

        horariosCriados.push(resultado);
        console.log(`[AgendamentoHorarioService] ✅ Horário ${horario} criado`);
      }

      console.log(
        `[AgendamentoHorarioService] ✅ Total de ${horariosCriados.length} horários criados com sucesso`,
      );
      return horariosCriados;
    } catch (error) {
      console.error(
        `[AgendamentoHorarioService] ❌ Erro ao criar múltiplos horários:`,
        error,
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
