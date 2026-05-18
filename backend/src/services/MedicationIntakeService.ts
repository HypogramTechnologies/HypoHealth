import prisma from "../database/db";
import { StatusRetirada } from "@prisma/client";
import { IMqttEvent } from "../types/IMqtt";

export class MedicationIntakeService {
  //Chamado pelo AgendadorCronService.ts no momento em que o comando MQTT é enviado
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
      console.log(
        `[MedicationIntakeService] Registro PENDENTE criado para o agendamento horário: ${agendamentoHorarioId}`,
      );
      return registro;
    } catch (error) {
      console.error(
        "[MedicationIntakeService] Erro ao criar registro pendente:",
        error,
      );
    }
  }

  //Chamado pelo server.ts quando o ESP32 retorna um evento
  async processarRetirada(payload: IMqttEvent, mac?: string) {
    try {
      // Trata o timestamp vindo do ESP32
      const dataEvento = !isNaN(Number(payload.timestamp))
        ? new Date(Number(payload.timestamp) * 1000)
        : new Date(payload.timestamp);

      console.log(
        `[MedicationIntakeService] Processando evento do MAC [${mac}]:`,
        payload,
      );

      // Encontrar o compartimento correto filtrando pelo MAC do dispositivo E pela posição
      const compartimento = await prisma.compartimento.findFirst({
        where: {
          posicao: payload.compartimento,
          dispositivo: {
            numero_serie: mac, // Garante que é deste hardware específico
          },
        },
      });

      if (!compartimento) {
        console.log(
          `[MedicationIntakeService] Compartimento ${payload.compartimento} não encontrado para o dispositivo ${mac}`,
        );
        return;
      }

      // Buscar a última retirada que esteja PENDENTE para este compartimento específico
      const retirada = await prisma.retiradaMedicamento.findFirst({
        where: {
          status: StatusRetirada.PENDENTE,
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
          horario_programado: "desc", // Garante que pega o agendamento mais recente da fila
        },
      });

      if (!retirada) {
        console.log(
          `[MedicationIntakeService] Nenhuma retirada PENDENTE encontrada para o MAC ${mac} no compartimento ${payload.compartimento}`,
        );
        return;
      }

      if (payload.status === "FALHA") {
        console.log(
          `[MedicationIntakeService] Dispositivo reportou falha na abertura: ${payload.mensagem}`,
        );
        return;
      }

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

      // Atualizar o registro PENDENTE existente
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
        `[MedicationIntakeService] Retirada ${retirada.id} atualizada com sucesso de PENDENTE para ${status}`,
      );
    } catch (error) {
      console.error(
        "[MedicationIntakeService] Erro ao processar retirada:",
        error,
      );
    }
  }
}
