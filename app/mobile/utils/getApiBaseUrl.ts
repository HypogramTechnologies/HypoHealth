const DEFAULT_API_URL = 'https://hypo-health-backend.onrender.com/api';

export function getApiBaseUrl() {
  const baseUrl = process.env.EXPO_PUBLIC_URL?.trim();
  const port = process.env.EXPO_PUBLIC_PORT?.trim();

  if (!baseUrl) {
    return DEFAULT_API_URL;
  }

  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPort = port ? `:${port}` : '';

  return `${normalizedBaseUrl}${normalizedPort}/api`;
}
