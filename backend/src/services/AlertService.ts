import prisma from "../database/db";
import { Expo } from "expo-server-sdk";
import { logger } from "../utils/logger";
import { TipoAcesso } from "@prisma/client";

const expo = new Expo();

export class AlertService {
  // Envia a Push Notification de fato usando o servidor do Expo
  async enviarAlerta(
    pushToken: string,
    title: string,
    body: string,
    data?: Record<string, any>,
  ) {
    // Valida se o token é um formato válido do Expo
    if (!Expo.isExpoPushToken(pushToken)) {
      logger.error(`Token de push inválido: ${pushToken}`);
      return;
    }

    try {
      const mensagens = [
        {
          to: pushToken,
          sound: "default",
          title,
          body,
          data,
        },
      ];

      const chunks = expo.chunkPushNotifications(mensagens);
      for (const chunk of chunks) {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        logger.info(
          `[AlertService] Push enviado com sucesso para o token: ${pushToken}`,
        );
      }
    } catch (error) {
      logger.error(
        `[AlertService] Erro ao enviar push para o token ${pushToken}: ${error}`,
      );
    }
  }

  // Alerta 1: Hora do medicamento (Dispara para o Paciente/Proprietário)
  async dispararAlertaMedicamento(agendamentoHorarioId: string) {
    try {
      const dados = await prisma.agendamentoHorario.findUnique({
        where: { id: agendamentoHorarioId },
        include: {
          agendamento: {
            include: {
              medicamento: true,
              compartimento: {
                include: {
                  dispositivo: {
                    include: {
                      usuarios: {
                        where: {
                          tipo_acesso: TipoAcesso.PROPRIETARIO,
                        },
                        include: {
                          usuario: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      const paciente =
        dados?.agendamento.compartimento.dispositivo.usuarios[0].usuario;
      const medicamentoNome = dados?.agendamento.medicamento.nome;

      if (paciente?.push_token && medicamentoNome) {
        const titulo = `⏰ Hora do seu remédio!`;
        const corpo = `Está na hora de tomar o seu medicamento: ${medicamentoNome}. O compartimento já está aberto.`;

        await this.enviarAlerta(paciente.push_token, titulo, corpo, {
          agendamentoId: dados.agendamento_id,
        });
      }
    } catch (error) {
      logger.error(
        `[AlertService] Erro ao buscar dados para o agendamento ${agendamentoHorarioId}: ${error}`,
      );
      return;
    }
  }

  // Alerta 2: Medicamento atrasado (Dispara para Paciente e Responsáveis)

  async dispararAlertaAtraso(retiradaId: string) {
    try {
      const retirada = await prisma.retiradaMedicamento.findUnique({
        where: { id: retiradaId },
        include: {
          agendamentoHorario: {
            include: {
              agendamento: {
                include: {
                  medicamento: true,
                  compartimento: {
                    include: {
                      dispositivo: {
                        include: {
                          usuarios: { include: { usuario: true } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      const usuariosVinculados =
        retirada?.agendamentoHorario.agendamento.compartimento.dispositivo
          .usuarios || [];
      const medicamentoNome =
        retirada?.agendamentoHorario.agendamento.medicamento.nome;

      for (const item of usuariosVinculados) {
        if (!item.usuario.push_token) continue;

        let titulo = "";
        let corpo = "";

        if (item.tipo_acesso === TipoAcesso.PROPRIETARIO) {
          titulo = `⚠️ Medicamento Atrasado!`;
          corpo = `Você ainda não retirou o seu medicamento "${medicamentoNome}". Vá até o dispenser.`;
        } else if (item.tipo_acesso === TipoAcesso.RESPONSAVEL) {
          titulo = `🚨 Alerta: Paciente em atraso!`;
          corpo = `O medicamento "${medicamentoNome}" não foi retirado pelo paciente dentro do horário programado.`;
        }

        await this.enviarAlerta(item.usuario.push_token, titulo, corpo);
      }
    } catch (error) {
      logger.error(`[AlertService] Erro no push de atraso: ${String(error)}`);
    }
  }
}

export const alertService = new AlertService();
