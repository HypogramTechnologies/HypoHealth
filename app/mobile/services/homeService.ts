import {api} from "./api";

export async function buscarHomeHeader(usuarioID: string) {
  const response = await api.get(`/home/header/${usuarioID}`);

  return response.data;
}