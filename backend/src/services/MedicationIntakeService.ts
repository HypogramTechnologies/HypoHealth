import prisma from "../database/db";
import { StatusRetirada } from "@prisma/client";

interface EventoRetirada {
  evento_id: string;
  evento: string;
  dispositivo_id: string;
  compartimento_id: string;
  timestamp: string;
}

export class MedicationIntakeService {

  async processarRetirada(payload: EventoRetirada) {

    const dataEvento = new Date(payload.timestamp);

    // janela de tolerância
    const limiteInferior = new Date(
      dataEvento.getTime() - 1000 * 60 * 60
    );

    const limiteSuperior = new Date(
      dataEvento.getTime() + 1000 * 60 * 30
    );

    console.log(payload.compartimento_id);
    // procurar retirada pendente
    const retirada =
      await prisma.retiradaMedicamento.findFirst({
        where: {
          status: "PENDENTE"
        },

        include: {
          agendamentoHorario: {
            include: {
              agendamento: true
            }
          }
        }
      });

    console.log(JSON.stringify(retirada, null, 2));

    if (!retirada) {

      console.log(
        "Nenhuma retirada pendente encontrada"
      );

      return;

    }

    // calcular atraso
    const atrasoMs =
      dataEvento.getTime() -
      retirada.horario_programado.getTime();

    const atrasoMin = atrasoMs / 1000 / 60;

    const status =
      atrasoMin <= 15
        ? StatusRetirada.RETIRADO
        : StatusRetirada.ATRASADO;

    // atualizar retirada
    await prisma.retiradaMedicamento.update({
      where: {
        id: retirada.id
      },

      data: {
        horario_retirada: dataEvento,
        status
      }
    });

    console.log(
      `Retirada ${retirada.id} registrada como ${status}`
    );

  }

}