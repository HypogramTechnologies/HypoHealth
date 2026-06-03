import { api } from "./api";

export interface RetiradaMedicamentoMedicamentoDTO {
  nome: string;
  descricao: string | null;
  dosagem: string | null;
}

export interface RetiradaMedicamentoAgendamentoDTO {
  medicamento?: RetiradaMedicamentoMedicamentoDTO | null;
}

export interface RetiradaMedicamentoHorarioDTO {
  agendamento?: RetiradaMedicamentoAgendamentoDTO | null;
}

export interface RetiradaMedicamentoResponse {
  id: string;
  horario_programado: string;
  horario_retirada: string | null;
  status: "PENDENTE" | "ATRASADO" | "RETIRADO" | "NAO_RETIRADO";
  agendamentoHorario?: RetiradaMedicamentoHorarioDTO | null;
}

const ENDPOINT = "/retirada-medicamentos";

export const RetiradaMedicamentoService = {
  async getAlertas(usuarioId: string): Promise<RetiradaMedicamentoResponse[]> {
    const response = await api.get(`${ENDPOINT}/alertas/${usuarioId}`);
    return response.data;
  },

  async getHistorico(usuarioId: string): Promise<RetiradaMedicamentoResponse[]> {
    const response = await api.get(`${ENDPOINT}/historico/${usuarioId}`);
    return response.data;
  },
};
