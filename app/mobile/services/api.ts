import axios from 'axios';
import cors from "cors";

const API_URL = `${process.env.EXPO_PUBLIC_URL}${process.env.EXPO_PUBLIC_PORT ? `:${process.env.EXPO_PUBLIC_PORT}` : ''}/api`;
console.log('api_url', API_URL);

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.erro ||
      'Erro na comunicação com o servidor';

    return Promise.reject(new Error(message));
  }
);



export function setAuthorizationToken(
  token: string | null
) {
  if (token) {
    api.defaults.headers.common.Authorization =
      `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common
      .Authorization;
  }
}