import {api} from './api';

export async function buscarProgramacao(id: string) {
  const response = await api.get(
    `/medicamentos/${id}/hoje`,
  );

  return response.data;
}