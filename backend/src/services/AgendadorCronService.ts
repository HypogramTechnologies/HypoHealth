import cron from "node-cron";
import prisma from "../database/db";
import { DiaSemana } from "@prisma/client";
import { DateTime } from "luxon";
import mqttService from "./MqttService";
import { IMqttCommand } from "../types/IMqtt";
import { MedicationIntakeService } from "./MedicationIntakeService";
import { logger } from "../utils/logger";

const medicationIntakeService = new MedicationIntakeService();

class AgendadorCronService {
  public iniciar() {
    //Roda a cada minuto
    cron.schedule("* * * * *", async () => {
      //Usando o luxon para pegar a hora atual no fuso de São Paulo, já que o servidor hospedado no Render está em outro fuso
      const agora = DateTime.now().setZone("America/Sao_Paulo");
      const horaAtual = agora.hour.toString().padStart(2, "0");
      const minutoAtual = agora.minute.toString().padStart(2, "0");
      const horarioAtual = `${horaAtual}:${minutoAtual}:00`;

      cron.schedule("* * * * *", async () => {
        await medicationIntakeService.monitorarAtrasos();
      });

      const diasMap: Record<number, string> = {
        1: "SEGUNDA",
        2: "TERCA",
        3: "QUARTA",
        4: "QUINTA",
        5: "SEXTA",
        6: "SABADO",
        7: "DOMINGO",
      };

      const diaSemanaAtual = diasMap[agora.weekday];

      try {
        const agendamentos = await prisma.agendamentoHorario.findMany({
          where: {
            horario: { equals: new Date(`1970-01-01T${horarioAtual}Z`) }, // Comparar apenas a hora e minuto
            agendamento: {
              compartimento: {
                dia_semana: diaSemanaAtual as DiaSemana,
              },
            }, // Garantir que o agendamento é para o dia da semana atual
          },
          include: {
            agendamento: {
              include: {
                compartimento: {
                  include: {
                    dispositivo: true,
                  },
                },
              },
            },
          },
        });

        for (const item of agendamentos) {
          const macAddress =
            item.agendamento.compartimento.dispositivo.numero_serie;
          const posicao = item.agendamento.compartimento.posicao;

          const comando: IMqttCommand = {
            acao: "ABRIR",
            compartimento: posicao,
            timestamp: agora.toUTC().toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
          };

          mqttService.publishCommand(macAddress, comando);
          await medicationIntakeService.criarRegistroPendente(
            item.id,
            agora.toJSDate(),
          );
        }
      } catch (error) {
        logger.error(
          `[AgendamentoCronService] Erro ao verificar agendamentos: ${String(error)}`,
        );
      }
    });
  }
}

export default new AgendadorCronService();
