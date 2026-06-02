import prisma from "../database/db";
import { StatusRetirada } from "@prisma/client";
import { IMqttEvent } from "../types/IMqtt";
import { alertService } from "./AlertService";
import { logger } from "../utils/logger";

export class MedicationIntakeService {
  // Chamado pelo AgendadorCronService.ts no momento em que o comando MQTT é enviado
  async criarRegistroPendente(
    agendamentoHorarioId: string,
    horarioProgramado: Date,
  ) {
    try {
      const registro = await prisma.retiradaMedicamento.create({
        data: {
          agendamento_horario_id: agendamentoHorarioId,
          horario_programado: horarioProgramado,
          status: StatusRetirada.PENDENTE,
        },
      });

      return registro;
    } catch (error) {
      logger.error(
        `[MedicationIntakeService] Erro ao criar registro pendente: ${String(error)}`,
      );
      throw error;
    }
  }

  // Monitoramento automático de atrasos
  async monitorarAtrasos() {
    try {
      const agora = new Date();

      // Buscar retiradas pendentes ou atrasadas
      const retiradas = await prisma.retiradaMedicamento.findMany({
        where: {
          status: {
            in: [StatusRetirada.PENDENTE, StatusRetirada.ATRASADO],
          },
        },
      });

      for (const retirada of retiradas) {
        const diferencaMin =
          (agora.getTime() - retirada.horario_programado.getTime()) / 1000 / 60;

        let novoStatus: StatusRetirada | null = null;

        // Mais de 2 horas sem retirada
        if (diferencaMin >= 120) {
          novoStatus = StatusRetirada.NAO_RETIRADO;
        }
        // Mais de 15 minutos de atraso
        else if (
          diferencaMin >= 15 &&
          retirada.status === StatusRetirada.PENDENTE
        ) {
          novoStatus = StatusRetirada.ATRASADO;
        }

        // Atualiza o banco e dispara ações apenas se houver mudança de estado real
        if (novoStatus && novoStatus !== retirada.status) {
          await prisma.retiradaMedicamento.update({
            where: { id: retirada.id },
            data: { status: novoStatus },
          });

          logger.warn(
            `[MedicationIntakeService] Retirada ${retirada.id} atualizada para o status: ${novoStatus}`,
          );

          // Se mudou para ATRASADO, avisa paciente e responsáveis
          if (novoStatus === StatusRetirada.ATRASADO) {
            await alertService.dispararAlertaAtraso(retirada.id);
          }
        }
      }
    } catch (error) {
      logger.error(
        `[MedicationIntakeService] Erro ao monitorar atrasos: ${String(error)}`,
      );
    }
  }

  // Chamado pelo server.ts quando o ESP32 retorna um evento de FECHAMENTO
  async processarRetirada(payload: IMqttEvent, mac?: string) {
    try {
      if (payload.evento !== "FECHAMENTO") {
        return; // Ignora ABERTURA ou outros estados para a atualização do status final
      }

      if (payload.status === "FALHA") {
        logger.warn(
          `[MedicationIntakeService] Dispositivo reportou falha no fechamento: ${payload.mensagem}`,
        );
        return;
      }

      const dataEvento = !isNaN(Number(payload.timestamp))
        ? new Date(Number(payload.timestamp) * 1000)
        : new Date(payload.timestamp);

      const compartimento = await prisma.compartimento.findFirst({
        where: {
          posicao: payload.compartimento,
          dispositivo: {
            numero_serie: mac,
          },
        },
      });

      if (!compartimento) {
        logger.warn(
          `[MedicationIntakeService] Compartimento ${payload.compartimento} não encontrado para o dispositivo ${mac}`,
        );
        return;
      }

      const retirada = await prisma.retiradaMedicamento.findFirst({
        where: {
          status: {
            in: [
              StatusRetirada.PENDENTE,
              StatusRetirada.ATRASADO,
              StatusRetirada.NAO_RETIRADO,
            ],
          },
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
        logger.warn(
          `[MedicationIntakeService] Nenhuma retirada ativa encontrada para o MAC ${mac} no compartimento ${payload.compartimento}`,
        );
        return;
      }

      // Se o medicamento já estava com status de ATRASADO na tabela, mantemos como ATRASADO no histórico.
      // Caso contrário, significa que foi tomado no tempo certo, virando RETIRADO
      const status =
        retirada.status === StatusRetirada.ATRASADO
          ? StatusRetirada.ATRASADO
          : StatusRetirada.RETIRADO;

      await prisma.retiradaMedicamento.update({
        where: { id: retirada.id },
        data: {
          horario_retirada: dataEvento,
          status,
        },
      });

      logger.info(
        `[MedicationIntakeService] Retirada ${retirada.id} concluída e registrada como ${status}`,
      );
    } catch (error) {
      logger.error(
        `[MedicationIntakeService] Erro ao processar retirada: ${String(error)}`,
      );
    }
  }
}