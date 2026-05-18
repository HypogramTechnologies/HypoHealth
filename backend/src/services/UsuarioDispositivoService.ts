import prisma from "../database/db";

type CreateUsuarioDispositivoDTO = {
  usuario_id: string;
  dispositivo_id: string;
  tipo_acesso: "PROPRIETARIO" | "RESPONSAVEL";
};

export class UsuarioDispositivoService {
  async create(
    dados: CreateUsuarioDispositivoDTO,
  ) {
    try {
      console.log(
        `[UsuarioDispositivoService] Criando vínculo usuário/dispositivo`,
      );

      const resultado =
        await prisma.usuarioDispositivo.create({
          data: dados,
        });

      console.log(
        `[UsuarioDispositivoService] ✅ Vínculo criado`,
      );

      return resultado;
    } catch (error) {
      console.error(
        `[UsuarioDispositivoService] ❌ Erro ao criar vínculo`,
        error,
      );

      throw error;
    }
  }

  async getByDispositivo(
    dispositivo_id: string,
  ) {
    try {
      console.log(
        `[UsuarioDispositivoService] Buscando usuários do dispositivo ${dispositivo_id}`,
      );

      const usuarios =
        await prisma.usuarioDispositivo.findMany({
          where: {
            dispositivo_id,
          },

          include: {
            usuario: true,
          },
        });

      console.log(
        `[UsuarioDispositivoService] ✅ ${usuarios.length} usuários encontrados`,
      );

      return usuarios;
    } catch (error) {
      console.error(
        `[UsuarioDispositivoService] ❌ Erro ao buscar usuários`,
        error,
      );

      throw error;
    }
  }

  async getByUsuario(
    usuario_id: string,
  ) {
    try {
      console.log(
        `[UsuarioDispositivoService] Buscando dispositivos do usuário ${usuario_id}`,
      );

      const dispositivos =
        await prisma.usuarioDispositivo.findMany({
          where: {
            usuario_id,
          },

          include: {
            dispositivo: true,
          },
        });

      console.log(
        `[UsuarioDispositivoService] ✅ ${dispositivos.length} dispositivos encontrados`,
      );

      return dispositivos;
    } catch (error) {
      console.error(
        `[UsuarioDispositivoService] ❌ Erro ao buscar dispositivos`,
        error,
      );

      throw error;
    }
  }

  async delete(id: string) {
    try {
      console.log(
        `[UsuarioDispositivoService] Removendo vínculo ${id}`,
      );

      const resultado =
        await prisma.usuarioDispositivo.delete({
          where: { id },
        });

      console.log(
        `[UsuarioDispositivoService] ✅ Vínculo removido`,
      );

      return resultado;
    } catch (error) {
      console.error(
        `[UsuarioDispositivoService] ❌ Erro ao remover vínculo`,
        error,
      );

      throw error;
    }
  }
}