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

export interface AbastecerCompartimentoDTO {
  posicao: number;
  numero_serie: string;
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

  async reabrirRetirada(retiradaId: string): Promise<RetiradaMedicamentoResponse> {
    const response = await api.post(`${ENDPOINT}/reabrir/${retiradaId}`);
    return response.data;
  },

  async abastecerCompartimento(
  data: AbastecerCompartimentoDTO,
): Promise<void> {
  await api.post(`${ENDPOINT}/abastecer`, data);
},
  
};
