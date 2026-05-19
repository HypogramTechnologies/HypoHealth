import prisma from "../database/db";
import { StatusRetirada } from "@prisma/client";
import { logger } from "../utils/logger";

export async function gerarRetiradasDoDia() {
  try {
    const agendamentos = await prisma.agendamento.findMany({
      include: {
        horarios: true,
      },
    });

    for (const agendamento of agendamentos) {
      for (const horario of agendamento.horarios) {
        const hora = horario.horario.getHours();

        const minuto = horario.horario.getMinutes();

        const agora = new Date();

        const horarioProgramado = new Date(
          agora.getFullYear(),
          agora.getMonth(),
          agora.getDate(),
          hora,
          minuto,
          0,
          0,
        );

        // evitar duplicidade
        const jaExiste = await prisma.retiradaMedicamento.findFirst({
          where: {
            agendamento_horario_id: horario.id,

            horario_programado: horarioProgramado,
          },
        });

        if (jaExiste) continue;

        await prisma.retiradaMedicamento.create({
          data: {
            agendamento_horario_id: horario.id,

            horario_programado: horarioProgramado,

            status: StatusRetirada.PENDENTE,
          },
        });
      }
    }
  } catch (error) {
    logger.error(`Erro ao gerar retiradas do dia: ${String(error)}`);
  }
}
