// src/queries/medicamentoQuery.ts

import { Prisma } from "@prisma/client";

export class MedicamentoQuery {
  static montarFiltros(filtros?: any): Prisma.MedicamentoWhereInput {
    const where: Prisma.MedicamentoWhereInput = {};

    /*
     * =====================================
     * MEDICAMENTO
     * =====================================
     */

    if (filtros?.medicamentoNome) {
      where.nome = {
        contains: filtros.medicamentoNome,

        mode: "insensitive",
      };
    }

    if (filtros?.medicamentoDescricao) {
      where.descricao = {
        contains: filtros.medicamentoDescricao,

        mode: "insensitive",
      };
    }

    if (filtros?.medicamentoDosagem) {
      where.dosagem = {
        contains: filtros.medicamentoDosagem,

        mode: "insensitive",
      };
    }

    /*
     * =====================================
     * DATA CRIAÇÃO MEDICAMENTO
     * =====================================
     */

    if (filtros?.criado_em_inicio || filtros?.criado_em_fim) {
      where.criado_em = {};

      if (filtros.criado_em_inicio) {
        const inicio = new Date(filtros.criado_em_inicio);

        inicio.setHours(0, 0, 0, 0);

        where.criado_em.gte = inicio;
      }

      if (filtros.criado_em_fim) {
        const fim = new Date(filtros.criado_em_fim);

        fim.setHours(23, 59, 59, 999);

        where.criado_em.lte = fim;
      }
    }

    /*
     * =====================================
     * AGENDAMENTOS
     * =====================================
     */

    const agendamentoWhere: any = {};

    /*
     * TIPO
     */

    if (filtros?.tipo) {
      agendamentoWhere.tipo = filtros.tipo;
    }

    /*
     * INTERVALO
     */

    if (filtros?.intervalo_horas) {
      agendamentoWhere.intervalo_horas = Number(filtros.intervalo_horas);
    }

    /*
     * DATA INICIO AGENDAMENTO
     */

    if (filtros?.data_inicio) {
      const inicio = new Date(filtros.data_inicio);

      inicio.setHours(0, 0, 0, 0);

      agendamentoWhere.data_inicio = {
        gte: inicio,
      };
    }

    /*
     * DATA FIM AGENDAMENTO
     */

    if (filtros?.data_fim) {
      const fim = new Date(filtros.data_fim);

      fim.setHours(23, 59, 59, 999);

      agendamentoWhere.data_fim = {
        lte: fim,
      };
    }

    /*
     * STATUS
     */

    if (filtros?.status) {
      agendamentoWhere.horarios = {
        some: {
          retiradas: {
            some: {
              status: filtros.status,
            },
          },
        },
      };
    }

    /*
     * APLICA FILTROS AGENDAMENTO
     */

    if (Object.keys(agendamentoWhere).length > 0) {
      where.agendamentos = {
        some: agendamentoWhere,
      };
    }

    return where;
  }
}
