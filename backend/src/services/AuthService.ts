import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../database/db";

import { UsuarioService } from "./UsuarioService";
import { LoginDTO } from "../dtos/authDTO";
import { CreateUsuarioDTO } from "../dtos/usuarioDTO";
import { EXPIRES_IN } from "../utils/jwt";

const usuarioService = new UsuarioService();

export class AuthService {
  private async montarUsuario(usuarioId: string) {
    // 1. Busca o usuário trazendo seus vínculos com os dispositivos
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: {
        dispositivos: {
          include: {
            dispositivo: true,
          },
        },
      },
    });

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    // 2. Descobre o ID do primeiro dispositivo vinculado (se houver)
    const primeiroDispositivoId = usuario.dispositivos[0]?.dispositivo_id;
    let usuarioProprietarioId: string | null = null;

    // 3. Se houver um dispositivo vinculado, busca especificamente quem é o PROPRIETARIO dele
    if (primeiroDispositivoId) {
      const vinculoProprietario = await prisma.usuarioDispositivo.findFirst({
        where: {
          dispositivo_id: primeiroDispositivoId,
          tipo_acesso: "PROPRIETARIO",
        },
      });

      if (vinculoProprietario) {
        usuarioProprietarioId = vinculoProprietario.usuario_id;
      }
    }

    // 4. Retorna o objeto montado perfeitamente para o Mobile
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      usuario_proprietario_id: usuarioProprietarioId, // Agora com o ID correto e seguro!
      dispositivos: usuario.dispositivos.map((item) => ({
        id: item.dispositivo_id,
        tipo_acesso: item.tipo_acesso,
      })),
    };
  }

  async cadastrar(data: CreateUsuarioDTO) {
    const usuario = await usuarioService.create(data);

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET as string,
      { expiresIn: EXPIRES_IN },
    );

    const usuarioCompleto = await this.montarUsuario(usuario.id);

    return {
      usuario: usuarioCompleto,
      token,
    };
  }

  async login(data: LoginDTO) {
    const usuario = await prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (!usuario) {
      throw new Error("Email ou senha inválidos");
    }

    const senhaValida = await bcrypt.compare(data.senha, usuario.senha);

    if (!senhaValida) {
      throw new Error("Email ou senha inválidos");
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET as string,
      { expiresIn: EXPIRES_IN },
    );

    const usuarioCompleto = await this.montarUsuario(usuario.id);

    return {
      usuario: usuarioCompleto,
      token,
    };
  }
}
