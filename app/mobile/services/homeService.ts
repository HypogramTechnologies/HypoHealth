import {api} from "./api";

export async function buscarHomeHeader() {
  const response = await api.get("/home/header");

  return response.data;
}