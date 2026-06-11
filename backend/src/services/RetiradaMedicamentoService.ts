import prisma from "../database/db";
import { StatusRetirada } from "@prisma/client";
import { IMqttCommand, IMqttEvent } from "../types/IMqtt";
import { alertService } from "./AlertService";
import mqttService from "./MqttService";
import { logger } from "../utils/logger";
import { DateTime } from "luxon";

const FUSO_SAO_PAULO = "America/Sao_Paulo";

export class RetiradaMedicamentoService {
  private converterToDate(agora_fuso: DateTime) {
    return new Date(
      agora_fuso.year,
      agora_fuso.month - 1,
      agora_fuso.day,
      agora_fuso.hour,
      agora_fuso.minute,
      agora_fuso.second,
    );
  }

  private obterAgora() {
    return DateTime.now().setZone(FUSO_SAO_PAULO);
  }

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
        `[RetiradaMedicamentoService] Erro ao criar registro pendente: ${String(error)}`,
      );
      throw error;
    }
  }

  // Monitoramento automático de atrasos
  async monitorarAtrasos() {
    try {
      const agora = this.converterToDate(this.obterAgora());

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
            `[RetiradaMedicamentoService] Retirada ${retirada.id} atualizada para o status: ${novoStatus}`,
          );

          // Se mudou para ATRASADO, avisa paciente e responsáveis
          if (novoStatus === StatusRetirada.ATRASADO) {
            await alertService.dispararAlertaAtraso(retirada.id);
          }
        }
      }
    } catch (error) {
      logger.error(
        `[RetiradaMedicamentoService] Erro ao monitorar atrasos: ${String(error)}`,
      );
    }
  }

  async abastecerCompartimento(
    posicao: number,
    numeroSerie: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const comando: IMqttCommand = {
        acao: "ABASTECER",
        compartimento: posicao,
        timestamp: this.converterToDate(this.obterAgora()).toString(),
      };

      mqttService.publishCommand(numeroSerie, comando);

      const timeout = setTimeout(() => {
        reject(new Error("Timeout"));
      }, 30000);

      mqttService.onEventReceived((mac: String, payload: IMqttEvent) => {
        if (
          payload.evento === "FECHAMENTO_ABASTECIMENTO" &&
          payload.compartimento === posicao
        ) {
          clearTimeout(timeout);

          resolve(payload.status === "SUCESSO");
        }
      });
    });
  }

  async reabrirCompartimento(retiradaId: string) {
    try {
      const retirada = await prisma.retiradaMedicamento.findUnique({
        where: { id: retiradaId },
        include: {
          agendamentoHorario: {
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
          },
        },
      });

      if (!retirada) {
        throw new Error("Retirada não encontrada.");
      }

      const statusReabertura: StatusRetirada[] = [
        StatusRetirada.ATRASADO,
        StatusRetirada.NAO_RETIRADO,
      ];

      if (!statusReabertura.includes(retirada.status)) {
        throw new Error(
          "Somente retiradas atrasadas ou não retiradas podem ser reabertas.",
        );
      }

      const agora = this.obterAgora();
      const horarioProgramado = DateTime.fromJSDate(
        retirada.horario_programado,
      ).setZone(FUSO_SAO_PAULO);

      if (!horarioProgramado.hasSame(agora, "day")) {
        throw new Error("Somente retiradas do dia atual podem ser reabertas.");
      }

      const compartimento =
        retirada.agendamentoHorario.agendamento.compartimento;
      const dispositivo = compartimento.dispositivo;

      const comando: IMqttCommand = {
        acao: "ABRIR",
        compartimento: compartimento.posicao,
        timestamp: this.converterToDate(this.obterAgora()).toString(), // agora.toUTC().toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
      };

      mqttService.publishCommand(dispositivo.numero_serie, comando);

      const retiradaReaberta = await prisma.retiradaMedicamento.update({
        where: { id: retirada.id },
        data: {
          horario_programado: agora.toJSDate(),
          horario_retirada: null,
          status: StatusRetirada.PENDENTE,
        },
      });

      logger.info(
        `[RetiradaMedicamentoService] Retirada ${retirada.id} reaberta para o compartimento ${compartimento.posicao}`,
      );

      return retiradaReaberta;
    } catch (error) {
      logger.error(
        `[RetiradaMedicamentoService] Erro ao reabrir compartimento: ${String(error)}`,
      );
      throw error;
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
          `[RetiradaMedicamentoService] Dispositivo reportou falha no fechamento: ${payload.mensagem}`,
        );
        return;
      }

      const dataString = this.converterToDate(this.obterAgora()).toString();
      const dataEvento = !isNaN(Number(dataString))
        ? new Date(Number(dataString) * 1000)
        : new Date(dataString);

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
          `[RetiradaMedicamentoService] Compartimento ${payload.compartimento} não encontrado para o dispositivo ${mac}`,
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
          `[RetiradaMedicamentoService] Nenhuma retirada ativa encontrada para o MAC ${mac} no compartimento ${payload.compartimento}`,
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
        `[RetiradaMedicamentoService] Retirada ${retirada.id} concluída e registrada como ${status}`,
      );
    } catch (error) {
      logger.error(
        `[RetiradaMedicamentoService] Erro ao processar retirada: ${String(error)}`,
      );
    }
  }

  // Utilizado para recuperar alertas levando em consideração o usuário e o status da retirada
  private async recuperarRetiradas(
    usuarioId: string,
    status: StatusRetirada[],
  ) {
    try {
      const retiradas = await prisma.retiradaMedicamento.findMany({
        where: {
          status: {
            in: status,
          },
          agendamentoHorario: {
            agendamento: {
              compartimento: {
                dispositivo: {
                  usuarios: {
                    some: {
                      usuario_id: usuarioId,
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          agendamentoHorario: {
            include: {
              agendamento: {
                include: {
                  medicamento: {
                    select: {
                      nome: true,
                      dosagem: true,
                      descricao: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: [
          {
            horario_programado: "asc",
          },
          {
            status: "asc",
          },
        ],
      });
      return retiradas;
    } catch (error) {
      logger.error(
        `[RetiradaMedicamentoService] Erro ao recuperar retiradas ativas: ${String(error)}`,
      );
      throw error;
    }
  }

  // Utilizado para recuperar os alertas (registros de retirada PENDENTE ou ATRASADO) para exibição no app
  async recuperarAlertas(usuarioId: string) {
    try {
      const alertas = await this.recuperarRetiradas(usuarioId, [
        StatusRetirada.PENDENTE,
        StatusRetirada.ATRASADO,
      ]);

      return alertas;
    } catch (error) {
      logger.error(
        `[RetiradaMedicamentoService] Erro ao recuperar alertas: ${String(error)}`,
      );
      throw error;
    }
  }

  // Utilizado para recuperar o histórico do paciente (registros de retirada RETIRADO ou NAO_RETIRADO) para exibição no app
  async recuperarHistorico(usuarioId: string) {
    try {
      const historico = await this.recuperarRetiradas(usuarioId, [
        StatusRetirada.RETIRADO,
        StatusRetirada.NAO_RETIRADO,
      ]);
      return historico;
    } catch (error) {
      logger.error(
        `[RetiradaMedicamentoService] Erro ao recuperar histórico: ${String(error)}`,
      );
      throw error;
    }
  }
}
