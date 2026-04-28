import axios from 'axios';
// import { API_URL } from '../config/env.d';

const API_URL = 'http://192.168.100.78:3001';
console.log('api_url',API_URL)
export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});



api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      "Erro na comunicação com o servidor";

    // ❗ Aqui é o segredo:
    return Promise.reject(new Error(message));
  }
);