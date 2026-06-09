import { Request, Response } from "express";
import prisma from "../database/db";

import { MedicamentoService } from "../services/MedicamentoService";
import { AgendamentoService } from "../services/AgendamentoService";

import { logger } from "../utils/logger";

const medicService = new MedicamentoService();
const agendamentoService = new AgendamentoService();

export class MedicAgendamentoController {
  async createSimultaneo(req: Request, res: Response) {
    try {
      const {
        nome,
        dosagem,
        descricao,
        usuario_id,

        compartimento_ids,

        tipo,

        data_inicio,
        data_fim,

        intervalo_horas,
        horarios,
      } = req.body;

      // CAMPOS OBRIGATÓRIOS
      if (!nome || !dosagem || !compartimento_ids || !tipo || !data_inicio) {
        return res.status(400).json({
          erro: "Campos obrigatórios faltando.",
        });
      }

      // VALIDAÇÃO PARA HORARIO_FIXO
      if (tipo === "HORARIO_FIXO") {
        if (!horarios || horarios.length === 0) {
          return res.status(400).json({
            erro: "HORARIO_FIXO exige 'horarios'.",
          });
        }
      }

      // VALIDAÇÃO PARA INTERVALO
      if (tipo === "INTERVALO") {
        if (!horarios || horarios.length === 0) {
          return res.status(400).json({
            erro: "INTERVALO exige 'horarios'.",
          });
        }

        if (!intervalo_horas) {
          return res.status(400).json({
            erro: "INTERVALO exige 'intervalo_horas'.",
          });
        }
      }

      const resultado = await prisma.$transaction(async (tx) => {
        // 1 - CRIAR MEDICAMENTO
        const novoMedicamento = await medicService.create(
          {
            nome,
            dosagem,
            descricao,
            usuario_id,
          },
          tx,
        );

        // 2 - CRIAR AGENDAMENTO
        const novoAgendamento = await agendamentoService.create(
          {
            medicamento_id: novoMedicamento.id,

            compartimento_ids,

            tipo,

            data_inicio,
            data_fim,

            intervalo_horas,

            horarios,
            ativo: true
          },
          tx,
        );

        return {
          medicamento: novoMedicamento,
          agendamento: novoAgendamento,
        };
      });

      return res.status(201).json(resultado);
    } catch (error) {
      logger.error(`[MedicAgendamentoController] ${String(error)}`);

      return res.status(500).json({
        erro: "Erro na operação simultânea.",
      });
    }
  }

  async updateSimultaneo(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

      const {
        nome,
        dosagem,
        descricao,
        usuario_id,
        compartimento_ids,

        tipo,

        data_inicio,
        data_fim,

        intervalo_horas,

        horarios,
      } = req.body;

      const medicamentoExistente = await prisma.medicamento.findUnique({
        where: { id },

        include: {
          agendamentos: true,
        },
      });

      if (!medicamentoExistente) {
        return res.status(404).json({
          erro: "Medicamento não encontrado.",
        });
      }

      const resultado = await prisma.$transaction(async (tx) => {
        // 1 - ATUALIZA MEDICAMENTO
        const medicamentoAtualizado = await tx.medicamento.update({
          where: { id },

          data: {
            nome,
            dosagem,
            descricao,
          },
        });

        // 2 - DESATIVA AGENDAMENTOS ANTIGOS
        await tx.agendamento.updateMany({
          where: {
            medicamento_id: id,
            ativo: true,
          },

          data: {
            ativo: false,
          },
        });

        // 3 - CRIA NOVO AGENDAMENTO
        const novosAgendamentos = await agendamentoService.create(
          {
            medicamento_id: id,

            compartimento_ids,

            tipo,

            data_inicio,
            data_fim,

            intervalo_horas,

            horarios,
          },
          tx,
        );

        return {
          medicamento: medicamentoAtualizado,
          agendamentos: novosAgendamentos,
        };
      });

      return res.json(resultado);
    } catch (error) {
      logger.error(`[MedicAgendamentoController] ${String(error)}`);

      return res.status(500).json({
        erro: "Erro ao atualizar medicamento/agendamento.",
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

      const medicamento = await prisma.medicamento.findUnique({
        where: { id },

        include: {
          agendamentos: {
            where: {
              ativo: true,
            },
            
            include: {
              compartimento: true,

              horarios: {
                orderBy: [
                  {
                    horario: "asc",
                  },
                ],
              },
            },

            orderBy: {
              criado_em: "desc",
            },
          },
        },
      });

      if (!medicamento) {
        return res.status(404).json({
          erro: "Medicamento não encontrado.",
        });
      }

      const primeiroAgendamento = medicamento.agendamentos[0];

      console.log(
        "Primeiro agendamento encontrado:",
        primeiroAgendamento,
      );

      const resposta = {
        id: medicamento.id,

        nome: medicamento.nome,
        dosagem: medicamento.dosagem,
        descricao: medicamento.descricao,

        data_inicio: primeiroAgendamento?.data_inicio,
        data_fim: primeiroAgendamento?.data_fim,

        tipo: primeiroAgendamento?.tipo,

        intervalo_horas:
          primeiroAgendamento?.intervalo_horas,

        compartimento_ids:
          medicamento.agendamentos.map(
            (a) => a.compartimento_id,
          ),

        horarios:
          primeiroAgendamento?.horarios.map((h) =>
            h.horario.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
          ) || [],
      };

      return res.json(resposta);
    } catch (error) {
      logger.error(`[MedicAgendamentoController] ${String(error)}`);

      return res.status(500).json({
        erro: "Erro ao buscar medicamento/agendamento.",
      });
    }
  }
}