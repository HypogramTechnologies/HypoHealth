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
    const usuario = await prisma.usuario.findUnique({
      where: {
        id: usuarioId,
      },

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

    const proprietario = await prisma.usuarioDispositivo.findFirst({
      where: {
        // dispositivo_id:
        //   usuario.dispositivos[0]
        //     ?.dispositivo_id,

        tipo_acesso: "PROPRIETARIO",
      },

      include: {
        usuario: true,
      },
    });

    return {
      id: usuario.id,

      nome: usuario.nome,

      email: usuario.email,

      usuario_proprietario_id: proprietario?.usuario_id,

      dispositivos: usuario.dispositivos.map((item) => ({
        id: item.dispositivo_id,

        tipo_acesso: item.tipo_acesso,
      })),
    };
  }

  async cadastrar(data: CreateUsuarioDTO) {
    const usuario = await usuarioService.create(data);

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
      },

      process.env.JWT_SECRET as string,

      {
        expiresIn: EXPIRES_IN,
      },
    );

    const usuarioCompleto = await this.montarUsuario(usuario.id);

    return {
      usuario: usuarioCompleto,
      token,
    };
  }

  async login(data: LoginDTO) {
    const usuario = await prisma.usuario.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!usuario) {
      throw new Error("Email ou senha inválidos");
    }

    const senhaValida = await bcrypt.compare(data.senha, usuario.senha);

    if (!senhaValida) {
      throw new Error("Email ou senha inválidos");
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
      },

      process.env.JWT_SECRET as string,

      {
        expiresIn: EXPIRES_IN,
      },
    );

    const usuarioCompleto = await this.montarUsuario(usuario.id);

    return {
      usuario: usuarioCompleto,
      token,
    };
  }
}
