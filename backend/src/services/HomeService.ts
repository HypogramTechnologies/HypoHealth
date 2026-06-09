import prisma from "../database/db";
import { MedicAgendamentoQueryService } from "./MedicAgendamentoQueryService";

export class HomeService {
  private medicService = new MedicAgendamentoQueryService();

  async header(usuarioId: string) {
    const hoje = new Date();
    const medicamentosHoje =
      await this.medicService.getMedicamentosDoDia(usuarioId);

    // total de horários do dia
    const totalMedicamentosHoje = medicamentosHoje.reduce(
      (total, medicamento) => total + medicamento.horarios.length,
      0,
    );

    // total retirado
    const totalTomadosHoje = medicamentosHoje.reduce(
      (total, medicamento) =>
        total +
        medicamento.horarios.filter((h) => h.status === "RETIRADO").length,
      0,
    );

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
