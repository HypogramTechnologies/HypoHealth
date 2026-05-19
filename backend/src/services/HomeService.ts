import prisma from "../database/db";

export class HomeService {
  async header() {
    const hoje = new Date();

    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);

    const fimDia = new Date();
    fimDia.setHours(23, 59, 59, 999);

    const totalMedicamentosHoje = await prisma.retiradaMedicamento.count({
      where: {
        horario_programado: {
          gte: inicioDia,
          lte: fimDia,
        },
      },
    });

    const totalTomadosHoje = await prisma.retiradaMedicamento.count({
      where: {
        horario_programado: {
          gte: inicioDia,
          lte: fimDia,
        },
        status: "RETIRADO",
      },
    });

    const dataAtual = new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(hoje);

    return {
      dataAtual,
      totalMedicamentosHoje,
      totalTomadosHoje,
    };
  }
}
