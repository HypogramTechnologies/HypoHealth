import prisma from "../database/db";
import { StatusRetirada } from "@prisma/client";
import { IMqttEvent } from "../types/IMqtt";

export class MedicationIntakeService {
  async processarRetirada(payload: IMqttEvent, mac?: string) {
    try {
      const dataEvento = new Date(payload.timestamp);

      console.log("Processando evento:", payload);

      //Encontrar compartimento pelo número (1, 2, 3...)

      const compartimento = await prisma.compartimento.findFirst({
        where: {
          posicao: payload.compartimento,
        },
      });

      if (!compartimento) {
        console.log("Compartimento não encontrado:", payload.compartimento);
        return;
      }
      //Buscar a última retirada do compartimento
      const retirada = await prisma.retiradaMedicamento.findFirst({
        where: {
          agendamentoHorario: {
            agendamento: {
              compartimento_id: compartimento.id,
            },
          },
        },
        include: {
          agendamentoHorario: {
            include: {
              agendamento: true,
            },
          },
        },
        orderBy: {
          horario_programado: "desc",
        },
      });

      if (!retirada) {
        console.log("Nenhuma retirada encontrada para o compartimento");
        return;
      }
      
      //Calcular diferença de tempo
      const atrasoMs =
        dataEvento.getTime() - retirada.horario_programado.getTime();

      const atrasoMin = atrasoMs / 1000 / 60;

      //Classificação inteligente do evento
      let status: StatusRetirada;

      if (atrasoMin <= 15) {
        status = StatusRetirada.RETIRADO;
      } else {
        status = StatusRetirada.ATRASADO;
      }

      //Atualizar registro
      await prisma.retiradaMedicamento.update({
        where: {
          id: retirada.id,
        },
        data: {
          horario_retirada: dataEvento,
          status,
        },
      });

      console.log(
        `Retirada ${retirada.id} registrada como ${status}`
      );
    } catch (error) {
      console.error("Erro ao processar retirada:", error);
    }
  }
}