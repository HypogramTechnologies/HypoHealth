import axios from 'axios';
import { getApiBaseUrl } from '../utils/getApiBaseUrl';

console.log('api_url', getApiBaseUrl());

export const api = axios.create({
  baseURL: getApiBaseUrl(),
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