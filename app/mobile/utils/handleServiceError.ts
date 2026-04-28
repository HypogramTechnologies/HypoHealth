export function handleServiceError(error: any): never {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Erro na comunicação com o servidor";

  throw new Error(message);
}