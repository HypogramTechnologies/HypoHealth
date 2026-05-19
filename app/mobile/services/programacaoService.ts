import {api} from './api';

export async function buscarProgramacao() {
  const response = await api.get(
    '/medic-agendamento-query/hoje',
  );

  return response.data;
}