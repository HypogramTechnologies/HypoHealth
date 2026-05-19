import prisma from "../database/db";

export class DispositivoService {
  async getPrimeiro() {
    try {
      console.log(
        `[DispositivoService] Buscando primeiro dispositivo cadastrado`,
      );

      const dispositivo = await prisma.dispositivo.findFirst({
        orderBy: {
          criado_em: "asc",
        },

        select: {
          id: true,
          nome: true,
          criado_em: true,
        },
      });

      if (!dispositivo) {
        console.log(`[DispositivoService] ⚠️ Nenhum dispositivo encontrado`);

        return null;
      }

      console.log(
        `[DispositivoService] ✅ Dispositivo encontrado: ${dispositivo.id}`,
      );

      return dispositivo;
    } catch (error) {
      console.error(
        `[DispositivoService] ❌ Erro ao buscar dispositivo:`,
        error,
      );

      throw error;
    }
  }
}
